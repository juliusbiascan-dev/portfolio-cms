"use client";


import { Button } from "@/components/ui/button";
import { WorkForm } from "./work-form";
import { Work } from "@/lib/generated/prisma";
import { WorkSkeleton } from "@/components/skeletons/work-skeleton";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteWork } from "@/actions/work";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkListProps {
  subdomainId: string;
  profileId?: string;
  works: Work[];
}

export function WorkList({ subdomainId, profileId, works }: WorkListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async (workId: string) => {
    try {
      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      const response = await deleteWork(subdomainId, workId);

      if (response.error) {
        setError(response.error);
      }

      if (response.success) {
        setSuccess(response.success);
      }
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
        {!(works.length === 0) && (
          <Button onClick={() => router.push(`/${subdomainId}/work/new`)}>
            Add Work Experience
          </Button>
        )}
      </div>

      {works.length === 0 ? (
        <EmptyPlaceholder
          icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
          title="No work experience yet"
          description="Add your work experience to showcase your professional journey."
        >
          <Button onClick={() => router.push(`/${subdomainId}/work/new`)}>
            Add Work Experience
          </Button>
        </EmptyPlaceholder>
      ) : (
        <div className="space-y-4">
          {works.map((work) => (
            <Card key={work.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {work.logoUrl && (
                      <img
                        src={work.logoUrl}
                        alt={work.company}
                        className="h-12 w-12 object-contain rounded-md"
                      />
                    )}
                    <div>
                      <CardTitle className="text-xl">{work.company}</CardTitle>
                      <CardDescription>{work.title}</CardDescription>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/${subdomainId}/work/${work.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this work experience.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(work.id)}
                              disabled={isPending}
                            >
                              {isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">
                      {work.start} - {work.end}
                    </p>
                    <p className="text-sm text-muted-foreground">{work.location}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-line">{work.description}</p>

                <div className="flex flex-wrap gap-2">
                  {work.badges.map((badge, index) => (
                    <Badge key={index} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {work.href && (
                  <a
                    href={work.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Company Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
