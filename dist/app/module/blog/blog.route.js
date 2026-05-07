import { Router } from "express";
import { cheakAuth } from "../../midddlware/cheakAuth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { BlogController } from "./blog.controller.js";
const router = Router();
router.post("/", cheakAuth(Role.ADMIN), BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.delete("/:id", cheakAuth(Role.ADMIN), BlogController.deleteBlog);
export const blogRouter = router;
