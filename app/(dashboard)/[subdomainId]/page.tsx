import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface DashboardPageProps { params: Promise<{ subdomainId: string; }>; }

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const { subdomainId } = await params;

  const session = await auth();

  if (!session) redirect("/auth/login");

  const subdomain = await db.subdomain.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!subdomain) {
    return redirect('/');
  }

  else {
    redirect(`${subdomainId}/overview`);
  }
}

export default DashboardPage;