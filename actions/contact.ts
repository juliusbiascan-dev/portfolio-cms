"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { contactFormSchema } from "@/features/contact/schema";
import { revalidatePath } from "next/cache";

export const updateContact = async (
  subdomainId: string,
  profileId: string,
  values: z.infer<typeof contactFormSchema>
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const subdomain = await db.subdomain.findFirst({
      where: { id: subdomainId, userId: session.user.id },
      include: {
        profile: {
          include: {
            contact: {
              include: {
                social: true
              }
            }
          }
        }
      }
    });

    if (!subdomain) {
      return { error: "Subdomain not found" };
    }

    if (!subdomain.profile) {
      return { error: "Profile not found" };
    }

    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { social, ...contactData } = values;

    if (!subdomain.profile.contact) {
      await db.contact.create({
        data: {
          ...contactData,
          profileId,
          social: {
            create: social
          }
        }
      });
    } else {
      await db.contact.update({
        where: {
          id: subdomain.profile.contact.id
        },
        data: {
          ...contactData,
          social: {
            deleteMany: {},
            create: social
          }
        }
      });
    }

    revalidatePath(`/${subdomainId}/contact`);
    return { success: "Contact information updated!" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
};
