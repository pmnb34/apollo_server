import { Resolvers } from "../../types";
import client from "../../client";

const resolvers: Resolvers = {
  Query: {
    profile: (_, { username }) => {
      try {
        return client.user.findFirst({
          where: {
            username,
          },
          select: {
            id: true,
            username: true,
            email: true,
          },
        });
      } catch (error) {
        return null;
      }
    },
  },
};
export default resolvers;
