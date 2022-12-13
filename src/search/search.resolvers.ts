import { Resolvers } from "../types";
import client from "../client";
interface keyword {
  keyword: string;
}
const resolvers: Resolvers = {
  Query: {
    search: async (_, { keyword }: keyword) => {
      try {
        const feed = await client.feed.findMany({
          where: {
            body: {
              contains: keyword,
            },
          },
        });
        const feedByTag = await client.feed.findMany({
          where: {
            hashtag: {
              name: {
                contains: keyword,
              },
            } as any,
          },
        });
        const user = await client.user.findMany({
          where: {
            OR: [
              { username: { contains: keyword } },
              { email: { contains: keyword } },
              { introduction: { contains: keyword } },
            ],
          },
        });
        if (feed || feedByTag || user) {
          return {
            success: true,
            feed,
            feedByTag,
            user,
          };
        } else {
          return {
            success: false,
            message: "검색 결과가 없습니다.",
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
