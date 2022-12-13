import { Resolvers } from "../../types";
import client from "../../client";

interface feed {
  id: number;
}

const resolvers: Resolvers = {
  Query: {
    feed: async (_, { id }: feed, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const isFeed = await client.feed.findFirst({
            where: {
              id,
            },
          });
          if (!isFeed) {
            return {
              success: false,
              message: "피드 정보가 없습니다. ",
            };
          }
          return {
            success: true,
            message: "피드 정보입니다.",
            feed:isFeed
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
