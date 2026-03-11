import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormById, saveForm } from "@/lib/actions/forms";
import { FormBuilderClient } from "../../FormBuilderClient";

type Props = { params: Promise<{ id: string }> };

export default async function EditFormPage({ params }: Props) {
  const { id } = await params;
  let form;
  try {
    form = await getFormById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/forms"
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← חזרה לטפסים
        </Link>
      </div>
      <h1 className="text-2xl font-bold">עריכת טופס: {form.name}</h1>
      <FormBuilderClient
        mode="edit"
        formId={id}
        initialName={form.name}
        initialSlug={form.slug}
        initialFields={form.schema.fields}
        initialSuccessMessage={form.schema.successMessage}
        saveFormAction={saveForm}
      />
    </div>
  );
}
