import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";
import { adminService } from "./admin.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { sendResponse } from "../../../shared/sendResponse";

const getAllUsersByAdmin = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }

  const query = req.query;
  const result = await adminService.getAllUsersByAdmn(
    req.user as IRequestUser,
    query as unknown as import("../../interface/query.interface").IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    data: result.data,
    meta: result.meta,
    message: "All users retrieved successfully",
  });
});

const updateUserRoleByAdmin = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = req.params;
    const { role } = req.body;
    const result = await adminService.updateUserRoleByAdmin(
      userId as string,
      role,
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      data: result,
      message: "User role updated successfully",
    });
  },
);

const getOneUserByAdmin = catchasync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized");
  }
  const { userId } = req.params;
  const result = await adminService.getOneUserByAdmin(
    userId as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    data: result,
    message: "User retrieved successfully",
  });
});
const hardDeleteUserByAdmin = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const { userId } = req.params;
    const result = await adminService.hardDeleteUserByAdmin(
      userId as string,
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      data: result,
      message: "User deleted successfully",
    });
  },
);

const getAdminDashboardStats = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const result = await adminService.getAdminDashboardStats(
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      data: result,
      message: "Admin dashboard stats retrieved successfully",
    });
  },
);

const getIndividualUserStats = catchasync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }
    const result = await adminService.getIndividualUserStats(
      req.user as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      data: result,
      message: "Individual user stats retrieved successfully",
    });
  },
);

export const adminController = {
  getAllUsersByAdmin,
  updateUserRoleByAdmin,
  getOneUserByAdmin,
  getAdminDashboardStats,
  hardDeleteUserByAdmin,
  getIndividualUserStats,
};
