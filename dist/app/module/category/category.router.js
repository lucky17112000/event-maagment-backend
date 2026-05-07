import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { validateRequest } from "../../midddlware/validateRequest.js";
import { createDoctorZodSchema, updateDoctorZodSchema, } from "./category.validate.js";
import { cheakAuth } from "../../midddlware/cheakAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
const router = Router();
router.post("/", cheakAuth(Role.ADMIN), validateRequest(createDoctorZodSchema), categoryController.createCategory);
// router.get("/", categoryController.getAllCategory);
router.get("/", 
// cheakAuth(Role.ADMIN, Role.USER),
categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", cheakAuth(Role.ADMIN), validateRequest(updateDoctorZodSchema), categoryController.updateCategory);
router.delete("/:id", cheakAuth(Role.ADMIN), categoryController.deleteCategory);
// router.post("/bnbn", );
export const categoryRouter = router;
