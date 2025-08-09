import { db } from "../lib/db";

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const data = await db.subdomain.findFirst({
    where: { name: sanitizedSubdomain },
    include: {
      profile: {
        include: {
          contact: {
            include: {
              social: true
            }
          },
          works: true,
          projects: {
            include: {
              links: true
            }
          }
        }
      }
    }
  });
  return data;
}
