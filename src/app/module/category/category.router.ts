import { NextFunction, Request, Response, Router } from "express";
import { categoryController } from "./category.controller";
import z from "zod";
import { validateRequest } from "../../midddlware/validateRequest";
import {
  createDoctorZodSchema,
  updateDoctorZodSchema,
} from "./category.validate";
import { cookieUtil } from "../../utiles/cookie";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { jwtUtils } from "../../utiles/jwt";
import { envVars } from "../../config/env";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/",
  cheakAuth(Role.ADMIN),
  validateRequest(createDoctorZodSchema),
  categoryController.createCategory,
);
// router.get("/", categoryController.getAllCategory);

router.get(
  "/",
  // cheakAuth(Role.ADMIN, Role.USER),
  categoryController.getAllCategory,
);
router.get("/:id", categoryController.getCategoryById);
router.put(
  "/:id",
  cheakAuth(Role.ADMIN),
  validateRequest(updateDoctorZodSchema),
  categoryController.updateCategory,
);
router.delete("/:id", cheakAuth(Role.ADMIN), categoryController.deleteCategory);

// router.post("/bnbn", );
export const categoryRouter = router;
