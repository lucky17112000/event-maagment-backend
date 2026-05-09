import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utiles/QueryBuilder.js";
import { ideaFilterableFields, ideaIncludeConfig, ideaSearchableFields, } from "./idea.constant.js";
const createIdea = async (payload) => {
    const { title, problemStatement, solutinon, description, images, categoryId, authorId, price, seatConfig, } = payload;
    const ideaData = await prisma.idea.create({
        data: {
            title,
            problemStatement,
            solutinon,
            description,
            images,
            categoryId,
            authorId,
            price,
        },
        include: {
            author: true,
            category: true,
            votes: true,
            feedback: true,
            purchases: true,
            bookings: true,
            seatConfig: true,
        },
    });
    if (seatConfig) {
        await prisma.eventSeatConfig.create({
            data: {
                ideaId: ideaData.id,
                totalSeats: seatConfig.totalSeats,
                startTime: new Date(seatConfig.startTime),
                endTime: new Date(seatConfig.endTime),
                venue: seatConfig.venue,
            },
        });
        // seatConfig create হওয়ার পরে আবার fetch করো
        const updatedIdea = await prisma.idea.findUnique({
            where: { id: ideaData.id },
            include: {
                author: true,
                category: true,
                votes: true,
                feedback: true,
                purchases: true,
                bookings: true,
                seatConfig: true,
            },
        });
        return updatedIdea;
    }
    return ideaData;
};
const getAllIdeas = async (query) => {
    const normalizedQuery = { ...query };
    // If `searchTerm` is a number (e.g. "10"), treat it as a price filter.
    // This avoids Prisma "contains" errors on numeric fields and matches exact prices.
    const searchTerm = normalizedQuery.searchTerm?.trim();
    if (searchTerm && !Number.isNaN(Number(searchTerm))) {
        normalizedQuery.price = searchTerm;
        delete normalizedQuery.searchTerm;
    }
    const queryBuilder = new QueryBuilder(prisma.idea, normalizedQuery, {
        searchableFields: ideaSearchableFields,
        filterableFields: ideaFilterableFields,
    });
    const result = await queryBuilder
        .where({
        isDeleted: false,
        status: "APPROVED",
    })
        .search()
        .filter()
        .sort()
        .paginate()
        .fields()
        .include({
        author: true,
        category: true,
        votes: true,
        feedback: true,
        purchases: true,
        seatConfig: true,
    })
        .dynamicInclude(ideaIncludeConfig)
        .execute();
    return result;
};
const getIdeaById = async (id) => {
    const idea = await prisma.idea.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            votes: true,
            feedback: true,
            purchases: true,
            seatConfig: true,
            bookings: true,
        },
    });
    return idea;
};
const updateIdea = async (id, payload) => {
    const data = payload;
    const dataById = await prisma.idea.findUnique({
        where: { id },
    });
    if (!dataById) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    const idea = await prisma.idea.update({
        where: { id },
        data,
        include: {
            author: true,
            category: true,
            votes: true,
            feedback: true,
            purchases: true,
        },
    });
    return idea;
};
const deleteIdea = async (id, user) => {
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    const dataById = await prisma.idea.findUnique({
        where: { id },
        select: {
            isDeleted: true,
            author: {
                select: {
                    role: true,
                    email: true,
                },
            },
        },
    });
    if (!dataById) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    if (!dataById.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Idea is not deleted yet");
    }
    //   if (dataById?.author.email !== user.email) {
    //     throw new AppError(
    //       status.FORBIDDEN,
    //       "You are not authorized to delete this idea",
    //     );
    //   }
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can delete this idea permanently");
    }
    const result = await prisma.idea.delete({
        where: { id },
    });
    return result;
};
const deleteByCornJobwhenSoftDeleted = async () => {
    const result = await prisma.idea.deleteMany({
        where: {
            isDeleted: true,
            deletedAt: {
                lt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Soft deleted for more than 1 day
            },
        },
    });
    const deletedCount = result.count || 0;
    return {
        message: `${deletedCount} soft deleted ideas that were marked for deletion more than 1 day ago have been permanently removed.`,
    };
};
const deleteIdeaSoft = async (id, user) => {
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    const dataById = await prisma.idea.findUnique({
        where: { id },
        select: { id: true, isDeleted: true, authorId: true },
    });
    if (!dataById) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    // if (user.userId !== dataById.authorId) {
    //   throw new AppError(
    //     status.FORBIDDEN,
    //     "You are not authorized to delete this idea",
    //   );
    // }
    if (dataById?.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Idea is already get permission for deleted");
    }
    const result = await prisma.idea.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });
    return result;
};
const getOneUserAllIdeas = async (userId, query) => {
    const queryBuilder = new QueryBuilder(prisma.idea, query, {
        searchableFields: ideaSearchableFields,
        filterableFields: ideaFilterableFields,
    });
    const result = await queryBuilder
        .where({ authorId: userId, isDeleted: false })
        .search()
        .filter()
        .sort()
        .paginate()
        .fields()
        .include({
        author: true,
        category: true,
        votes: true,
        feedback: true,
        purchases: true,
    })
        .execute();
    return result;
};
const updateIdeaStatusWithFeedback = async (user, payload) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can update idea status");
    }
    const { ideaId, ideaStatus, message, reason } = payload;
    if (!ideaId) {
        throw new AppError(status.BAD_REQUEST, "ideaId is required");
    }
    if (!ideaStatus) {
        throw new AppError(status.BAD_REQUEST, "ideaStatus is required");
    }
    if (!message) {
        throw new AppError(status.BAD_REQUEST, "message is required");
    }
    if (!reason) {
        throw new AppError(status.BAD_REQUEST, "reason is required");
    }
    const { idea, feedback } = await prisma.$transaction(async (tx) => {
        const existingIdea = await tx.idea.findUnique({
            where: { id: ideaId },
            select: { id: true },
        });
        if (!existingIdea) {
            throw new AppError(status.NOT_FOUND, "Idea not found");
        }
        const idea = await tx.idea.update({
            where: { id: ideaId },
            data: { status: ideaStatus },
        });
        // Feedback.ideaId is unique (one feedback per idea), so create-or-update.
        const feedback = await tx.feedback.upsert({
            where: { ideaId },
            create: {
                ideaId,
                message,
                reason,
                adminId: user.userId,
            },
            update: {
                message,
                reason,
                adminId: user.userId,
            },
        });
        return { idea, feedback };
    });
    return { idea, feedback };
};
const deleteIdeaSoftByAdmin = async (id, user) => {
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can delete this idea");
    }
    const dataById = await prisma.idea.findUnique({
        where: { id },
        select: { id: true, isDeleted: true },
    });
    if (!dataById) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    if (dataById?.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "Idea is already get permission for deleted");
    }
    const result = await prisma.idea.update({
        where: { id },
        data: { isDeleted: true, deletedAt: new Date() },
    });
    return result;
};
const changeIspaidFalseToTrue = async (payload, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can update this idea");
    }
    const { ideaId, isPaid } = payload;
    if (!ideaId) {
        throw new AppError(status.BAD_REQUEST, "ideaId is required");
    }
    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        select: { id: true, isPaid: true },
    });
    if (!idea) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    // if (idea.isPaid) {
    //   throw new AppError(status.BAD_REQUEST, "Idea is already marked as paid");
    // }
    const nextIsPaid = typeof isPaid === "boolean" ? isPaid : !idea.isPaid;
    const updatedIdea = await prisma.idea.update({
        where: { id: ideaId },
        data: { isPaid: nextIsPaid },
    });
    return updatedIdea;
};
export const changeApprovedToUnderReview = async (ideaId, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(status.FORBIDDEN, "Only admin can change idea status");
    }
    const idea = await prisma.idea.findUnique({
        where: { id: ideaId },
        select: { id: true, status: true },
    });
    if (!idea) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    if (idea.status !== "APPROVED") {
        throw new AppError(status.BAD_REQUEST, "Idea status must be APPROVED to change it back to UNDER_REVIEW");
    }
    const updatedIdea = await prisma.idea.update({
        where: { id: ideaId },
        data: { status: "UNDER_REVIEW" },
    });
    return updatedIdea;
};
const getLimitedIdeaForHomePage = async () => {
    const ideas = await prisma.idea.findMany({
        where: {
            status: "APPROVED",
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 4,
    });
    return ideas;
};
export const ideaService = {
    createIdea,
    getAllIdeas,
    getIdeaById,
    updateIdea,
    deleteIdea,
    deleteIdeaSoft,
    deleteByCornJobwhenSoftDeleted,
    getOneUserAllIdeas,
    updateIdeaStatusWithFeedback,
    deleteIdeaSoftByAdmin,
    changeIspaidFalseToTrue,
    changeApprovedToUnderReview,
    getLimitedIdeaForHomePage,
};
