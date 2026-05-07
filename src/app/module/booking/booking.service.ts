import status from "http-status";
// import { v4 as uuidv4 } from "uuid";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";

import { randomUUID } from "crypto";
import { Role } from "../../../generated/prisma/enums";
import {
  IcreateBookingPayload,
  IUpdateBookingStatusPayload,
} from "./booking.interface";

const createBooking = async (
  payload: IcreateBookingPayload,
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
    await tx.eventSeatConfig.update({
      where: { id: seatConfig.id },
      data: { bookedSeats: { increment: seatCount } },
    });
    return newBooking;
  });
  return booking;
};

const getMyBooking = async (user: IRequestUser) => {
  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  if (user.role !== Role.USER) {
    throw new AppError(status.FORBIDDEN, "Its only for users");
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: user.userId },
    include: {
      idea: {
        select: {
          title: true,
          images: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      seatConfig: {
        select: {
          venue: true,
          startTime: true,
          endTime: true,
          totalSeats: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return bookings;
};

const getBookingsByIdea = async (ideaId: string, user: IRequestUser) => {
  if (user.role !== Role.ADMIN) {
    throw new AppError(status.FORBIDDEN, "Only admin can access this resource");
  }

  const seatConfig = await prisma.eventSeatConfig.findUnique({
    where: { ideaId },
    select: {
      totalSeats: true,
      bookedSeats: true,
      venue: true,
      startTime: true,
      endTime: true,
    },
  });
  if (!seatConfig) {
    throw new AppError(status.NOT_FOUND, "No seat config found for this event");
  }
  const bookings = await prisma.booking.findMany({
    where: { ideaId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return {
    seatConfig,
    availableSeats: seatConfig.totalSeats - seatConfig.bookedSeats,
    totalBookings: bookings.length,
    bookings,
  };
};

const updateBookingStatus = async (
  payload: IUpdateBookingStatusPayload,
  user: IRequestUser,
) => {
  if (user.role !== Role.ADMIN) {
    throw new AppError(status.FORBIDDEN, "Only admin can access this resource");
  }
  const update = await prisma.booking.update({
    where: { id: payload.bookingId },
    data: { status: payload.status },
  });
  return update;
};

export const bookingService = {
  createBooking,
  getMyBooking,
  getBookingsByIdea,
  updateBookingStatus,
};
