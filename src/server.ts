import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import * as http from "http";
import cors from "cors";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import schema from "./schema";
import { loggedInUser } from "./users/users.utils";
import parser from "ua-parser-js";
const startApolloServer = async (schema: any) => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    "/",
    cors(),
    bodyParser.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        loggedInUser: await loggedInUser(req.headers.token as string),
        ua: parser(req.headers['user-agent'])
      }),
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
};

startApolloServer(schema);
