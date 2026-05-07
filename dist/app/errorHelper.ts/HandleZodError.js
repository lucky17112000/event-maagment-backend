import status from "http-status";
// import { TErrorResponse, TErrorSources } from "../interfaces/error.interface.js";
export const handleZodError = (err) => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";
    const errorSources = [];
    err.issues.forEach((issue) => {
        errorSources.push({
            path: issue.path.join(" => "),
            message: issue.message,
        });
    });
    return {
        success: false,
        message,
        errorSources,
        statusCode,
    };
};
