import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../src/generated/prisma/client"; // @prisma/client use kora standard
import { ZodError } from "zod";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  // 1. Zod Validation Error Handling (New)
  if (err instanceof ZodError) {
    statusCode = 400;
    errorMessage = "Validation Error";
    // Zod error theke shudhu dorkari message gulo extract kora
    errorDetails = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }));
  }

  // 2. Prisma Client Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field types or missing fields";
  }

  // 3. Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Note: Use '===' instead of '=' for comparison
    if (err.code === "P2025") {
      statusCode = 404; // Record not found usually 404 hoy
      errorMessage = "Record not found in the database";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate Key Error: Data already exists";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  }

  // 4. Prisma Initialization/Connection Errors
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503; // Service Unavailable
    if (err.errorCode === "P1001") {
      errorMessage = "Cannot reach database server. Please try again later.";
    } else {
      errorMessage = "Database initialization failed";
    }
  }

  // Final Response logic
  res.status(statusCode).json({
    success: false, // Professional API te success flag rakha bhalo
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHandler;
