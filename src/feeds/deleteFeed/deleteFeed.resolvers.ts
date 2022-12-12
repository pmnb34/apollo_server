import { Resolvers } from "../../types";
import client from "../../client";

interface deleteFeed {
  id: number;
  body?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    deleteFeed: async (_, { id }: deleteFeed, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const deleted = await client.feed.delete({
            where: {
              id,
            },
          });
          if (!deleted) {
            return {
              success: false,
              message: "피드를 삭제하지 못했습니다.",
            };
          }
          return {
            success: true,
            message: "피드를 삭제했습니다.",
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
