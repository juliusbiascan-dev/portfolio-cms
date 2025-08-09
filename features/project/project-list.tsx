"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "./project-form";
import { Project, Link } from "@/lib/generated/prisma";
import { ProjectSkeleton } from "@/components/skeletons/project-skeleton";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Folder } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/project";
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

interface ProjectListProps {
  subdomainId: string;
  profileId?: string;
  projects: (Project & { links: Link[] })[];
}

export function ProjectList({ subdomainId, profileId, projects }: ProjectListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async (projectId: string) => {
    try {
      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      const response = await deleteProject(subdomainId, projectId);

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
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        {!(projects.length === 0) && (
          <Button onClick={() => router.push(`/${subdomainId}/projects/new`)}>
            Add Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyPlaceholder
          icon={<Folder className="h-12 w-12 text-muted-foreground" />}
          title="No projects yet"
          description="Create your first project to showcase your work."
        >
          <Button onClick={() => router.push(`/${subdomainId}/projects/new`)}>
            Add Project
          </Button>
        </EmptyPlaceholder>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.dates}</CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    {project.active && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/${subdomainId}/projects/${project.id}`)}
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
                            This action cannot be undone. This will permanently delete the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            disabled={isPending}
                          >
                            {isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <p className="text-sm text-muted-foreground">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                    >
                      {link.type} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
