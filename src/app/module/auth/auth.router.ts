import { Router } from "express";
import { authController } from "./auth.controller";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/register", authController.registerUser);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.logInUser);
router.post(
  "/change-password",
  cheakAuth(Role.ADMIN, Role.USER),
  authController.changePassword,
);
router.post("/forget-password", authController.forgetPassword);
router.post("/refresh-token", authController.getNewToken);

router.get("/me", cheakAuth(Role.ADMIN, Role.USER), authController.getMe);
router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/google/error", authController.handleOAuthError);

export const authRouter = router;
