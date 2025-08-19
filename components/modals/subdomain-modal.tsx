"use client";

import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react"; // Using Lucide icons to match dashboard
import { useSubdomainModal } from "@/hooks/use-subdomain-modal";
import { createSubdomainAction } from "@/actions/subdomain";

const formSchema = z.object({
  subdomain: z.string().min(1),
});

type CreateState = {
  error?: string;
  success?: boolean;
  subdomain?: string;
};

export const SubdomainModal = () => {
  const subdomainModal = useSubdomainModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subdomain: "",
    },
  });


  const [state, action, isPending] = useActionState<CreateState, FormData>(
    createSubdomainAction,
    {}
  );

  return (
    <Modal
      title="Create Subdomain"
      description="Add a new subdomain for your portfolio"
      isOpen={subdomainModal.isOpen}
      onClose={subdomainModal.onClose}
    >
      <div className={`p-6 rounded-lg `}>
        <div className="flex justify-center mb-6">
          <div className={`p-4 rounded-full bg-gray-700`}>
            <Globe className="h-12 w-12" style={{ color: '#C9121F' }} />
          </div>

        </div>
        <Form {...form}>
          <form action={action} className="space-y-6">
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`text-lg font-semibold `}>
                    Subdomain Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Enter subdomain name"
                      {...field}
                      className={`border rounded-md `}
                    />
                  </FormControl>
                  <FormMessage />
                  {state?.error && (
                    <div className="text-sm text-red-500">{state.error}</div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                disabled={isPending}
                variant="outline"
                onClick={subdomainModal.onClose}

              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                style={{ backgroundColor: '#C9121F' }}
                className="text-white hover:opacity-90"
              >
                Create Subdomain
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
