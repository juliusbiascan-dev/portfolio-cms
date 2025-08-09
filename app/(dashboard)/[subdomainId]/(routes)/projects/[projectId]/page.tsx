import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import { ProjectForm } from "@/features/project/project-form";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ProjectPage = async ({
  params
}: {
  params: { subdomainId: string; projectId: string }
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

  let project = null;
  let pageTitle = "Add Project";
  let mode: "create" | "edit" = "create";

  // Handle both "new" and existing project ids
  if (params.projectId !== 'new') {
    project = await db.project.findFirst({
      where: {
        id: params.projectId,
        profileId: subdomain.profile?.id
      },
      include: {
        links: true
      }
    });

    if (!project) {
      return redirect(`/${params.subdomainId}/projects`);
    }

    pageTitle = "Edit Project";
    mode = "edit";
  }

  return (
    <PageContainer scrollable>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <ProjectForm
          subdomainId={subdomain.id}
          profileId={subdomain.profile?.id}
          initialData={project || undefined}
          projects={subdomain.profile?.projects || []}
          mode={mode}
        />
      </div>
    </PageContainer>
  );
}

export default ProjectPage;
