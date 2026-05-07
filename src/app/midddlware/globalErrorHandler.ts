/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
// import { envVars } from "../config/env";

// import { handleZodError } from "../errorHelpers/handleZodError";
// import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";

import { TErrorResponse, TErrorSource } from "../interface/error.interface";
import { handleZodError } from "../errorHelper.ts/HandleZodError";
import AppError from "../errorHelper.ts/AppError";
import { envVars } from "../config/env";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }

  const safeDelete = async (url: string) => {
    try {
      await deleteFileFromCloudinary(url);
    } catch {
      console.error("Cleanup failed for:", url);
    }
  };

  if (req.file) {
    await safeDelete(req.file.path); // remove optional chaining, req.file is already checked
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const urls = (req.files as Express.Multer.File[]).map((file) => file.path);
    await Promise.all(urls.map(safeDelete)); // run deletions in parallel
  }
  let errorSources: TErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let stack: string | undefined = undefined;

  //Zod Error Patttern
  /*
     error.issues; 
    /* [
      {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' , 'password' ], => username password
        message: 'Invalid input: expected string'
      },
      {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
      }
    ] 
    */

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
  };

  return res.status(statusCode).json(errorResponse);
};
