import jwt from "jsonwebtoken";
import client from "../client";
import axios from "axios";

export const loggedInUser = async (token: string, method: string) => {
  try {
    switch (method) {
      case "kakao":
        return await kakao_LoggedInUser(token);
      case "email":
        return await email_LoggedInUser(token);
      default:
        return null;
    }
  } catch {
    return null;
  }
};

const kakao_LoggedInUser = async (token: string) => {
  const {
    data: { id },
  } = await axios({
    method: "GET",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    url: `https://kapi.kakao.com/v2/user/me`,
  });
  const user = await client.user.findUnique({ where: { kakaoId: id } });
  if (user) {
    return user;
  } else {
    return null;
  }
};
const email_LoggedInUser = async (token: string) => {
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
};
