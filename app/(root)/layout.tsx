import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth, signOut } from "@/auth";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const users = await db.user.findMany();

  if (users.length === 0) {
    redirect("/setup");
  }

  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id
    }
  });

  if (!user) {
    await signOut({ redirectTo: "/" });
  }


  const subdomain = await db.subdomain.findFirst({
    where: {
      userId: session.user.id,
    },
  })


  if (subdomain) {
    return redirect(`/${subdomain.id}`);
  }

  return <>{children}</>;
}
