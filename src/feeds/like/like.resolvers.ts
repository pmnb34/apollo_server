import { Resolvers } from "../../types";
import client from "../../client";

interface like {
  id: number;
}

const resolvers: Resolvers = {
  Mutation: {
    like: async (_, { id }: like, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const updated = await client.feed.update({
            where: {
              id,
            },
            data: {
              like: {
                create: {
                  userId: loggedInUser.id,
                } as any,
              },
            },
          });
          if (!updated) {
            return {
              success: false,
              message: "Like 실패",
            };
          }
          return {
            success: true,
            message: "Like 성공",
          };
        }
      } catch (e) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
    unlike: async (_, { id }: like, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const updated = await client.feed.update({
            where: {
              id,
            },
            data: {
              like: {
                delete: {
                  userId: loggedInUser.id,
                } as any,
              },
            },
          });
          if (!updated) {
            return {
              success: false,
              message: "unLike 실패",
            };
          }
          return {
            success: true,
            message: "unLike 성공",
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
