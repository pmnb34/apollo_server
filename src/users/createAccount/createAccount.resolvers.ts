import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";

interface createAccount {
  name: string;
  username: string;
  email: string;
  password: string;
}
const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (_, { name, username, email, password }: createAccount) => {
      try {
        const existUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existUser) {
          return {
            success: false,
            message: "이미 가입된 회원입니다.",
          };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword,
          },
        });
        return {
          success: true,
          message: "회원가입을 축하합니다.",
        };
      } catch (e) {
        return {
          success: false,
          message: "회원가입에 실패했습니다.",
        };
      }
    },
  },
};
export default resolvers;
