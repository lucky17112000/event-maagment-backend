import z from "zod";
export const purchaseValidationzod = z.object({
    ideaId: z.string(),
    //   userId: z.string(),
});
