import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";

interface following {
  id?: number;
}

const resolvers: Resolvers = {
  Mutation: {
    following: async (_, { id }: following, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const followingUser = await client.user.findFirst({ where: { id } });
          if (followingUser) {
            const update = await client.user.update({
              where: {
                id: loggedInUser.id as number,
              },
              data: {
                followings: {
                  connect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (update) {
              return {
                success: true,
                message: "팔로잉 성공",
              };
            }
          }
          return {
            success: false,
            message: "유저가 없습니다.",
          };
        }
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: "팔로잉 실패",
        };
      }
    },

    unfollowing: async (_, { id }: following, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const followingUser = await client.user.findFirst({ where: { id } });
          if (followingUser) {
            const update = await client.user.update({
              where: {
                id: loggedInUser.id as number,
              },
              data: {
                followings: {
                  disconnect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (update) {
              return {
                success: true,
                message: "언팔로우 성공",
              };
            }
          }
          return {
            success: false,
            message: "유저가 없습니다.",
          };
        }
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: "언팔로우 실패",
        };
      }
    },
  },
};
export default resolvers;
