import { auth } from "@/auth";
import { db } from "@/lib/db";
import { protocol, rootDomain } from "@/lib/utils";
import { redirect } from "next/navigation";

const OverviewPage = async ({
  params
}: {
  params: { subdomainId: string }
}) => {

  const session = await auth();

  if (!session) redirect("/auth/login");


  const subdomain = await db.subdomain.findFirst({
    where: { id: params.subdomainId, userId: session.user.id }
  })


  if (!subdomain) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-between">
        <div className="text-4xl">{subdomain.name}</div>
        <div className="text-sm text-gray-500">
          Created: {new Date(subdomain.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="mt-4">
        <a
          href={`${protocol}://${subdomain.name}.${rootDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          Visit portfolio →
        </a>
      </div>
    </div>
  );
}

export default OverviewPage;