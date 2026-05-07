import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { randomUUID } from "node:crypto";
import { stripe } from "../../config/stripe.config.js";
import { envVars } from "../../config/env.js";
const createPurchase = async (payload, user) => {
    const { ideaId } = payload;
    const ideaData = await prisma.idea.findUnique({
        where: { id: ideaId },
    });
    if (!ideaData) {
        throw new AppError(status.NOT_FOUND, "Idea not found");
    }
    const alreadyPurchesd = await prisma.purchase.findFirst({
        where: {
            ideaId,
            userId: user.userId,
        },
    });
    if (alreadyPurchesd) {
        throw new AppError(status.BAD_REQUEST, "You have already purchased this idea");
    }
    const result = await prisma.purchase.create({
        data: {
            ideaId,
            userId: user.userId,
        },
        include: {
            idea: true,
            user: true,
        },
    });
    if (ideaData.price == null) {
        throw new AppError(status.BAD_REQUEST, "Idea price is not set");
    }
    const transactionId = randomUUID();
    const paymentData = await prisma.payment.create({
        data: {
            purchaseId: result.id,
            ideaId: ideaData.id,
            amount: ideaData.price,
            transactionId,
            userId: user.userId,
        },
    });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    unit_amount: ideaData.price * 120,
                    product_data: {
                        name: ideaData.title,
                        description: ideaData.description,
                    },
                },
                quantity: 1,
            },
        ],
        metadata: {
            purchaseId: result.id,
            paymentId: paymentData.id,
        },
        success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/purchase`,
    });
    return {
        paymentData,
        sessionUrl: session.url,
        sessionId: session.id,
        result,
    };
};
const getAllPurchases = async () => {
    const result = await prisma.purchase.findMany({
        include: {
            // idea: true,
            user: true,
        },
    });
    return result;
};
const getIndividualPurchase = async (user) => {
    const IdeaData = await prisma.purchase.findMany({
        where: {
            userId: user.userId,
        },
        include: { idea: true, user: true },
    });
    return IdeaData;
};
export const purchaseService = {
    createPurchase,
    getAllPurchases,
    getIndividualPurchase,
};
