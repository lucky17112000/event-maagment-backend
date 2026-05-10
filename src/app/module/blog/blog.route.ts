import { Router } from "express";
import { cheakAuth } from "../../midddlware/cheakAuth";
import { Role } from "../../../generated/prisma/enums";
import { BlogController } from "./blog.controller";

const router = Router();
router.post("/", cheakAuth(Role.ADMIN), BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.delete("/:id", cheakAuth(Role.ADMIN), BlogController.deleteBlog);
export const blogRouter = router;
