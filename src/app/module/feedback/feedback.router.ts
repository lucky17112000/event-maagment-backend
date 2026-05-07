import { Router } from "express";
import { feedbackController } from "./feedback.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", cheakAuth(Role.ADMIN), feedbackController.createFeedback);

export const feedbackRouter = router;
