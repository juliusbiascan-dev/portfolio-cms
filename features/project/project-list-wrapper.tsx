"use client";

import { Suspense } from "react";
import { ProjectList } from "./project-list";
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton";
import { Project, Link } from "@/lib/generated/prisma";

interface ProjectListWrapperProps {
  subdomainId: string;
  profileId?: string;
  projects: (Project & { links: Link[] })[];
}

export default function ProjectListWrapper({ subdomainId, profileId, projects }: ProjectListWrapperProps) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectList
        subdomainId={subdomainId}
        profileId={profileId}
        projects={projects}
      />
    </Suspense>
  );
}
