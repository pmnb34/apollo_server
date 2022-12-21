import { Resolvers } from "../../types";
import client from "../../client";
import bcrypt from "bcrypt";

interface follower {
  id?: string;
}

const resolvers: Resolvers = {
  Query: {
    follower: async (_, { id }: follower, { loggedInUser }) => {
      try {
        const isUser = await client.user.findFirst({ where: { id } });
        if (isUser) {
          const followers = await client.user.findFirst({ where: { id } }).followers();
          return {
            success: true,
            message: "팔로워 유저 리스트 입니다.",
            user: followers,
          };
        }
        return {
          success: false,
          message: "회원 정보가 없습니다.",
        };
      } catch (e) {
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
    following: async (_, { id }: follower, { loggedInUser }) => {
      try {
        const isUser = await client.user.findFirst({ where: { id } });
        if (isUser) {
          const followings = await client.user.findFirst({ where: { id } }).followings();
          return {
            success: true,
            message: "팔로잉 유저 리스트 입니다.",
            user: followings,
          };
        }
        return {
          success: false,
          message: "회원 정보가 없습니다.",
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
