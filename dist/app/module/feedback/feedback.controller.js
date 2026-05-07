import { catchasync } from "../../../shared/cathAsync.js";
import AppError from "../../errorHelper.ts/AppError.js";
import status from "http-status";
import { feedbackService } from "./feedback.services.js";
import { sendResponse } from "../../../shared/sendResponse.js";
const createFeedback = catchasync(async (req, res) => {
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
