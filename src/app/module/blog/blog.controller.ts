import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { ICreateBlogPayload } from "./blog.interface";
import { BlogService } from "./blog.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { sendResponse } from "../../../shared/sendResponse";
import { IQueryParams } from "../../interface/query.interface";

const createBlog = catchasync(async (req: Request, res: Response) => {
  const payload = req.body as ICreateBlogPayload;
  const result = await BlogService.createBlog(
    payload,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const getAllBlogs = catchasync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await BlogService.getAllBlogs(query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    data: result,
  });
});
const deleteBlog = catchasync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BlogService.deleteBlog(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  deleteBlog,
};
