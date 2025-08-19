"use client";

import { notFound } from 'next/navigation';
import { WorkForm } from '@/features/work/work-form';
import { Work } from '@/lib/generated/prisma';

type WorkViewPageProps = {
  workId: string;
  work: Work | null;
  subdomainId: string;
  profileId?: string;
  works: Work[];
};

export default function WorkViewPage({
  workId,
  work,
  subdomainId,
  profileId,
  works
}: WorkViewPageProps) {
  let pageTitle = 'Add New Work Experience';

  if (workId !== 'new') {
    if (!work) {
      notFound();
    }
    pageTitle = 'Edit Work Experience';
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
      <WorkForm
        subdomainId={subdomainId}
        profileId={profileId}
        works={works}
        mode={workId === 'new' ? 'create' : 'edit'}
        initialData={work || undefined}
      />
    </div>
  );
}
