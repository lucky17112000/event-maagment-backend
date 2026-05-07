import status from "http-status";
import z from "zod";
import { handleZodError } from "../errorHelper.ts/HandleZodError.js";
import AppError from "../errorHelper.ts/AppError.js";
import { envVars } from "../config/env.js";
import { deleteFileFromCloudinary } from "../config/cloudinary.config.js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (envVars.NODE_ENV === "development") {
        console.log("Error from Global Error Handler", err);
    }
    const safeDelete = async (url) => {
        try {
            await deleteFileFromCloudinary(url);
        }
        catch {
            console.error("Cleanup failed for:", url);
        }
    };
    if (req.file) {
        await safeDelete(req.file.path); // remove optional chaining, req.file is already checked
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const urls = req.files.map((file) => file.path);
        await Promise.all(urls.map(safeDelete)); // run deletions in parallel
    }
    let errorSources = [];
    let statusCode = status.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let stack = undefined;
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
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
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
    const errorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === "development" ? err : undefined,
        stack: envVars.NODE_ENV === "development" ? stack : undefined,
    };
    return res.status(statusCode).json(errorResponse);
};
