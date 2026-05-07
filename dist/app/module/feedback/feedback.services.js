import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { prisma } from "../../lib/prisma.js";
const createFeedback = async (payload, user) => {
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
