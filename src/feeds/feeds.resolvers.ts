import { Resolvers } from "../types";
import client from "../client";

const resolvers: Resolvers = {
  Query: {
    allFeeds: (_, __) => {
      return client.feed.findMany();
    },
  },
};
export default resolvers;
