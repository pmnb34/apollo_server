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
          if (updated) {
            return {
              success: true,
              message: "업데이트 성공",
            };
          } else {
            return {
              success: false,
              message: "업데이트 실패",
            };
          }
        }
      } catch (err) {
        return {
          success: false,
          message: "업데이트 실패",
        };
      }
    },
  },
};
export default resolvers;
