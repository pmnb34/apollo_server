import { Resolvers } from "../../types";
import client from "../../client";
import { FEED_CREATE_POINT } from "../../enum";

import AWS from "aws-sdk";

interface createFeed {
  body: string;
  tags: [string];
  images: [string];
  isPrivate: boolean;
}
const resolvers: Resolvers = {
  Mutation: {
    createFeed: async (_, { body, tags, images, isPrivate }: createFeed, { loggedInUser }) => {
      console.log(body);
      console.log(tags);
      console.log(isPrivate);
      console.log(images);
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
            images,
            isPrivate,
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

const uploadToS3 = async (file: any, userId: any, folderName: any) => {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.AWS_ACCESSKEY_ID as string,
      secretAccessKey: process.env.AWS_SECRETACCESSKEY as string,
    },
  });
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "instaclone-uploads",
      Key: objectName,
      ACL: "public-read",
      Body: readStream,
    })
    .promise();
  return Location;
};
