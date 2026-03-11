import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SubmissionsTable, type SubmissionRow } from "./SubmissionsTable";

type Props = { searchParams: Promise<{ form?: string }> };

export default async function SubmissionsPage({ searchParams }: Props) {
  const { form: formId } = await searchParams;
  const supabase = await createClient();

  const { data: submissions, error } = await supabase
    .from("form_submissions")
    .select("id, form_id, data, created_at, forms ( id, name )")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--destructive)] bg-[var(--destructive)]/10 p-4 text-[var(--destructive)]">
        שגיאה בטעינת הפניות: {error.message}
      </div>
    );
  }

  // נרמול השורות
  const rows: SubmissionRow[] = (submissions ?? []).map((s) => {
    const f = s.forms;
    const name = Array.isArray(f)
      ? ((f[0] as { name: string } | undefined)?.name ?? "")
      : ((f as { name: string } | null)?.name ?? "");
    return {
      id: s.id,
      form_id: s.form_id,
      form_name: name || s.form_id,
      data: (s.data as Record<string, unknown>) ?? {},
      created_at: s.created_at,
    };
  });

  // סינון לפי טופס ספציפי
  const filtered = formId ? rows.filter(r => r.form_id === formId) : rows;

  // רשימת טפסים ייחודיים לפילטר
  const forms = Array.from(
    new Map(rows.map(r => [r.form_id, { id: r.form_id, name: r.form_name }])).values()
  );

  const currentForm = formId ? forms.find(f => f.id === formId) : null;

  return (
    <div className="space-y-4">
      {/* כותרת */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold">
            {currentForm ? `פניות שהתקבלו: ${currentForm.name}` : "כל הפניות שהתקבלו"}
          </h1>
          {formId && (
            <Link href="/dashboard/submissions" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mt-0.5 inline-block">
              ← הצג את כל הפניות
            </Link>
          )}
        </div>
        <Link href="/dashboard/forms" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          ← חזרה לטפסים
        </Link>
      </div>

      <SubmissionsTable
        rows={filtered}
        showFormColumn={!formId}
        forms={forms}
      />
    </div>
  );
}
