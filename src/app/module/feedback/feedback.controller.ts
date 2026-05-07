import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { feedbackService } from "./feedback.services";
import { sendResponse } from "../../../shared/sendResponse";

const createFeedback = catchasync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await feedbackService.createFeedback(data, user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Feedback created successfully",
    data: result,
  });
});
export const feedbackController = {
  createFeedback,
};
