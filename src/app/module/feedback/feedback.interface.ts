import { FEEDBACK_REASON } from "../../../generated/prisma/enums";

// Client/API payload for creating feedback.
// Typically `adminId` should come from `req.user.userId` (auth middleware), not from client.
export interface ICreateFeedbackPayload {
  ideaId: string;
  message: string;
  reason: FEEDBACK_REASON;
}

// Service-level payload when you want to pass adminId explicitly.
export interface ICreateFeedbackServicePayload extends ICreateFeedbackPayload {
  adminId: string;
}

// Payload for updating feedback.
// We usually do not allow changing `ideaId` or `adminId` via update.
export interface IUpdateFeedbackPayload {
  message?: string;
  reason?: FEEDBACK_REASON;
  isResolved?: boolean;
}
