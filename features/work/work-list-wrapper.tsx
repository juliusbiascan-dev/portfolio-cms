"use client";

import { Suspense } from "react";
import { WorkList } from "./work-list";
import { WorkSkeleton } from "@/components/skeletons/work-skeleton";
import { Work } from "@/lib/generated/prisma";

interface WorkListWrapperProps {
  subdomainId: string;
  profileId?: string;
  works: Work[];
}

export default function WorkListWrapper({ subdomainId, profileId, works }: WorkListWrapperProps) {
  return (
    <Suspense fallback={<WorkSkeleton />}>
      <WorkList
        subdomainId={subdomainId}
        profileId={profileId}
        works={works}
      />
    </Suspense>
  );
}
