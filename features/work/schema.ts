import * as z from "zod";

export const workFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  href: z.string().url("Must be a valid URL"),
  badges: z.array(z.string()),
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Job title is required"),
  logoUrl: z.string().url("Must be a valid URL").optional(),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
});
