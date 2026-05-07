import { Router } from "express";
import { voteController } from "./vote.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", cheakAuth(Role.USER, Role.ADMIN), voteController.createVote);

router.get("/upvotes/:id", voteController.countUpVotes);
router.get("/downvotes/:id", voteController.countDownVotes);
router.delete(
  "/:id",
  cheakAuth(Role.USER, Role.ADMIN),
  voteController.removeVote,
);

export const voteRouter = router;
