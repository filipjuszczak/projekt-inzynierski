"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateAccountSettings } from "@/app/(main)/konto/actions";
import {
  updateAccountSettingsSchema,
  type UpdateAccountSettingsValues
} from "@/lib/validation/user";

interface ChangeAccountSettingsFormProps {
  userId: string;
  newsletterConsent: boolean;
}

export default function ChangeAccountSettingsForm({
  userId,
  newsletterConsent
}: ChangeAccountSettingsFormProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateAccountSettingsValues>({
    resolver: zodResolver(updateAccountSettingsSchema),
    defaultValues: {
      newsletterConsent
    }
  });

  async function onFormSubmit(values: UpdateAccountSettingsValues) {
    startTransition(async () => {
      const result = await updateAccountSettings(userId, values);

      if ("error" in result) {
        toast.error(result.error);
      }

      if ("success" in result && result.success) {
        toast.success("Ustawienia konta zostały pomyślnie zapisane!");
        router.refresh();
      }
    });
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
          isPending={isPending}
          idleText="Zapisz"
          loadingText="Zapisywanie..."
          className="w-full"
        />
      </form>
    </Form>
  );
}
