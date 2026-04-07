import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { ZodError } from "zod";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails = err;

  // 1. Zod Validation Error (Industry standard for form/request validation)
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      field: issue.path[issue.path.length - 1],
      message: issue.message,
    }));
  }

  // 2. Prisma Client Known Request Errors (P2002, P2025 etc)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      message = `Duplicate value error: ${err.meta?.target || "A record with this data already exists"}`;
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Foreign key constraint failed. Related record not found.";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "The requested record was not found in the database.";
    }
  }

  // 3. Prisma Validation Error (Incorrect types)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message =
      "Invalid data provided. Please check your field types and required fields.";
  }

  // 4. Prisma Initialization Error (DB Connection)
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503; // Service Unavailable
    message =
      "Database connection failed. Please ensure the DB server is running.";
  }

  // 5. Handling generic or manual Errors (throw new Error("..."))
  else if (err instanceof Error) {
    // Custom error code handle korar jonno (optional)
    if (err.name === "UnauthorizedError") statusCode = 401;
    message = err.message;
  }

  // Professional JSON Response
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    // Stack trace sudhu development mode-e dekhano bhalo
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}

export default globalErrorHandler;
