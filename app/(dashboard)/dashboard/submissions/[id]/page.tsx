import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "כן" : "לא";
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object" && value !== null && "toString" in value) return String(value);
  return String(value);
}

function isUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: submission, error } = await supabase
    .from("form_submissions")
    .select(`
      id,
      form_id,
      data,
      created_at,
      forms ( id, name )
    `)
    .eq("id", id)
    .single();

  if (error || !submission) notFound();

  const data = (submission.data as Record<string, unknown>) ?? {};
  const formsRel = submission.forms;
  const formName = Array.isArray(formsRel) ? formsRel[0]?.name : (formsRel as { name: string } | null)?.name;
  const formDisplayName = formName ?? "טופס";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">פנייה: {formDisplayName}</h1>
        <Link
          href="/dashboard/submissions"
          className="inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--accent)]"
        >
          חזרה לרשימה
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>פרטי הפנייה</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">
            תאריך: {new Date(submission.created_at).toLocaleString("he-IL")}
          </p>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-1">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="rounded-md border border-[var(--border)] p-3">
                <dt className="text-sm font-medium text-[var(--muted-foreground)]">{key}</dt>
                <dd className="mt-1">
                  {typeof value === "string" && isUrl(value) ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] underline"
                    >
                      {value}
                    </a>
                  ) : (
                    formatValue(value)
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
