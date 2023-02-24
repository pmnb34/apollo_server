import { Resolvers } from "../types";
import client from "../client";
import jwt from "jsonwebtoken";

const resolvers: Resolvers = {
  Query: {
    allUsers: (_, __, { loggedInUser }) => {
      // if (loggedInUser) {
      return client.user.findMany({
        include: { profile: true },
      });
      // }
      return null;
    },
  },
};
export default resolvers;
