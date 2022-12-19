import { Resolvers } from "../../types";
import client from "../../client";
import { FEED_CREATE_POINT } from "../../enum";

interface deleteFeed {
  id: number;
  body?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    deleteFeed: async (_, { id }: deleteFeed, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const deleted = await client.feed.update({
            where: {
              id,
              userId: loggedInUser.id
            } as any,
            data: {
              isPublic: false
            },
          });
          const updated = await client.point.update({
            where: {
              userId: loggedInUser.id
            },
            data: {
              body: { decrement: FEED_CREATE_POINT },
              history: {
                create: {
                  body: -FEED_CREATE_POINT,
                  feedId: deleted?.id
                } as any
              }
            },
          })
          if (!deleted) {
            return {
              success: false,
              message: "피드를 삭제하지 못했습니다.",
            };
          }
          if (!updated) {
            return {
              success: false,
              message: "포인트 변경에 실패했습니다.",
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
