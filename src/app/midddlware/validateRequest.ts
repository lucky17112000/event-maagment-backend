import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
    } catch (error) {
      return next(error);
    }

    const parseResult = zodSchema.safeParse(req.body);
    if (!parseResult.success) {
      return next(parseResult.error);
    }

    // sanitized and validated data
    req.body = parseResult.data;
    return next();
  };
};
