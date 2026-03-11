import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">מערכת טפסים דינמית</h1>
      <p className="text-[var(--muted-foreground)] text-center max-w-md">
        טפסים עם שדות בתנאי ולוח בקרה להצגת הנתונים – המכללה האקדמית תל־חי.
      </p>
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-md bg-[var(--telhai-blue)] text-white px-4 py-2 font-medium hover:opacity-90"
        >
          דשבורד
        </Link>
        <Link
          href="/form/sample-form"
          className="rounded-md border border-[var(--border)] px-4 py-2 font-medium hover:bg-[var(--accent)]"
        >
          טופס דוגמה
        </Link>
      </div>
    </main>
  );
}
