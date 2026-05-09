import { Router } from "express";
import { voteController } from "./vote.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { rateLimitMiddleware } from "../../midddlware/rateLimiter";

const router = Router();

router.post(
  "/",
  rateLimitMiddleware,
  cheakAuth(Role.USER, Role.ADMIN),
  voteController.createVote,
);

router.get("/upvotes/:id", rateLimitMiddleware, voteController.countUpVotes);
router.get(
  "/downvotes/:id",
  rateLimitMiddleware,
  voteController.countDownVotes,
);
router.delete(
  "/:id",
  rateLimitMiddleware,
  cheakAuth(Role.USER, Role.ADMIN),
  voteController.removeVote,
);

export const voteRouter = router;
