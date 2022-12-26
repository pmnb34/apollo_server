import client from "../../client";
import jwt from "jsonwebtoken";
import axios from "axios";

export const emailRefreshTokenFn = async (id: any, token: any, method: any) => {
  const JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  const isUser = await client.user.findUnique({ where: { id: (JwtPayload as any)?.id } });
  if (!isUser) {
    return {
      success: false,
      message: "로그아웃",
    };
  }
  const nowTime = Math.ceil(Date.now() / 1000);
  const gap = Number(isUser.refreshTokenExpiredTime) - Number(nowTime);
  if (gap < 10800) {
    // 남은시간 3시간 미만 로그아웃
    return {
      success: false,
      message: "로그아웃",
    };
  }
  if (gap < 2629800) {
    // 남은기간 1개월 미만
    const refresh_token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
    const refresh_token_expires_in = String(Number(Math.ceil(Date.now() / 1000)) + Number(5259600));
    await client.user.update({
      where: {
        id: isUser.id,
      },
      data: {
        refreshToken: refresh_token,
        refreshTokenExpiredTime: refresh_token_expires_in,
      },
    });
  }
  const access_token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
  const expires_in = 21600;

  return {
    success: true,
    id: isUser.id,
    token: access_token,
    tokenTime: expires_in,
    method: "email",
    message: "토큰 갱신 성공",
  };
};
export const kakaoRefreshTokenFn = async (id: any, token: any, method: any) => {
  const {
    data: { id: tokenId },
  }: any = await axios({
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    url: `https://kapi.kakao.com/v1/user/access_token_info`,
  });
  if (!tokenId) {
    return {
      success: false,
      message: "토큰 확인 실패",
    };
  }
  const { kakaoId, refreshToken, refreshTokenExpiredTime }: any = await client.user.findFirst({
    where: { kakaoId: `${tokenId}` },
  });
  const nowTime = Math.ceil(Date.now() / 1000);
  const gap = Number(refreshTokenExpiredTime) - Number(nowTime);
  if (gap < 10800) {
    // 남은시간 3시간 미만 로그아웃
    return {
      success: false,
      message: "로그아웃",
    };
  }
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
    const updated = await client.user.update({
      where: { kakaoId },
      data: { refreshToken: refresh_token, refreshTokenExpiredTime: refresh_token_expires_in },
    });
    if (!updated) {
      return {
        success: false,
        message: "토큰 갱신 실패",
      };
    }
    return {
      success: true,
      id: kakaoId,
      token: access_token,
      tokenTime: expires_in,
      method: "kakao",
      message: "토큰 갱신 성공",
    };
  }
  return {
    success: true,
    id: kakaoId,
    token: access_token,
    tokenTime: expires_in,
    method: "kakao",
    message: "토큰 갱신 성공",
  };
};
