import jwt from "jsonwebtoken";
import client from "../client";
import axios from "axios";

export const loggedInUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const user = await client.user.findUnique({ where: { id: (JwtPayload as any)?.id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const isLoggedIn = async (token: string, token_method: string) => {
  try {
    console.log("11");
    console.log(token);
    console.log(token_method);
    if (token_method === "kakao") {
      console.log("22");
      const { data } = await axios({
        method: "GET",
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        url: `https://kapi.kakao.com/v1/user/access_token_info`,
      });
      if (!data.code) {
        console.log("33");
        if (data.expires_in < 25000) {
          console.log("44");
          const { refreshToken } = (await client.user.findFirst({ where: { kakaoId: `${data.id}` } })) as any;
          console.log(refreshToken);
          // 리프레시 토큰 만료시간 저장해야됨
          //만료되어있다면?
          //로그아웃 시키기

          //리프레시 기간이 남아있다면
          // 갱신
          const {
            data: { access_token, refresh_token, refresh_token_expires_in },
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
          console.log(access_token);
          if (refresh_token) {
            const updated = await client.user.update({ where: { kakaoId: `${data.id}` }, data: { refreshToken } });
            if (updated) {
              return {
                success: true,
                access_token,
              };
            }
          }
          return {
            success: true,
            access_token,
          };
        }
        return {
          success: false,
        };
      }
      return {
        success: false,
        message: "카카오 토큰 확인 실패",
      };
    }
    if (token_method === "email") {
      const JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      console.log(JwtPayload);
    }
    // const { data } = await axios({
    //   method: "GET",
    //   withCredentials: true,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   url: `https://kapi.kakao.com/v1/user/access_token_info`,
    // });
    // if (!data) {
    //   console.log("22");
    // }
    // console.log(token);
    // const JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // console.log(JwtPayload);
    console.log("11");
  } catch (e) {
    console.log(e);
    return null;
  }
};
