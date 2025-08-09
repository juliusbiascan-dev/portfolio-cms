import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import ProjectListWrapper from "@/features/project/project-list-wrapper";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ProjectsPage = async ({
  params
}: {
  params: { subdomainId: string }
}) => {
  const session = await auth();

  if (!session) redirect("/auth/login");

  const subdomain = await db.subdomain.findFirst({
    where: { id: params.subdomainId, userId: session.user.id },
    include: {
      profile: {
        include: {
          projects: {
            include: {
              links: true
            }
          }
        }
      }
    }
  });

  if (!subdomain) {
    return redirect('/');
  }

  const projects = subdomain.profile?.projects || [];

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <ProjectListWrapper
          subdomainId={subdomain.id}
          profileId={subdomain.profile?.id}
          projects={projects}
        />
      </div>
    </PageContainer>
  );
}

export default ProjectsPage;
