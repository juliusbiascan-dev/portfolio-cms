"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { workFormSchema } from "@/features/work/schema";
import { revalidatePath } from "next/cache";

export const createWork = async (
  subdomainId: string,
  profileId: string,
  values: z.infer<typeof workFormSchema>
) => {
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
    });

    if (!subdomain) {
      return { error: "Subdomain not found" };
    }

    if (!subdomain.profile) {
      return { error: "Profile not found" };
    }

    const validatedFields = workFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    await db.work.create({
      data: {
        ...values,
        profileId
      }
    });

    revalidatePath(`/${subdomainId}/work`);
    return { success: "Work experience added!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateWork = async (
  subdomainId: string,
  workId: string,
  values: z.infer<typeof workFormSchema>
) => {
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
    });

    if (!subdomain) {
      return { error: "Subdomain not found" };
    }

    const work = await db.work.findFirst({
      where: {
        id: workId,
        profileId: subdomain.profile?.id
      }
    });

    if (!work) {
      return { error: "Work experience not found" };
    }

    const validatedFields = workFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    await db.work.update({
      where: { id: workId },
      data: values
    });

    revalidatePath(`/${subdomainId}/work`);
    revalidatePath(`/${subdomainId}/work/${workId}`);
    return { success: "Work experience updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const deleteWork = async (
  subdomainId: string,
  workId: string
) => {
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
    });

    if (!subdomain) {
      return { error: "Subdomain not found" };
    }

    const work = await db.work.findFirst({
      where: {
        id: workId,
        profileId: subdomain.profile?.id
      }
    });

    if (!work) {
      return { error: "Work experience not found" };
    }

    await db.work.delete({
      where: { id: workId }
    });

    revalidatePath(`/${subdomainId}/work`);
    return { success: "Work experience deleted!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
