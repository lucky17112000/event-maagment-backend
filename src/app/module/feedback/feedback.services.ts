import status from "http-status";
import AppError from "../../errorHelper.ts/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateFeedbackPayload } from "./feedback.interface";

const createFeedback = async (
  payload: ICreateFeedbackPayload,
  user: IRequestUser,
) => {
  const { ideaId, message, reason } = payload;
  if (user.role !== "ADMIN") {
    throw new AppError(status.FORBIDDEN, "Only admins can create feedback");
  }
  const feedbackData = await prisma.feedback.create({
    data: {
      ideaId,
      message,
      reason,
      adminId: user.userId,
    },
    include: {
      admin: true,
      idea: true,
    },
  });
  return feedbackData;
};

export const feedbackService = {
  createFeedback,
};
