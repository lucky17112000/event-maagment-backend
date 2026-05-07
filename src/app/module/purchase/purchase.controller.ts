import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { purchaseService } from "./purchase.service";
import { sendResponse } from "../../../shared/sendResponse";
import { IRequestUser } from "../../interface/requestUser.interface";

const createPurchase = catchasync(async (req: Request, res: Response) => {
  const data = req.body;
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await purchaseService.createPurchase(data, req.user);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Purchase created successfully",
    data: result,
  });
});

const getAllPurchases = catchasync(async (req: Request, res: Response) => {
  const result = await purchaseService.getAllPurchases();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Purchases retrived successfully",
    data: result,
  });
});

const getIndividualPurchase = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await purchaseService.getIndividualPurchase(
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Purchase retrieved successfully",
      data: result,
    });
  },
);

export const purchaseController = {
  createPurchase,
  getAllPurchases,
  getIndividualPurchase,
};
