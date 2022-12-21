import { Resolvers } from "../../types";
import client from "../../client";

interface following {
  id?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    following: async (_, { id }: following, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const followingUser = await client.user.findFirst({ where: { id } });
          if (followingUser) {
            const updated = await client.user.update({
              where: {
                id: loggedInUser.id as string,
              },
              data: {
                followings: {
                  connect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (!updated) {
              return {
                success: false,
                message: "팔로잉에 실패했습니다.",
              };
            }
            return {
              success: true,
              message: "팔로잉에 성공했습니다.",
            };
          }
          return {
            success: false,
            message: "로그인이 필요합니다.",
          };
        }
      } catch (e) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },

    unfollowing: async (_, { id }: following, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const followingUser = await client.user.findFirst({ where: { id } });
          if (followingUser) {
            const updated = await client.user.update({
              where: {
                id: loggedInUser.id as string,
              },
              data: {
                followings: {
                  disconnect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (!updated) {
              return {
                success: false,
                message: "언팔로우에 실패했습니다.",
              };
            }
            return {
              success: true,
              message: "언팔로우에 성공했습니다.",
            };
          }
          return {
            success: false,
            message: "로그인이 필요합니다.",
          };
        }
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
