import { catchasync } from "../../../shared/cathAsync.js";
import AppError from "../../errorHelper.ts/AppError.js";
import status from "http-status";
import { purchaseService } from "./purchase.service.js";
import { sendResponse } from "../../../shared/sendResponse.js";
const createPurchase = catchasync(async (req, res) => {
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
const getAllPurchases = catchasync(async (req, res) => {
    const result = await purchaseService.getAllPurchases();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Purchases retrived successfully",
        data: result,
    });
});
const getIndividualPurchase = catchasync(async (req, res) => {
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await purchaseService.getIndividualPurchase(req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Purchase retrieved successfully",
        data: result,
    });
});
export const purchaseController = {
    createPurchase,
    getAllPurchases,
    getIndividualPurchase,
};
