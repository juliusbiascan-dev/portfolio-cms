'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { getSubdomainData } from '@/data/subdomains';

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {

  const session = await auth()

  if (!session) {

    return { success: false, error: 'Unauthorized' };
  }

  const { id } = session.user;
  const subdomain = formData.get('subdomain') as string;


  if (!subdomain) {
    return { success: false, error: 'Subdomain are required' };
  }


  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const subdomainAlreadyExists = await db.subdomain.findFirst({
    where: {
      name: sanitizedSubdomain
    }
  });


  if (subdomainAlreadyExists) {
    return {
      subdomain,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  await db.subdomain.create({
    data: {
      userId: id,
      name: sanitizedSubdomain,
      createdAt: new Date()
    }
  });

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;

  const data = await getSubdomainData(subdomain)

  if (!data) {
    return { success: false, error: 'Subdomain not found' };
  }

  await db.subdomain.delete({
    where: {
      id: data.id
    }
  });
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}
