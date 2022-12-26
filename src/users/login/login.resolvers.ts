import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ip from "ip";
import parser from "ua-parser-js";
import axios from "axios";
import { setTokenTime } from "../../enum";
import { emailRefreshTokenFn, kakaoRefreshTokenFn } from "./login.utils";
interface login {
  email: string;
  password: string;
}

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }: login, { req }) => {
      try {
        const isUser = await client.user.findFirst({
          where: {
            email,
          },
        });
        if (!isUser) {
          return {
            success: false,
            message: "회원정보를 확인해주세요.",
          };
        }
        const passwordCompare = await bcrypt.compare(password, isUser.password as string);
        if (!passwordCompare) {
          return {
            success: false,
            message: "이메일 또는 비밀번호를 확인해주세요.",
          };
        }
        const access_token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
        const refresh_token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
        const expires_in = 21600;
        const refresh_token_expires_in = String(Number(Math.ceil(Date.now() / 1000)) + Number(5259600));
        const ipAddress = ip.address();
        const ua = parser(req?.headers["user-agent"]);
        const updated = await client.user.update({
          where: {
            email,
          },
          data: {
            refreshToken: refresh_token,
            refreshTokenExpiredTime: refresh_token_expires_in,
            loginHistory: {
              create: {
                ipAddress,
                userAgent: ua.ua,
              },
            },
          },
        });
        if (!updated) {
          return {
            success: false,
            message: "로그인에 실패했습니다.",
          };
        }
        return {
          success: true,
          id: updated.id,
          token: access_token,
          tokenTime: expires_in,
          message: "로그인에 성공했습니다.",
        };
      } catch (e) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
    kakao: async (_, { token }: any, { req }) => {
      try {
        const {
          data: { access_token, refresh_token, expires_in, refresh_token_expires_in },
        } = await axios({
          method: "POST",
          data: {
            grant_type: "authorization_code",
            client_id: process.env.KAKAO_LOGIN_CLIENT_ID,
            redirect_uri: process.env.KAKAO_LOGIN_REDIRECT_URI,
            code: token,
          },
          withCredentials: true,
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          url: `https://kauth.kakao.com/oauth/token`,
        });
        if (!access_token || !refresh_token || !expires_in || !refresh_token_expires_in) {
          return {
            success: false,
            message: "토큰 발행 실패",
          };
        }
        const {
          data: { id, kakao_account },
        } = await axios({
          method: "GET",
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          url: `https://kapi.kakao.com/v2/user/me`,
        });
        if (!id || !kakao_account) {
          return {
            success: false,
            message: "유저 정보 없음",
          };
        }
        const isUser = await client.user.findFirst({
          where: {
            kakaoId: `${id}`,
          },
        });
        const ipAddress = ip.address();
        const ua = parser(req?.headers["user-agent"]);
        // 회원없음
        if (!isUser) {
          const created = await client.user.create({
            data: {
              username: kakao_account?.profile?.nickname || null,
              email:kakao_account?.email || null,
              profile: {
                create: {
                  name: kakao_account?.profile?.nickname || null,
                  avatar: kakao_account?.profile?.profile_image_url || null,
                },
              },
              loginHistory: {
                create: {
                  ipAddress,
                  userAgent: ua.ua,
                },
              },
              kakaoId: `${id}`,
              refreshToken: refresh_token,
              refreshTokenExpiredTime: String(setTokenTime(refresh_token_expires_in)),
            },
          });
          if (!created) {
            return {
              success: false,
              message: "소셜 회원가입 실패",
            };
          }
          return {
            success: true,
            message: "소셜 회원가입 성공",
            id: created.kakaoId,
            token: access_token,
            tokenTime: expires_in,
          };
        }
        // 회원있음
        const updated = await client.user.update({
          where: {
            kakaoId: `${id}`,
          },
          data: {
            refreshToken: refresh_token,
            refreshTokenExpiredTime: String(setTokenTime(refresh_token_expires_in)),
            loginHistory: {
              create: {
                ipAddress,
                userAgent: ua.ua,
              },
            },
          },
        });
        if (!updated) {
          return {
            success: false,
            message: "소셜 로그인 실패",
          };
        }
        return {
          success: true,
          message: "소셜 로그인 성공",
          id: updated.kakaoId,
          token: access_token,
          tokenTime: expires_in,
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
  },
  Query: {
    refreshToken: async (_, { id, token, method }: any, { req }) => {
      try {
        switch (method) {
          case "kakao":
            return await kakaoRefreshTokenFn(id, token, method);
          case "email":
            return await emailRefreshTokenFn(id, token, method);
          default:
            return {
              success: false,
              message: "작업 실패",
            };
        }
      } catch (e) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
  },
};
export default resolvers;
