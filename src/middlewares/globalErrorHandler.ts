import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  //prismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You Provided incorrect field type or missing fields";
  }
  // PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found";
    } else if ((err.code = "P2002")) {
      statusCode = 400;
      errorMessage = "Duplicate Key Errors";
    } else if ((err.code = "P2003")) {
      statusCode = 400;
      errorMessage = "Forgein key constraint failed";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error Occured during query Execution";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication Failed, Please check your Credintials";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't Reach DataBase Server";
    }
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHandler;
