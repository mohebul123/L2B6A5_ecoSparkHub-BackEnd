import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Body, Query, ar Params - sob ekbare validate koro
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      // Error pele eita globalErrorHandler-e pathiye dibe
      next(err);
    }
  };
};

export default validateRequest;
