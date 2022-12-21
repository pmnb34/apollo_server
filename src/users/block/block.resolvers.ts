import { Resolvers } from "../../types";
import client from "../../client";

interface block {
  id?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    blocking: async (_, { id }: block, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const isUser = await client.user.findFirst({ where: { id } });
          if (isUser) {
            const updated = await client.user.update({
              where: {
                id: loggedInUser.id as string,
              },
              data: {
                blocking: {
                  connect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (!updated) {
              return {
                success: false,
                message: "차단에 실패했습니다.",
              };
            }
            return {
              success: true,
              message: "차단에 성공했습니다.",
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

    unblocking: async (_, { id }: block, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const isUser = await client.user.findFirst({ where: { id } });
          if (isUser) {
            const updated = await client.user.update({
              where: {
                id: loggedInUser.id as string,
              },
              data: {
                blocking: {
                  disconnect: {
                    id: id as undefined,
                  },
                },
              },
            });
            if (!updated) {
              return {
                success: false,
                message: "차단풀기에 실패했습니다.",
              };
            }
            return {
              success: true,
              message: "차단풀기에 성공했습니다.",
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
