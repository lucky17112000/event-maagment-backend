import { Router } from "express";
import { ideaController } from "./idea.controller";
import { validateRequest } from "../../midddlware/validateRequest";
import { ideaValidator } from "./idea.valiators";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";

const router = Router();
router.post(
  "/",

  multerUpload.array("files"),
  validateRequest(ideaValidator.createIdeaZodSchema),
  ideaController.createIdea,
);
//  cheakAuth(Role.USER, Role.ADMIN),
router.get("/", ideaController.getAllIdeas);
router.get("/:id", ideaController.getIdeayId);
// router.put("/:id", ideaController.updateIdea);
router.get("/home/limited", ideaController.getLimitedIdeaForHomePage);

router.put(
  "/status",
  cheakAuth(Role.ADMIN),
  validateRequest(ideaValidator.updateIdeaStatusZodSchema),
  ideaController.updateIdeaStatuswithFeedback,
);
router.put(
  "/change-ispaid",
  cheakAuth(Role.ADMIN),

  validateRequest(ideaValidator.changeIsPaidZodSchema),
  ideaController.changeIspaidFalseToTrue,
);
// router.delete("/:id", cheakAuth(Role.ADMIN), ideaController.deleteIdea);
// router.delete("/soft/:id", ideaController.deleteIdeaSoft);
// router.delete("/soft", cheakAuth(Role.ADMIN), ideaController.deleteIdeaSoft);
router.put(
  "/change-approved-to-under-review",
  cheakAuth(Role.ADMIN),
  ideaController.changeApprovedToUnderReview,
);
router.delete(
  "/soft/by-admin",
  cheakAuth(Role.ADMIN),
  ideaController.deleteIdeaSoftByAdmin,
);

export const ideaRouter = router;
