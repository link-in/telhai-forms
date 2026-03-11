import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { FormRendererClient } from "./FormRendererClient";

type Props = { params: Promise<{ slug: string }> };

export default async function FormPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: form, error } = await supabase
    .from("forms")
    .select("id, name, slug, schema")
    .eq("slug", slug)
    .single();

  if (error || !form) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <FormRendererClient
        formId={form.id}
        formName={form.name}
        schema={form.schema as { fields: unknown[] }}
        successMessage={(form.schema as { successMessage?: string }).successMessage}
      />
    </main>
  );
}
