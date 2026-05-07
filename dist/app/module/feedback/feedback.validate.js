import z from "zod";
export const createFeedbackZodSchema = z.object({
    ideaId: z.string().min(1, "Idea id is required"),
    message: z.string().min(1, "Message is required"),
    reason: z.enum([
        "FEASIBILITY_ISSUE",
        "INCOMPLETE",
        "DUPLICATE_IDEA",
        "IRRELEVANT",
        "OTHER",
    ]),
});
export const updateFeedbackZodSchema = z.object({
    message: z.string().min(1).optional(),
    reason: z
        .enum([
        "FEASIBILITY_ISSUE",
        "INCOMPLETE",
        "DUPLICATE_IDEA",
        "IRRELEVANT",
        "OTHER",
    ])
        .optional(),
    isResolved: z.boolean().optional(),
});
