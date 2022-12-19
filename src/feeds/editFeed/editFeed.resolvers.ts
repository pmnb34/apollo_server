import { Resolvers } from "../../types";
import client from "../../client";

interface editFeed {
  id: number;
  body: string;
  tags: [string];
  images: [string];
  isPrivate: boolean;
}

const resolvers: Resolvers = {
  Mutation: {
    editFeed: async (_, { id, body, tags, images, isPrivate }: editFeed, { loggedInUser }) => {
      try {
        if (loggedInUser) {
          const updated = await client.feed.update({
            where: {
              id,
              userId: loggedInUser.id
            } as any,
            data: {
              body,
              images,
              isPrivate,
              tags: {
                deleteMany: {},
                connectOrCreate: tags.map((tag) => {
                  return {
                    where: { name: tag },
                    create: { name: tag },
                  };
                }),
              },
            },
          });
          if (!updated) {
            return {
              success: false,
              message: "피드를 업데이트하지 못했습니다.",
            };
          }
          return {
            success: true,
            message: "피드를 업데이트했습니다.",
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
