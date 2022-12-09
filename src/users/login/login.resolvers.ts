import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface login {
  email: string;
  password: string;
}

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { email, password }: login) => {
      try {
        const user = await client.user.findFirst({
          where: {
            email,
          },
        });
        if (!user) {
          return {
            success: false,
            message: "회원정보를 확인해주세요.",
          };
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return {
            success: false,
            message: "비밀번호를 확인하세요.",
          };
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string);
        return {
          success: true,
          message: "로그인을 환영합니다.",
          token,
        };
      } catch (e) {
        return {
          success: false,
          message: "로그인에 실패했습니다.",
        };
      }
    },
  },
};
export default resolvers;
