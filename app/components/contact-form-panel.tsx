"use client";
import { useState } from "react";
import { Panel } from "./panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Integration, useIntegrationApp } from "@integration-app/react";

const contactFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Please enter a valid phone number.",
    }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  pronouns: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type PendingResult = {
  status: "pending";
  integration: Integration;
};

type SuccessResult = {
  status: "success";
  integration: Integration;
  contact: {
    id: string;
    uri: string;
  };
};

type ErrorResult = {
  status: "error";
  integration: Integration;
  error: Error;
};

export type ContactResult = PendingResult | SuccessResult | ErrorResult;

interface ContactFormPanelProps {
  integrations: Integration[];
  onContactResult: (result: ContactResult) => void;
}

export function ContactFormPanel({
  integrations,
  onContactResult,
}: ContactFormPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const integrationApp = useIntegrationApp();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      pronouns: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      setIsSubmitting(true);

      const nameParts = data.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const contactData = {
        fullName: data.fullName,
        firstName: firstName,
        lastName: lastName,
        primaryEmail: data.email,
        primaryPhone: data.phone,
        companyName: data.company,
        pronouns: data.pronouns,
      };

      const connectedIntegrations = integrations.filter(
        (integration) => integration.connection,
      );

      connectedIntegrations.forEach((integration) => {
        onContactResult({ status: "pending", integration });
      });

      let anyErrors = false;
      function onError(integration: Integration, error: Error) {
        onContactResult({
          status: "error",
          integration,
          error,
        });
        anyErrors = true;
      }

      await Promise.all(
        connectedIntegrations.map((integration) => {
          // Invoke the "create-contact" action to create a new contact in all connected integrations
          return integrationApp
            .connection(integration.connection!.id)
            .action("create-contact")
            .run(contactData)
            .then((result) => {
              // Read new contact details to be able to link to it
              return integrationApp
                .connection(integration.connection!.id)
                .action("find-contact-by-id")
                .run({ id: result.output.id })
                .then((contactResult) => {
                  onContactResult({
                    status: "success",
                    integration,
                    contact: {
                      id: result.output.id,
                      uri: contactResult.output.uri,
                    },
                  });
                })
                .catch((error) => {
                  onError(integration, error);
                });
            })
            .catch((error) => {
              onError(integration, error);
            });
        }),
      );

      // TODO: add back after testing
      if (!anyErrors) {
        form.reset();
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Failed to create contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Panel title="Create Contact" className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Inc."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pronouns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pronouns</FormLabel>
                <FormControl>
                  <Input
                    placeholder="they/them"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Contact..." : "Create Contact"}
          </Button>
        </form>
      </Form>
    </Panel>
  );
}
