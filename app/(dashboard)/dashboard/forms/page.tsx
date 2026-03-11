import Link from "next/link";
import { Suspense } from "react";
import { getForms } from "@/lib/actions/forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SuccessMessage } from "./SuccessMessage";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    dateStyle: "short",
  });
}

export default async function FormsListPage() {
  let forms: Awaited<ReturnType<typeof getForms>> = [];
  try {
    forms = await getForms();
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <SuccessMessage />
      </Suspense>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">טפסים</h1>
        <Link
          href="/dashboard/forms/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--telhai-blue)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          טופס חדש
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>כל הטפסים</CardTitle>
        </CardHeader>
        <CardContent>
          {!forms.length ? (
            <p className="text-[var(--muted-foreground)]">אין עדיין טפסים. צור טופס חדש כדי להתחיל.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם הטופס</TableHead>
                  <TableHead>כתובת (slug)</TableHead>
                  <TableHead>נוצר</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell className="font-mono text-sm text-[var(--muted-foreground)]">
                      /form/{form.slug}
                    </TableCell>
                    <TableCell>{formatDate(form.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/forms/${form.id}/edit`}
                          className="text-sm text-[var(--primary)] hover:underline"
                        >
                          עריכה
                        </Link>
                        <Link
                          href={`/form/${form.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[var(--muted-foreground)] hover:underline"
                        >
                          צפייה
                        </Link>
                        <Link
                          href={`/dashboard/submissions?form=${form.id}`}
                          className="text-sm text-[var(--muted-foreground)] hover:underline"
                        >
                          שליחות
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
