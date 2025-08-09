"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { projectFormSchema } from "@/features/project/schema";
import { revalidatePath } from "next/cache";

export const createProject = async (
  subdomainId: string,
  profileId: string,
  values: z.infer<typeof projectFormSchema>
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

    const validatedFields = projectFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { links, ...projectData } = values;

    const project = await db.project.create({
      data: {
        ...projectData,
        profileId,
        links: {
          create: links
        }
      }
    });

    revalidatePath(`/${subdomainId}/projects`);
    return { success: "Project added!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const updateProject = async (
  subdomainId: string,
  projectId: string,
  values: z.infer<typeof projectFormSchema>
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

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        profileId: subdomain.profile?.id
      }
    });

    if (!project) {
      return { error: "Project not found" };
    }

    const validatedFields = projectFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { links, ...projectData } = values;

    await db.project.update({
      where: { id: projectId },
      data: {
        ...projectData,
        links: {
          deleteMany: {},
          create: links
        }
      }
    });

    revalidatePath(`/${subdomainId}/projects`);
    revalidatePath(`/${subdomainId}/projects/${projectId}`);
    return { success: "Project updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};

export const deleteProject = async (
  subdomainId: string,
  projectId: string
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

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        profileId: subdomain.profile?.id
      }
    });

    if (!project) {
      return { error: "Project not found" };
    }

    await db.project.delete({
      where: { id: projectId }
    });

    revalidatePath(`/${subdomainId}/projects`);
    return { success: "Project deleted!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
