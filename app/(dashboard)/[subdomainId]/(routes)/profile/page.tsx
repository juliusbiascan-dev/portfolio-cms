import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import { ProfileForm } from "@/features/profile/profile-form";
import { profileFormSchema } from "@/features/profile/schema";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import z from "zod";

const ProfilePage = async ({
  params
}: {
  params: Promise<{ subdomainId: string }>
}) => {
  const { subdomainId } = await params;

  const session = await auth();

  if (!session) redirect("/auth/login");


  const subdomain = await db.subdomain.findFirst({
    where: { id: subdomainId, userId: session.user.id },
    include: {
      profile: true
    }
  })


  if (!subdomain) {
    return redirect('/');
  }

  const initialData: z.infer<typeof profileFormSchema> = {
    name: subdomain.profile?.name || "",
    initials: subdomain.profile?.initials || "",
    url: subdomain.profile?.url || "",
    location: subdomain.profile?.location || "",
    locationLink: subdomain.profile?.locationLink || "",
    description: subdomain.profile?.description || "",
    summary: subdomain.profile?.summary || "",
    avatar: subdomain.profile?.avatar || "",
    skills: subdomain.profile?.skills || [],
  }

  return (
    <>
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          <ProfileForm
            subdomainId={subdomain.id}
            initialData={initialData} />
        </div>
      </PageContainer>

    </>

  );

}

export default ProfilePage;