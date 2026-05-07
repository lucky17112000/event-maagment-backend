import { ideaService } from "./idea.services.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import status from "http-status";
import AppError from "../../errorHelper.ts/AppError.js";
import { catchasync } from "../../../shared/cathAsync.js";
const createIdea = async (req, res) => {
    // console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    const uploadedFiles = Array.isArray(req.files)
        ? req.files
        : [];
    const data = {
        ...req.body,
        images: uploadedFiles.map((file) => file.path),
    };
    const result = await ideaService.createIdea(data);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Idea created successfully",
        data: result,
    });
};
const getAllIdeas = async (req, res) => {
    const query = req.query;
    const result = await ideaService.getAllIdeas(query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea retrived successfully",
        data: result.data,
        meta: result.meta,
    });
};
const getIdeayId = async (req, res) => {
    const id = req.params.id;
    const result = await ideaService.getIdeaById(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea retrived successfully",
        data: result,
    });
};
const updateIdea = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await ideaService.updateIdea(id, data);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea updated successfully",
        data: result,
    });
};
const deleteIdea = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.deleteIdea(id, req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea deleted successfully",
        data: result,
    });
};
const deleteIdeaSoft = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.deleteIdeaSoft(id, req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea soft deleted successfully",
        data: result,
    });
};
const deleteIdeaSoftByAdmin = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        throw new AppError(status.BAD_REQUEST, "Idea id is required");
    }
    if (!req.user) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.deleteIdeaSoftByAdmin(id, req.user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea soft deleted successfully by admin",
        data: result,
    });
};
const updateIdeaStatuswithFeedback = catchasync(async (req, res) => {
    const id = req.user;
    const data = req.body;
    if (!id) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.updateIdeaStatusWithFeedback(id, data);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea status updated successfully",
        data: result,
    });
});
const changeIspaidFalseToTrue = async (req, res) => {
    const id = req.user;
    const data = req.body;
    if (!id) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.changeIspaidFalseToTrue(data, id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea isPaid status updated successfully",
        data: result,
    });
};
const changeApprovedToUnderReview = catchasync(async (req, res) => {
    const id = req.user;
    const data = req.body;
    if (!id) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
    }
    const result = await ideaService.changeApprovedToUnderReview(data, id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Idea status changed from approved to under review successfully",
        data: result,
    });
});
const getLimitedIdeaForHomePage = catchasync(async (req, res) => {
    const result = await ideaService.getLimitedIdeaForHomePage();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Limited ideas for home page retrieved successfully",
        data: result,
    });
});
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
