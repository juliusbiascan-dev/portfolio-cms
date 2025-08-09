"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Project, Link } from "@/lib/generated/prisma";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { projectFormSchema } from "./schema";
import { createProject, updateProject } from "@/actions/project";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

interface ProjectFormProps {
  subdomainId: string;
  profileId?: string;
  projects: (Project & { links: Link[] })[];
  mode?: "create" | "edit";
  initialData?: Project & { links: Link[] };
}

export function ProjectForm({ subdomainId, profileId, projects, mode = "create", initialData }: ProjectFormProps) {

  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      href: initialData?.href || "",
      dates: initialData?.dates || "",
      active: initialData?.active ?? true,
      description: initialData?.description || "",
      technologies: initialData?.technologies || [],
      links: initialData?.links || [],
      image: initialData?.image || null,
      video: initialData?.video || null,
    },
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    name: "links",
    control: form.control,
  });

  const onSubmit = async (data: z.infer<typeof projectFormSchema>) => {
    try {
      if (!profileId) {
        setError("Please set up your profile first!");
        return;
      }

      setIsPending(true);
      setError(undefined);
      setSuccess(undefined);

      const response = mode === "create"
        ? await createProject(subdomainId, profileId, data)
        : await updateProject(subdomainId, initialData?.id!, data);

      if (response.error) {
        setError(response.error);
      }

      if (response.success) {
        setSuccess(response.success);
        if (mode === "create") {
          form.reset();
        }
        setTimeout(() => {
          router.push(`/${subdomainId}/project`);
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Add Project" : "Edit Project"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormError message={error} />
              <FormSuccess message={success} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="href"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://project.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="Jan 2023 - Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active Project</FormLabel>
                        <FormDescription>
                          Is this project currently active?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Video URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies Used</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add technologies (comma separated)"
                          {...field}
                          onChange={(e) => {
                            const technologies = e.target.value.split(",").map((tech) => tech.trim());
                            field.onChange(technologies);
                          }}
                          value={field.value?.join(", ")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Project Links</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendLink({ type: "", href: "" })}
                  >
                    Add Link
                  </Button>
                </div>

                {linkFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`links.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Link Type</FormLabel>
                          <FormControl>
                            <Input placeholder="GitHub" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`links.${index}.href`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeLink(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project"
                        {...field}
                        className="min-h-[150px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : mode === "create" ? "Add Project" : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
