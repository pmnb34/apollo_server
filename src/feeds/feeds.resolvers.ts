import { Resolvers } from "../types";
import client from "../client";

interface feeds {
  id: number;
}

const resolvers: Resolvers = {
  Query: {
    allFeeds: (_, { id }: feeds) => {
      if (!id) {
        return client.feed.findMany({
          take: 4,
          orderBy: {
            id: "desc",
          },
          include: {
            user: { include: { profile: true } },
            images: true,
          },
        });
      }
      return client.feed.findMany({
        // skip: 1,
        // cursor: {
        //   id,
        // },
        include: { user: true },
      });
    },
  },
};
export default resolvers;
