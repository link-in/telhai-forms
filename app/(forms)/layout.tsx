import { Header } from "@/components/layout/Header";

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <div className="bg-[var(--telhai-footer-bg)] py-4 text-center text-sm text-[var(--telhai-footer-text)]/60">
        © {new Date().getFullYear()} המכללה האקדמית תל־חי. כל הזכויות שמורות.
      </div>
    </div>
  );
}
