import { Router } from "express";
import { purchaseController } from "./purchase.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../midddlware/validateRequest";
import { purchaseValidationzod } from "./purchase.validate";

const router = Router();
router.post(
  "/",
  validateRequest(purchaseValidationzod),
  cheakAuth(Role.USER),
  purchaseController.createPurchase,
);

router.get(
  "/",
  cheakAuth(Role.ADMIN, Role.USER),
  purchaseController.getAllPurchases,
);
router.get(
  "/me",
  cheakAuth(Role.USER),
  // cheakAuth(Role.ADMIN),
  purchaseController.getIndividualPurchase,
);
export const purchaseRouter = router;
