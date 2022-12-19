import { Resolvers } from "../../types";
import client from "../../client";
import { FEED_CREATE_POINT } from "../../enum";

interface createFeed {
  body: string;
  tags: [string];
  images: [string];
  isPrivate: boolean;
}
const resolvers: Resolvers = {
  Mutation: {
    createFeed: async (_, { body, tags, images, isPrivate }: createFeed, { loggedInUser }) => {
      try {
        if (!loggedInUser) {
          return {
            success: false,
            message: "로그인이 필요합니다.",
          };
        }
        const created = await client.feed.create({
          data: {
            userId: loggedInUser.id,
            body,
            images,
            isPrivate,
            tags: {
              connectOrCreate: tags.map((tag) => {
                return {
                  where: { name: tag },
                  create: { name: tag },
                };
              }),
            },

          },
        });
        const updated = await client.point.upsert({
          where: {
            userId: loggedInUser.id
          },
          update: {
            body: { increment: FEED_CREATE_POINT },
            history: {
              create: { body: FEED_CREATE_POINT, feedId: created?.id },
            },
          },
          create: {
            userId: loggedInUser.id,
            body: FEED_CREATE_POINT,
            history: {
              create: { body: FEED_CREATE_POINT, feedId: created?.id },
            },
          },
        } as any)
        if (!created) {
          return {
            success: false,
            message: "피드작성에 실패했습니다.",
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
          message: "피드작성에 성공했습니다.",
        };
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
