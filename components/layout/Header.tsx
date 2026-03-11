import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md flex h-16"
      style={{ background: "linear-gradient(to left, #2d5a0e 0%, #4a8a1e 40%, #8DC63F 100%)" }}
    >
      {/* לוגו - רקע לבן עדין (semi-transparent) */}
      <div className="px-6 flex items-center shrink-0">
        <Link href="/" className="flex items-center bg-white/90 rounded-md px-3 py-1">
          <img
            src="/logo-green.webp"
            alt="מכללת תל חי"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* ניווט */}
      <nav className="flex-1 flex items-center justify-end px-4">
        <Link
          href="/form/sample-form"
          className="px-4 h-full flex items-center text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
        >
          טופס דוגמה
        </Link>
        <Link
          href="/dashboard"
          className="px-4 h-full flex items-center text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
        >
          דשבורד
        </Link>
      </nav>
    </header>
  );
}
