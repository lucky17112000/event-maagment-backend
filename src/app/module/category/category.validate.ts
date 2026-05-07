import z from "zod";

export const createDoctorZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name must be less than 100 characters long"),
});

export const updateDoctorZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name must be at least 1 character long")
    .max(100, "Name must be less than 100 characters long"),
});
