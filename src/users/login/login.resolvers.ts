import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ip from "ip";
import parser from "ua-parser-js";
import axios from "axios";

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
        const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
        const ipAddress = ip.address();
        const ua = parser(req?.headers["user-agent"]);
        const created = await client.loginHistory.create({
          data: {
            userId: isUser.id,
            ipAddress,
            userAgent: ua.ua,
          },
        });
        if (!created) {
          return {
            success: false,
            message: "로그인에 실패했습니다.",
          };
        }
        return {
          success: true,
          message: "로그인에 성공했습니다.",
          token,
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
        console.log(Date.now());
        console.log(expires_in);
        console.log(refresh_token_expires_in);
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
              // refreshTokenExpiredTime: Date.now()+refresh_token_expires_in
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
            // refreshTokenExpiredTime: Date.now()+refresh_token_expires_in
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
        //     // 추후 acc 확인 -> 만료? -> 재발급 실행,
        //     // access_token Front 전달  & refresh_token DB 저장
        //     // refresh_token -> 만료? -> 강제 로그아웃
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
        console.log(id);
        console.log(token);
        console.log(method);

        const { refreshToken, kakaoId } = (await client.user.findFirst({ where: { kakaoId: `${id}` } })) as any;
        console.log(refreshToken);
        // if(refresh_token_expires_in){
        // return {
        //   success: false,
        //   message: "토큰 재발급 실패",
        // };
        // }
        const {
          data: { access_token, refresh_token, expires_in, refresh_token_expires_in },
        } = await axios({
          method: "POST",
          data: {
            grant_type: "refresh_token",
            client_id: process.env.KAKAO_LOGIN_CLIENT_ID,
            refresh_token: `${refreshToken}`,
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          url: `https://kauth.kakao.com/oauth/token`,
        });
        if (refresh_token) {
          const updated = await client.user.update({ where: { kakaoId: `${id}` }, data: { refreshToken } });
          if (!updated) {
            return {
              success: false,
              message: "토큰 갱신 실패",
            };
          }
          return {
            success: true,
            id: updated.kakaoId,
            token: access_token,
            tokenTime: expires_in,
            method: "kakao",
          };
        }
        return {
          success: true,
          id: kakaoId,
          token: access_token,
          tokenTime: expires_in,
          method: "kakao",
        };
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
