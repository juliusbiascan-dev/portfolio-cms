import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import WorkListWrapper from "@/features/work/work-list-wrapper";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const WorkPage = async ({
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
      profile: {
        include: {
          works: true
        }
      }
    }
  });

  if (!subdomain) {
    return redirect('/');
  }

  const works = subdomain.profile?.works || [];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <WorkListWrapper
          subdomainId={subdomain.id}
          profileId={subdomain.profile?.id}
          works={works}
        />
      </div>
    </PageContainer>
  );
}

export default WorkPage;
