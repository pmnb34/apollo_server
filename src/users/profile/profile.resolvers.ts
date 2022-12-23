import { Resolvers } from "../../types";
import client from "../../client";

const resolvers: Resolvers = {
  Query: {
    profile: (_, { id }, { isLoggedIn, loggedInUser }: any) => {
      console.log(isLoggedIn);
      try {
        const isUser = client.user.findFirst({
          where: loggedInUser ? { id: loggedInUser.id } : { id },
        });
        if (!isUser) {
          return {
            success: false,
            message: "회원 정보가 없습니다.",
          };
        }
        return {
          success: true,
          user: isUser,
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
