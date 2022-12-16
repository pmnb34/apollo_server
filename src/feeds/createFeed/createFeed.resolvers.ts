import { Resolvers } from "../../types";
import client from "../../client";

interface createFeed {
  body: string;
}
const resolvers: Resolvers = {
  Mutation: {
    createFeed: async (_, { body }: createFeed, { loggedInUser }) => {
      try {
        // hasTags => 바디 텍스트에서 #태그 리스트 생성
        const tags = ["tag", "태그", "태그 추가", "다른태그"];
        const created = await client.feed.create({
          data: {
            userId: 1,
            body,
            tags: {
              connectOrCreate: tags.map((tag) => {
                return {
                  where: { name: tag },
                  create: { name: tag },
                };
              }),
            },
            point: {
              create: {
                userId: 1,
                body: 100, // 피드 작성시 포인트
              } as any,
            },
          },
        });
        if (!created) {
          return {
            success: false,
            message: "피드작성에 실패했습니다.",
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
