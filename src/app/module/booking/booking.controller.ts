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
const getBookingsByIdea = catchasync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const { ideaId } = req.params;
  const result = await bookingService.getBookingsByIdea(ideaId as string, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchasync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await bookingService.updateBookingStatus(req.body, user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Booking status updated successfully",
    data: result,
  });
});
const getMyBooking = catchasync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const bookings = await bookingService.getMyBooking(user);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "My bookings retrieved successfully",
    data: bookings,
  });
});

export const bookingController = {
  createBooking,
  getBookingsByIdea,
  updateBookingStatus,
  getMyBooking,
};
