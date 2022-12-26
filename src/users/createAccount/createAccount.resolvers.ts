import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ip from "ip";
import parser from "ua-parser-js";

interface createAccount {
  username: string;
  email: string;
  password: string;
}
const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (_, { username, email, password }: createAccount, { req }) => {
      try {
        const isUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (isUser) {
          return {
            success: false,
            message: "이미 가입된 회원입니다.",
          };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const created = await client.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        });
        if (!created) {
          return {
            success: false,
            message: "회원가입에 실패했습니다.",
          };
        }

        const access_token = jwt.sign({ id: created?.id }, process.env.JWT_SECRET_KEY as string);
        const refresh_token = jwt.sign({ id: created?.id }, process.env.JWT_SECRET_KEY as string);
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
          message: "회원가입을 축하합니다.",
          id: created.id,
          token: access_token,
          tokenTime: expires_in,
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
