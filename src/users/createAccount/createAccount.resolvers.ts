import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";

interface createAccount {
  username: string;
  email: string;
  password: string;
}
const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (_, { username, email, password }: createAccount) => {
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
        return {
          success: true,
          message: "회원가입을 축하합니다.",
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
