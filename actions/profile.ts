"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { profileFormSchema } from "@/features/profile/schema";
import { revalidatePath } from "next/cache";

export const updateProfile = async (subdomainId: string, values: z.infer<typeof profileFormSchema>) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const subdomain = await db.subdomain.findFirst({
      where: { id: subdomainId, userId: session.user.id },
      include: {
        profile: true
      }
    })

    if (!subdomain) {
      return { error: "Subdomain not found" };
    }

    const validatedFields = profileFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    if (!subdomain.profile) {
      // Create new profile if it doesn't exist
      await db.profile.create({
        data: {
          subdomains: {
            connect: {
              id: subdomainId
            }
          },
          name: values.name,
          initials: values.initials,
          url: values.url,
          location: values.location,
          locationLink: values.locationLink,
          description: values.description,
          summary: values.summary,
          avatar: values.avatar,
          skills: values.skills,
        }
      });
      return { success: "Profile created!" };
    }

    await db.profile.update({
      where: {
        id: subdomain.profile?.id
      },
      data: {
        name: values.name,
        initials: values.initials,
        url: values.url,
        location: values.location,
        locationLink: values.locationLink,
        description: values.description,
        summary: values.summary,
        avatar: values.avatar,
        skills: values.skills,
      }
    });

    revalidatePath("/");
    return { success: "Profile updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}
