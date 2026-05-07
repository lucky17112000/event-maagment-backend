import { Router } from "express";
import { purchaseController } from "./purchase.controller.js";
import { cheakAuth } from "../../midddlware/cheakAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { validateRequest } from "../../midddlware/validateRequest.js";
import { purchaseValidationzod } from "./purchase.validate.js";
const router = Router();
router.post("/", validateRequest(purchaseValidationzod), cheakAuth(Role.USER), purchaseController.createPurchase);
router.get("/", cheakAuth(Role.ADMIN, Role.USER), purchaseController.getAllPurchases);
router.get("/me", cheakAuth(Role.USER), 
// cheakAuth(Role.ADMIN),
purchaseController.getIndividualPurchase);
export const purchaseRouter = router;
