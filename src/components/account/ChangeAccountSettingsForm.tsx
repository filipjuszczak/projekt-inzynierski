"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";
import {
  updateAccountSettingsSchema,
  type UpdateAccountSettingsValues
} from "@/lib/validation/user";
import { authClient } from "@/lib/auth/auth-client";
import { trackUserActivityClient } from "@/lib/auth/track-activity";
import { UserActivities } from "@prisma/client";

export default function ChangeAccountSettingsForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const form = useForm<UpdateAccountSettingsValues>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      newsletterConsent: session?.user.newsletterConsent || false
    }
  });

  const { isSubmitting } = form.formState;

  async function onFormSubmit(values: UpdateAccountSettingsValues) {
    const previousConsent = session?.user.newsletterConsent;

    await authClient.updateUser(
      {
        newsletterConsent: values.newsletterConsent
      },
      {
        onSuccess: async () => {
          if (previousConsent !== values.newsletterConsent) {
            await trackUserActivityClient(
              values.newsletterConsent
                ? UserActivities.NEWSLETTER_CONSENT_GRANTED
                : UserActivities.NEWSLETTER_CONSENT_REVOKED
            );
          }

          toast.success("Zmiana ustawień konta przebiegła pomyślnie!");
          queryClient.invalidateQueries({ queryKey: ["userActivities"] });
          router.refresh();
        },
        onError: () => {
          toast.error("Wystąpił błąd podczas zmiany ustawień konta.");
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
        <FormField
          name="newsletterConsent"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel htmlFor={field.name}>
                  Zasubskrybuj newsletter
                </FormLabel>
                <FormControl>
                  <Switch
                    id="newsletterConsent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isPending={isSubmitting}
          idleText="Zapisz"
          loadingText="Zapisywanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
