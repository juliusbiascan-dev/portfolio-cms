import { auth } from "@/auth";
import PageContainer from "@/components/layout/page-container";
import { ContactForm } from "@/features/contact/contact-form";
import { contactFormSchema } from "@/features/contact/schema";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import z from "zod";

const ContactPage = async ({
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
          contact: {
            include: {
              social: true
            }
          }
        }
      }
    }
  });

  if (!subdomain) {
    return redirect('/');
  }

  const contact = subdomain.profile?.contact;

  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <ContactForm
          subdomainId={subdomain.id}
          profileId={subdomain.profile?.id}
          contact={contact || undefined}
        />
      </div>
    </PageContainer>
  );
}

export default ContactPage;
