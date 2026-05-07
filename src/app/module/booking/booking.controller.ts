import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { IRequestUser } from "../../interface/requestUser.interface";
import { bookingService } from "./booking.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";

const createBooking = catchasync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await bookingService.createBooking(req.body, user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
};
