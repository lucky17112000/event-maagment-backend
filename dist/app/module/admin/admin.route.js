import { Router } from "express";
import { cheakAuth } from "../../midddlware/cheakAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { adminController } from "./admin.controller.js";
import { rateLimitMiddleware } from "../../midddlware/rateLimiter.js";
const router = Router();
router.get("/users", cheakAuth(Role.ADMIN), adminController.getAllUsersByAdmin);
router.get("/users/stats", cheakAuth(Role.ADMIN, Role.USER), adminController.getIndividualUserStats);
router.get("/users/:userId", rateLimitMiddleware, cheakAuth(Role.ADMIN), adminController.getOneUserByAdmin);
router.get("/dashboard/stats", rateLimitMiddleware, cheakAuth(Role.ADMIN), adminController.getAdminDashboardStats);
router.patch("/users/role/:userId", rateLimitMiddleware, cheakAuth(Role.ADMIN), adminController.updateUserRoleByAdmin);
router.delete("/users/delete/:userId", rateLimitMiddleware, cheakAuth(Role.ADMIN), adminController.hardDeleteUserByAdmin);
// router.delete(
export const adminRoute = router;
