import Link from "next/link";
import { FormBuilderClient } from "../FormBuilderClient";
import { saveForm } from "@/lib/actions/forms";

export default function NewFormPage() {
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
      <h1 className="text-2xl font-bold">טופס חדש</h1>
      <FormBuilderClient
        mode="new"
        initialName=""
        initialSlug=""
        initialFields={[]}
        saveFormAction={saveForm}
      />
    </div>
  );
}
