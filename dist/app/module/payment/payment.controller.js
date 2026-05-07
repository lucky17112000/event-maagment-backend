import status from "http-status";
import { catchasync } from "../../../shared/cathAsync.js";
import { envVars } from "../../config/env.js";
import { stripe } from "../../config/stripe.config.js";
import { PaymentService } from "./payment.service.js";
import { sendResponse } from "../../../shared/sendResponse.js";
const handleStripeWebhookEvent = catchasync(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webHookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webHookSecret) {
        console.error("Missing Stripe signature or webhook secret");
        return res
            .status(400)
            .json({ message: "Missing Stripe signature or webhook secret" });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webHookSecret);
    }
    catch (error) {
        console.error("Error verifying Stripe webhook signature", error);
        return res
            .status(400)
            .json({ message: "Invalid Stripe webhook signature" });
    }
    try {
        const result = await PaymentService.handleStripeWebhookEvent(event);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: result.message,
            data: result,
        });
    }
    catch (error) {
        console.error("Error handling Stripe webhook event", error);
        return res
            .status(500)
            .json({ message: "Error handling Stripe webhook event" });
    }
});
export const PaymentController = {
    handleStripeWebhookEvent,
};
