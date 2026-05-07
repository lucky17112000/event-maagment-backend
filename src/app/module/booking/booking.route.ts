import { Router } from "express";
import { bookingController } from "./booking.controller";

const router = Router();
router.post("/", bookingController.createBooking);
router.patch("/status", bookingController.updateBookingStatus);
router.get("/my-bookings", bookingController.getMyBooking);
router.get("/:ideaId", bookingController.getBookingsByIdea);

export const bookingRouter = router;
