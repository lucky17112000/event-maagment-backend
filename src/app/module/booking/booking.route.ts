import { Router } from "express";
import { bookingController } from "./booking.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { rateLimitMiddleware } from "../../midddlware/rateLimiter";

const router = Router();
router.post(
  "/",
  rateLimitMiddleware,
  cheakAuth(Role.USER),
  bookingController.createBooking,
);
router.patch(
  "/status",
  rateLimitMiddleware,
  cheakAuth(Role.ADMIN),
  bookingController.updateBookingStatus,
);
router.get(
  "/my-bookings",
  rateLimitMiddleware,
  cheakAuth(Role.USER),
  bookingController.getMyBooking,
);
router.get(
  "/:ideaId",
  rateLimitMiddleware,
  cheakAuth(Role.ADMIN),
  bookingController.getBookingsByIdea,
);

export const bookingRouter = router;
