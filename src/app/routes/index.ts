import { Router } from "express";
import { categoryRouter } from "../module/category/category.router";
import { authRouter } from "../module/auth/auth.router";
import { ideaRouter } from "../module/idea/idea.route";
import { feedbackRouter } from "../module/feedback/feedback.router";

import { voteRouter } from "../module/vote/vote.route";
import { purchaseRouter } from "../module/purchase/purchase.route";
import { adminRoute } from "../module/admin/admin.route";

// import { chatRouter } from "../module/chat/chat.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/idea", ideaRouter);
router.use("/feedback", feedbackRouter);
router.use("/vote", voteRouter);
router.use("/purchase", purchaseRouter);
router.use("/admin", adminRoute);
// router.use("/chat", chatRouter);

export const appRouter = router;
