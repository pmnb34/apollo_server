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
          take: 2,
        });
      }
      return client.feed.findMany({
        skip: 1,
        cursor: {
          id,
        },
      });
    },
  },
};
export default resolvers;
