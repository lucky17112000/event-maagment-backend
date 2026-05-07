import status from "http-status";
// import { v4 as uuidv4 } from "uuid";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IcreateIdeaPayload } from "./booking.interface";
import { randomUUID } from "crypto";

const createBooking = async (
  payload: IcreateIdeaPayload,
  user: IRequestUser,
) => {
  const { ideaId, seatCount } = payload;
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
  });
  if (!idea) {
    throw new Error("Idea not found");
  }
  if (idea.status !== "APPROVED") {
    throw new AppError(
      status.BAD_REQUEST,
      "Booking can only be made for approved ideas",
    );
  }
  const seatConfig = await prisma.eventSeatConfig.findUnique({
    where: { ideaId },
  });
  if (!seatConfig) {
    throw new AppError(
      status.BAD_REQUEST,
      "This event does not require booking",
    );
  }

  const availableSeats = seatConfig.totalSeats - seatConfig.bookedSeats;
  if (seatCount > availableSeats) {
    throw new AppError(
      status.BAD_REQUEST,
      `Only ${availableSeats} seats are available`,
    );
  }

  const alreadyBooked = await prisma.booking.findFirst({
    where: {
      ideaId,
      userId: user.userId,
    },
  });
  if (alreadyBooked) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already booked a seat for this idea",
    );
  }

  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        userId: user.userId,
        ideaId,
        seatConfigId: seatConfig.id,
        seatCount,
        bookingCode: `BK-${randomUUID().slice(0, 8).toUpperCase()}`,

        status: "CONFIRMED",
      },
      include: {
        idea: { select: { title: true } },
        seatConfig: { select: { venue: true, startTime: true, endTime: true } },
      },
    });
    return newBooking;
  });
  return booking;
};
