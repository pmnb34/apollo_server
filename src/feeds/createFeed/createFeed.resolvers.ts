import { Resolvers } from "../../types";
import client from "../../client";
import { FEED_CREATE_POINT } from "../../enum";
import AWS from "aws-sdk";
import fs from "fs";
interface createFeed {
  body: string;
  tags: [string];
  images: any;
  isPrivate: boolean;
}
const resolvers: Resolvers = {
  Mutation: {
    createFeed: async (_, { body, images, tags, isPrivate }: createFeed, { loggedInUser }) => {
      console.log(images);
      // var path = require(images[0].uri);
      // let response = await fetch(path);
      // var blob = await response.blob();
      // var file = new File([blob], "image/jpeg", { type: "image/jpeg" });
      // console.log(file);
      try {
        if (!loggedInUser) {
          return {
            success: false,
            message: "로그인이 필요합니다.",
          };
        }
        const created = await client.feed.create({
          data: {
            userId: loggedInUser.id,
            body,
            images: {
              createMany: {
                data: await images?.map((img: any) => {
                  return { index: img.index, location: img.location };
                }),
              },
            } as any,
            isPrivate: true,
            tags: {
              connectOrCreate: tags?.map((tag) => {
                return {
                  where: { name: tag },
                  create: { name: tag },
                };
              }),
            },
          },
        });
        const updated = await client.point.upsert({
          where: {
            userId: loggedInUser.id,
          },
          update: {
            body: { increment: FEED_CREATE_POINT },
            history: {
              create: { body: FEED_CREATE_POINT, feedId: created?.id },
            },
          },
          create: {
            userId: loggedInUser.id,
            body: FEED_CREATE_POINT,
            history: {
              create: { body: FEED_CREATE_POINT, feedId: created?.id },
            },
          },
        } as any);
        if (!created) {
          return {
            success: false,
            message: "피드작성에 실패했습니다.",
          };
        }
        if (!updated) {
          return {
            success: false,
            message: "포인트 변경에 실패했습니다.",
          };
        }
        return {
          success: true,
          message: "피드작성에 성공했습니다.",
        };
      } catch (e) {
        console.log(e);
        return {
          success: false,
          message: "작업 실패",
        };
      }
    },
  },
};
export default resolvers;
