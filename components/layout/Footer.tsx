import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--telhai-footer-bg)] text-[var(--telhai-footer-text)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">המכללה האקדמית תל־חי</p>
            <p className="mt-1 text-sm opacity-80">מערכת טפסים דינמית</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/" className="hover:text-white transition-colors">דף הבית</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">דשבורד</Link>
            <a
              href="https://www.telhai.ac.il"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              אתר המכללה
            </a>
          </nav>
        </div>
        <div className="mt-6 border-t border-white/20 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} המכללה האקדמית תל־חי. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
