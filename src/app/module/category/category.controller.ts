import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";

const createCategory = catchasync(async (req: Request, res: Response) => {
  const category = await categoryService.createcategory(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategory = catchasync(async (req: Request, res: Response) => {
  const category = await categoryService.getAllCategory();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

const getCategoryById = catchasync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(
    req.params.id as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});
const updateCategory = catchasync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchasync(async (req: Request, res: Response) => {
  const category = await categoryService.deleteCategory(
    req.params.id as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
