import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--telhai-bg-muted)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col" style={{ background: "#2d5a0e" }}>
        {/* לוגו - רקע לבן */}
        <div className="bg-white px-4 py-3 flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo-green.webp" alt="מכללת תל חי" className="h-10 w-auto" />
          </Link>
        </div>

        {/* ניווט */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "#a8d87a" }}>
            ניהול
          </p>
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            דשבורד
          </Link>
          <Link
            href="/dashboard/forms"
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            טפסים
          </Link>
          <Link
            href="/dashboard/submissions"
            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            פניות שהתקבלו
          </Link>
        </nav>

        {/* קישור לאתר */}
        <div className="border-t border-white/10 p-3">
          <a
            href="https://www.telhai.ac.il"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md px-3 py-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            ← אתר המכללה
          </a>
        </div>
      </aside>

      {/* תוכן ראשי */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
