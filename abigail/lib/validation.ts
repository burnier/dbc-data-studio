/**
 * Validation schemas using Zod
 */
import { z } from "zod";

export const ritualFormSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .trim(),
    email: z.string()
        .email("Please enter a valid email address")
        .toLowerCase()
        .trim(),
    question: z.string()
        .min(10, "Question must be at least 10 characters")
        .max(1000, "Question must be less than 1000 characters")
        .trim(),
    language: z.enum(["en", "de", "pt", "hu"]).default("en"),
});

export const cardSelectionSchema = z.object({
    submissionId: z.number().int().positive(),
    selectedCardIds: z.array(z.number().int().min(0).max(35)).length(3),
});

export type RitualFormData = z.infer<typeof ritualFormSchema>;
export type CardSelectionData = z.infer<typeof cardSelectionSchema>;

