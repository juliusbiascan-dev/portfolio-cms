import * as z from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  initials: z.string().min(1, {
    message: "Initials are required.",
  }).max(3, {
    message: "Initials must not exceed 3 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  locationLink: z.string().url({
    message: "Please enter a valid location URL.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }),
  avatar: z.string().url({
    message: "Please enter a valid avatar URL.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please add at least one skill.",
  }),
});
