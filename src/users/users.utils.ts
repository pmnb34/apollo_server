import jwt from "jsonwebtoken";
import client from "../client";

export const loggedInUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const JwtPayload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const user = await client.user.findUnique({ where: { id: (JwtPayload as any)?.id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const isLoggedIn = async (token: string) => {
  try {
    console.log(token);
  } catch {
    return null;
  }
};
