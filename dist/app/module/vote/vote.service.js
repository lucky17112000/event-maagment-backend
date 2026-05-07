import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { prisma } from "../../lib/prisma.js";
const createVote = async (payload, user) => {
    const { type } = payload;
    const dataFromIdeaId = await prisma.idea.findUnique({
        where: { id: payload.ideaId },
        include: {
            votes: true,
            author: true,
        },
    });
    if (!dataFromIdeaId) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    if (dataFromIdeaId?.author.email === user?.email) {
        throw new AppError(status.BAD_REQUEST, "You cannot vote for your own idea");
    }
    const alreadyVoted = dataFromIdeaId.votes.find((vote) => vote?.userId === user?.userId);
    if (alreadyVoted && alreadyVoted?.type === type) {
        throw new AppError(status.BAD_REQUEST, "You have already voted for this idea with the same type");
    }
    if (alreadyVoted && alreadyVoted?.type !== type) {
        await prisma.vote.update({
            where: { id: alreadyVoted.id },
            data: { type },
        });
        return "Vote updated successfully";
    }
    const result = await prisma.vote.create({
        data: {
            ideaId: payload.ideaId,
            type,
            userId: user.userId,
        },
        include: {
            user: true,
            idea: true,
        },
    });
    return result;
};
const countUpVotes = async (ideaId) => {
    const upVotes = await prisma.vote.count({
        where: {
            ideaId,
            type: "UP",
        },
    });
    return upVotes;
};
const countDownVotes = async (ideaId) => {
    const downVotes = await prisma.vote.count({
        where: {
            ideaId,
            type: "DOWN",
        },
    });
    return downVotes;
};
const removeVote = async (payload, user) => {
    const { id, ideaId, userId } = payload;
    const voteData = await prisma.vote.findFirst({
        where: { ideaId, userId },
    });
    if (!voteData) {
        throw new AppError(status.NOT_FOUND, "Vote not found");
    }
    if (voteData.userId !== user.userId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to remove this vote");
    }
    const result = await prisma.vote.delete({
        where: { id: voteData.id },
    });
    return result;
};
export const voteService = {
    createVote,
    countUpVotes,
    countDownVotes,
    removeVote,
};
