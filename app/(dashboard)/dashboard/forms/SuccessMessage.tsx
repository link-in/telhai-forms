"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export function SuccessMessage() {
  // קורא ישירות מה-URL של הדפדפן — עוקף בעיות hydration של Next.js
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("success");
    if (!param) return;

    setMessage(param);

    // מנקה את ה-URL כדי שרענון לא יציג שוב
    const url = new URL(window.location.href);
    url.searchParams.delete("success");
    window.history.replaceState({}, "", url.toString());

    // הסרה אוטומטית אחרי 6 שניות
    const timer = setTimeout(() => setMessage(null), 6000);
    return () => clearTimeout(timer);
  }, []); // רץ פעם אחת עם mount

  if (!message) return null;

  const text =
    message === "created"
      ? "הטופס נוצר ונשמר בהצלחה."
      : message === "updated"
        ? "הטופס עודכן ונשמר בהצלחה."
        : "הטופס נשמר בהצלחה.";

  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-[var(--telhai-primary)]/40 bg-[var(--telhai-primary)]/10 px-4 py-3 text-[var(--telhai-primary)]"
    >
      <CheckCircle size={18} className="shrink-0" />
      <span className="flex-1 font-medium">{text}</span>
      <button
        type="button"
        onClick={() => setMessage(null)}
        className="shrink-0 rounded p-1 hover:bg-[var(--telhai-primary)]/10"
        aria-label="סגור"
      >
        <X size={16} />
      </button>
    </div>
  );
}
