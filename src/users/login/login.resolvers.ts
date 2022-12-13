import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ip from "ip";
import parser from "ua-parser-js";

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
        const passwordCompare = await bcrypt.compare(password, isUser.password);
        if (!passwordCompare) {
          return {
            success: false,
            message: "이메일 또는 비밀번호를 확인해주세요.",
          };
        }
        const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET_KEY as string);
        const ipAddress = ip.address();
        const ua = parser(req.headers["user-agent"]);
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
  },
};
export default resolvers;
