import { Request, Response } from "express";
import { catchasync } from "../../../shared/cathAsync";
import { voteService } from "./vote.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { sendResponse } from "../../../shared/sendResponse";
import AppError from "../../errorHelper.ts/AppError";
import status from "http-status";

const createVote = catchasync(async (req: Request, res: Response) => {
  console.log("ideaId in controller:", req.body.ideaId);
  if (!req.body.ideaId) {
    throw new AppError(status.BAD_REQUEST, "Idea id is required");
  }
  if (!req.user) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized access");
  }
  const result = await voteService.createVote(
    req.body,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Vote created successfully",
    data: result,
  });
});
const countUpVotes = catchasync(async (req: Request, res: Response) => {
  const ideaId = req.params.id;
  const result = await voteService.countUpVotes(ideaId as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Up-vote count retrieved successfully",
    data: result,
  });
});
const countDownVotes = catchasync(async (req: Request, res: Response) => {
  const ideaId = req.params.id;
  const result = await voteService.countDownVotes(ideaId as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Down-vote count retrieved successfully",
    data: result,
  });
});

const removeVote = catchasync(async (req: Request, res: Response) => {
  const result = await voteService.removeVote(
    req.body,
    req.user as IRequestUser,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Vote removed successfully",
    data: result,
  });
});
export const voteController = {
  createVote,
  countUpVotes,
  countDownVotes,
  removeVote,
};
