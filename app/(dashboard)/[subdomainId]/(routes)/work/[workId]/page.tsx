import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import { WorkForm } from "@/features/work/work-form";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const WorkPage = async ({
  params
}: {
  params: { subdomainId: string; workId: string }
}) => {
  const session = await auth();

  if (!session) redirect("/auth/login");

  const subdomain = await db.subdomain.findFirst({
    where: { id: params.subdomainId, userId: session.user.id },
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

  let work = null;
  let pageTitle = "Add Work Experience";
  let mode: "create" | "edit" = "create";

  // Handle both "new" and existing work ids
  if (params.workId !== 'new') {
    work = await db.work.findFirst({
      where: {
        id: params.workId,
        profileId: subdomain.profile?.id
      }
    });

    if (!work) {
      return redirect(`/${params.subdomainId}/work`);
    }

    pageTitle = "Edit Work Experience";
    mode = "edit";
  }

  return (
    <PageContainer scrollable>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
        <WorkForm
          subdomainId={subdomain.id}
          profileId={subdomain.profile?.id}
          initialData={work || undefined}
          works={subdomain.profile?.works || []}
          mode={mode}
        />
      </div>
    </PageContainer>
  );
}

export default WorkPage;
