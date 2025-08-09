import * as z from "zod";

const linkSchema = z.object({
  type: z.string().min(1, "Link type is required"),
  href: z.string().url("Must be a valid URL"),
});

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  href: z.string().url("Must be a valid URL"),
  dates: z.string().min(1, "Project dates are required"),
  active: z.boolean(),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()),
  links: z.array(linkSchema),
  image: z.string().url("Must be a valid URL").nullish(),
  video: z.string().url("Must be a valid URL").nullish(),
});
