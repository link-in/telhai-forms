"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormRenderer } from "@/components/forms/form-renderer";
import type { FormSchema } from "@/types/form";

type Props = {
  formId: string;
  formName: string;
  schema: { fields: unknown[] };
  successMessage?: string;
};

export function FormRendererClient({ formId, formName, schema, successMessage }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formSchema = schema as FormSchema;

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("form_submissions").insert({
        form_id: formId,
        data,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (e) {
      console.error(e);
      alert("אירעה שגיאה בשליחת הטופס. נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    const message = successMessage?.trim() || "תודה על פנייתך! נחזור אליך בהקדם.";
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-[var(--telhai-primary)]/30 bg-[var(--telhai-primary)]/5 p-10 text-center max-w-md w-full">
        <CheckCircle size={48} className="text-[var(--telhai-primary)]" />
        <h2 className="text-xl font-bold text-[var(--telhai-primary)]">הטופס נשלח בהצלחה!</h2>
        <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-line">{message}</p>
      </div>
    );
  }

  return (
    <FormRenderer
      formSchema={formSchema}
      formName={formName}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
