import { catchasync } from "../../../shared/cathAsync.js";
import { BlogService } from "./blog.service.js";
import { sendResponse } from "../../../shared/sendResponse.js";
const createBlog = catchasync(async (req, res) => {
    const payload = req.body;
    const result = await BlogService.createBlog(payload, req.user);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: result,
    });
});
const getAllBlogs = catchasync(async (req, res) => {
    const query = req.query;
    const result = await BlogService.getAllBlogs(query);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        data: result,
    });
});
const deleteBlog = catchasync(async (req, res) => {
    const id = req.params.id;
    const result = await BlogService.deleteBlog(id, req.user);
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
