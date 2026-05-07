import { catchasync } from "../../../shared/cathAsync.js";
import { bookingService } from "./booking.service.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import status from "http-status";
const createBooking = catchasync(async (req, res) => {
    const user = req.user;
    const result = await bookingService.createBooking(req.body, user);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Booking created successfully",
        data: result,
    });
});
const getBookingsByIdea = catchasync(async (req, res) => {
    const user = req.user;
    const { ideaId } = req.params;
    const result = await bookingService.getBookingsByIdea(ideaId, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Bookings retrieved successfully",
        data: result,
    });
});
const updateBookingStatus = catchasync(async (req, res) => {
    const user = req.user;
    const result = await bookingService.updateBookingStatus(req.body, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Booking status updated successfully",
        data: result,
    });
});
const getMyBooking = catchasync(async (req, res) => {
    const user = req.user;
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
