"use strict";
// import { Request, Response } from "express";
// import { catchasync } from "../../../shared/cathAsync.js";
// import { chatService } from "./chat.service.js";
// import { sendResponse } from "../../../shared/sendResponse.js";
// import AppError from "../../errorHelper.ts/AppError.js";
// import status from "http-status";
// const sendMessage = catchasync(async (req: Request, res: Response) => {
//   const { message } = req.body;
//   if (!message) {
//     throw new AppError(status.BAD_REQUEST, "Message is required");
//   }
//   const result = await chatService.sendMessage(message);
//   sendResponse(res, {
//     httpStatusCode: 200,
//     success: true,
//     message: "Message sent successfully",
//     data: result,
//   });
// });
// export const chatController = {
//   sendMessage,
// };
