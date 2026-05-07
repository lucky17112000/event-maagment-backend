import { Request, Response } from "express";
import { ideaService } from "./idea.services";
import {
  IChangeIspaidFalseToTruePayload,
  IcreateIdeaPayload,
} from "./idea.interface";
import { sendResponse } from "../../../shared/sendResponse";
import status from "http-status";
import { IRequestUser } from "../../interface/requestUser.interface";
import AppError from "../../errorHelper.ts/AppError";
import { IQueryParams } from "../../interface/query.interface";
import { catchasync } from "../../../shared/cathAsync";

const createIdea = async (req: Request, res: Response) => {
  // console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  const uploadedFiles: Express.Multer.File[] = Array.isArray(req.files)
    ? (req.files as Express.Multer.File[])
    : [];
  const data = {
    ...req.body,
    images: uploadedFiles.map((file) => file.path),
  };
  const result = await ideaService.createIdea(data as IcreateIdeaPayload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result,
  });
};

const getAllIdeas = async (req: Request, res: Response) => {
  const query = req.query;
  const result = await ideaService.getAllIdeas(query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea retrived successfully",
    data: result.data,
    meta: result.meta,
  });
};
const getIdeayId = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ideaService.getIdeaById(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea retrived successfully",
    data: result,
  });
};

const updateIdea = async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result = await ideaService.updateIdea(id as string, data);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea updated successfully",
    data: result,
  });
};
const deleteIdea = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.deleteIdea(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result,
  });
};

const deleteIdeaSoft = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.deleteIdeaSoft(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea soft deleted successfully",
    data: result,
  });
};
const deleteIdeaSoftByAdmin = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.deleteIdeaSoftByAdmin(
    id as string,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea soft deleted successfully by admin",
    data: result,
  });
};

const updateIdeaStatuswithFeedback = catchasync(
  async (req: Request, res: Response) => {
    const id = req.user;
    const data = req.body;
    if (!id) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.updateIdeaStatusWithFeedback(
      id as IRequestUser,
      data,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Idea status updated successfully",
      data: result,
    });
  },
);

const changeIspaidFalseToTrue = async (req: Request, res: Response) => {
  const id = req.user;
  const data = req.body;
  if (!id) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await ideaService.changeIspaidFalseToTrue(
    data as IChangeIspaidFalseToTruePayload,
    id as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Idea isPaid status updated successfully",
    data: result,
  });
};

const changeApprovedToUnderReview = catchasync(
  async (req: Request, res: Response) => {
    const id = req.user;
    const data = req.body;
    if (!id) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.changeApprovedToUnderReview(
      data,
      id as IRequestUser,
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Idea status changed from approved to under review successfully",
      data: result,
    });
  },
);
const getLimitedIdeaForHomePage = catchasync(
  async (req: Request, res: Response) => {
    const result = await ideaService.getLimitedIdeaForHomePage();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Limited ideas for home page retrieved successfully",
      data: result,
    });
  },
);

export const ideaController = {
  createIdea,
  getAllIdeas,
  getIdeayId,
  updateIdea,
  deleteIdea,
  deleteIdeaSoft,
  updateIdeaStatuswithFeedback,
  deleteIdeaSoftByAdmin,
  changeIspaidFalseToTrue,
  changeApprovedToUnderReview,
  getLimitedIdeaForHomePage,
};
