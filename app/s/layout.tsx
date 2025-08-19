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
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
      {children}
    </div>
  );
}

export default SLayout;