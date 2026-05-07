/*

export interface IcreateIdeaPayload {
  title: string;
  problemStatement: string;
  solutinon: string;
  description: string;
  images?: string[];
  categoryId: string;
  authorId: string;
  price?: number;
}
*/
import z from "zod";
import { FEEDBACK_REASON, IDEA_STATUS } from "../../../generated/prisma/enums.js";
const createIdeaZodSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    problemStatement: z
        .string()
        .min(10, "Problem statement must be at least 10 characters long"),
    solutinon: z.string().min(10, "Solution must be at least 10 characters long"),
    description: z
        .string()
        .min(20, "Description must be at least 20 characters long"),
    // images: z.array(z.string()).optional(),
    categoryId: z.string(),
    authorId: z.string(),
    // Multipart/form-data sends all text fields as strings.
    price: z.coerce
        .number()
        .positive("Price must be a positive number")
        .optional(),
});
const updateIdeaStatusZodSchema = z.object({
    ideaId: z.string().min(1, "ideaId is required"),
    ideaStatus: z.enum([
        IDEA_STATUS.UNDER_REVIEW,
        IDEA_STATUS.APPROVED,
        IDEA_STATUS.REJECTED,
        IDEA_STATUS.PUBLISHED,
        IDEA_STATUS.ARCHIVED,
    ]),
    message: z.string().min(1, "message is required"),
    reason: z.enum([
        FEEDBACK_REASON.FEASIBILITY_ISSUE,
        FEEDBACK_REASON.INCOMPLETE,
        FEEDBACK_REASON.DUPLICATE_IDEA,
        FEEDBACK_REASON.IRRELEVANT,
        FEEDBACK_REASON.OTHER,
    ]),
});
const changeIsPaidZodSchema = z
    .object({
    ideaId: z.string().min(1, "ideaId is required"),
    // Support both common casing styles from clients.
    isPaid: z.boolean().optional(),
    ispaid: z.boolean().optional(),
})
    .transform((data) => ({
    ideaId: data.ideaId,
    isPaid: data.isPaid ?? data.ispaid,
}));
export const ideaValidator = {
    createIdeaZodSchema,
    updateIdeaStatusZodSchema,
    changeIsPaidZodSchema,
};
