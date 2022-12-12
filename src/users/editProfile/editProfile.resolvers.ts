import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";

interface editProfile {
  name?: string;
  username?: string;
  password?: string;
  avatar?: string;
  introduction?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    editProfile: async (_, { name, username, password, avatar, introduction }: editProfile, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const hashedPassword = await bcrypt.hash(password as string, 10);
          const updated = await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              name,
              username,
              password: hashedPassword,
              avatar,
              introduction,
            },
          });
          if (!updated) {
            return {
              success: false,
              message: "프로필을 업데이트하지 못했습니다.",
            };
          }
          return {
            success: true,
            message: "프로필을 업데이트했습니다",
          };
        }
      } catch (err) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
  },
};
export default resolvers;
