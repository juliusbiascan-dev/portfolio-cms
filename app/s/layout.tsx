import PageContainer from "@/components/layout/page-container";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Inter as FontSans } from "next/font/google";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const SLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className={cn(
      "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
      fontSans.variable
    )}>
      <PageContainer scrollable>
        <div className='flex-1 space-y-4'>
          {children}
        </div>
      </PageContainer>

    </main>
  );
}

export default SLayout;