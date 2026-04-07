import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { prisma } from "../lib/prisma";
import config from "../config";
export enum UserRole {
  admin = "ADMIN",
  member = "MEMBER",
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Is token exists .
      // verify token .
      // Is decoded user exists .
      // Is users status Active  .
      // check Role

      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("Token not found!!");
      }

      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;

      const userData = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });
      if (!userData) {
        throw new Error("Unauthorized!");
      }

      //   if (userData.status !== "ACTIVE") {
      //     throw new Error(
      //       "Your Acount is currently INACTIVE please try agian later...!!",
      //     );
      //   }

      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Unauthorized!!!");
      }

      req.user = decoded;

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
