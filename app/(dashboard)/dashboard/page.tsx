import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { count: formsCount } = await supabase
    .from("forms")
    .select("*", { count: "exact", head: true });
  const { count: submissionsCount } = await supabase
    .from("form_submissions")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">דשבורד</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>טפסים</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formsCount ?? 0}</p>
            <p className="text-sm text-[var(--muted-foreground)]">טפסים מוגדרים</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>פניות שהתקבלו</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{submissionsCount ?? 0}</p>
            <p className="text-sm text-[var(--muted-foreground)]">סה״כ פניות שהתקבלו</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-2">
        <Link
          href="/dashboard/submissions"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--telhai-blue)] px-4 py-2 text-white font-medium hover:opacity-90"
        >
          צפייה בכל הפניות
        </Link>
      </div>
    </div>
  );
}
