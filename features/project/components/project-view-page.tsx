"use client";

import { notFound } from 'next/navigation';
import { ProjectForm } from '../../project-form';
import { Project, Link } from '@/lib/generated/prisma';

type ProjectViewPageProps = {
  projectId: string;
  project: (Project & { links: Link[] }) | null;
  subdomainId: string;
  profileId?: string;
  projects: (Project & { links: Link[] })[];
};

export default function ProjectViewPage({
  projectId,
  project,
  subdomainId,
  profileId,
  projects
}: ProjectViewPageProps) {
  let pageTitle = 'Add New Project';

  if (projectId !== 'new') {
    if (!project) {
      notFound();
    }
    pageTitle = 'Edit Project';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
      <ProjectForm
        subdomainId={subdomainId}
        profileId={profileId}
        projects={projects}
        mode={projectId === 'new' ? 'create' : 'edit'}
        initialData={project}
      />
    </div>
  );
}
