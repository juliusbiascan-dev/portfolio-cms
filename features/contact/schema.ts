import * as z from "zod";

const socialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().min(1, "Icon is required"),
  navbar: z.boolean(),
});

export const contactFormSchema = z.object({
  email: z.string().email("Must be a valid email"),
  social: z.array(socialSchema),
});
