import { Router } from "express";
import { feedbackController } from "./feedback.controller.js";
import { cheakAuth } from "../../midddlware/cheakAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
const router = Router();
router.post("/", cheakAuth(Role.ADMIN), feedbackController.createFeedback);
export const feedbackRouter = router;
