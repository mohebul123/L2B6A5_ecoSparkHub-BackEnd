import { Response } from "express";

// Type definition update
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta, // Response-e meta pathao
    data: data.data,
  });
};

export default sendResponse;
