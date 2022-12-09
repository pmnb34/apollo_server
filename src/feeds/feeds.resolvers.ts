import { Resolvers } from "../types";
import client from "../client";

const resolvers: Resolvers = {
  Query: {
    allFeeds: (_, __, { loggedInUser }) => {
      return client.feed.findMany({
        where: {
          OR: [
            {
              userId: loggedInUser.id,
            },
          ],
        },
      });
    },
  },
};
export default resolvers;
