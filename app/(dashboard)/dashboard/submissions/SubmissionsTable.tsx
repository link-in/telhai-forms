"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Download,
} from "lucide-react";

export type SubmissionRow = {
  id: string;
  form_id: string;
  form_name: string;
  data: Record<string, unknown>;
  created_at: string;
};

type SortDir = "asc" | "desc";
type SortKey = "form_name" | "created_at" | "preview";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" });
}

function previewData(data: Record<string, unknown>): string {
  const entries = Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (!entries.length) return "—";
  const [, val] = entries[0];
  const str = Array.isArray(val) ? val.join(", ") : String(val);
  return str.length > 50 ? str.slice(0, 50) + "…" : str;
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined || val === "") return "—";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

type Props = {
  rows: SubmissionRow[];
  showFormColumn: boolean;
  forms: { id: string; name: string }[];
};

export function SubmissionsTable({ rows, showFormColumn, forms }: Props) {
  const [search, setSearch]         = useState("");
  const [formFilter, setFormFilter] = useState("all");
  const [sortKey, setSortKey]       = useState<SortKey>("created_at");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [expanded, setExpanded]     = useState<string | null>(null);

  const exportToExcel = (exportRows: SubmissionRow[]) => {
    if (!exportRows.length) return;

    // איסוף כל מפתחות השדות האפשריים מכל הפניות
    const allKeys = Array.from(
      new Set(exportRows.flatMap(r => Object.keys(r.data)))
    );

    const sheetData = exportRows.map(row => {
      const base: Record<string, unknown> = {};
      if (showFormColumn) base["טופס"] = row.form_name;
      base["תאריך"] = formatDate(row.created_at);
      for (const key of allKeys) {
        const val = row.data[key];
        base[key] = val === undefined || val === null ? "" : formatValue(val);
      }
      return base;
    });

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "פניות");

    const date = new Date().toLocaleDateString("he-IL").replace(/\//g, "-");
    XLSX.writeFile(wb, `פניות-${date}.xlsx`);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const toggleExpand = (id: string) =>
    setExpanded(prev => (prev === id ? null : id));

  const filtered = useMemo(() => {
    let r = rows;
    if (formFilter !== "all") r = r.filter(s => s.form_id === formFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(s =>
        s.form_name.toLowerCase().includes(q) ||
        Object.values(s.data).some(v => String(v ?? "").toLowerCase().includes(q))
      );
    }
    return [...r].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "created_at") cmp = a.created_at.localeCompare(b.created_at);
      else if (sortKey === "form_name") cmp = a.form_name.localeCompare(b.form_name, "he");
      else cmp = previewData(a.data).localeCompare(previewData(b.data), "he");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, search, formFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ArrowUpDown size={13} className="opacity-40" /> :
    sortDir === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;

  const thCls = "px-4 py-3 text-right text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide select-none";
  const thBtn = `${thCls} cursor-pointer hover:text-[var(--foreground)] transition-colors`;
  const colSpan = showFormColumn ? 4 : 3;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="חיפוש בפניות..."
            className="w-full h-8 rounded-lg border border-[var(--border)] bg-white ps-3 pe-9 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
        </div>

        {showFormColumn && forms.length > 1 && (
          <select
            value={formFilter}
            onChange={e => { setFormFilter(e.target.value); setPage(1); }}
            className="h-8 rounded-lg border border-[var(--border)] bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          >
            <option value="all">כל הטפסים</option>
            {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        )}

        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] me-auto">
          <span>הצג</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="h-8 rounded-lg border border-[var(--border)] bg-white px-2 text-sm focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <span>שורות</span>
        </div>

        <span className="text-sm text-[var(--muted-foreground)]">{filtered.length} תוצאות</span>
      </div>

      {/* טבלה */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
            <tr>
              {showFormColumn && (
                <th className={thBtn} onClick={() => toggleSort("form_name")}>
                  <span className="flex items-center gap-1 justify-end">
                    טופס <SortIcon k="form_name" />
                  </span>
                </th>
              )}
              <th className={thBtn} onClick={() => toggleSort("created_at")}>
                <span className="flex items-center gap-1 justify-end">
                  תאריך <SortIcon k="created_at" />
                </span>
              </th>
              <th className={thBtn} onClick={() => toggleSort("preview")}>
                <span className="flex items-center gap-1 justify-end">
                  תצוגה מקדימה <SortIcon k="preview" />
                </span>
              </th>
              <th className={thCls}>פרטים</th>
            </tr>
          </thead>
          <tbody>
            {!paginated.length ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-[var(--muted-foreground)]">
                  לא נמצאו פניות
                </td>
              </tr>
            ) : paginated.map((row, i) => {
              const isOpen = expanded === row.id;
              const dataEntries = Object.entries(row.data).filter(([, v]) => v !== null && v !== undefined && v !== "");

              return (
                <>
                  {/* שורת סיכום */}
                  <tr
                    key={row.id}
                    onClick={() => toggleExpand(row.id)}
                    className={`border-b border-[var(--border)] cursor-pointer transition-colors
                      ${isOpen
                        ? "bg-[var(--secondary)] border-b-0"
                        : i % 2 === 0
                          ? "hover:bg-[var(--secondary)]/40"
                          : "bg-[var(--muted)]/30 hover:bg-[var(--secondary)]/40"
                      }`}
                  >
                    {showFormColumn && (
                      <td className="px-4 py-3 font-medium">{row.form_name}</td>
                    )}
                    <td className="px-4 py-3 text-[var(--muted-foreground)] whitespace-nowrap">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)] max-w-xs">
                      <span className="truncate block">{previewData(row.data)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={e => { e.stopPropagation(); toggleExpand(row.id); }}
                        className="inline-flex items-center gap-1 rounded-md bg-[var(--secondary)] px-2.5 py-1 text-xs font-medium text-[var(--telhai-blue)] hover:bg-[var(--secondary)]/70 transition-colors"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {isOpen ? "סגור" : "פרטים"}
                      </button>
                    </td>
                  </tr>

                  {/* שורת פירוט – אקורדיון */}
                  {isOpen && (
                    <tr key={`${row.id}-detail`} className="border-b border-[var(--border)]">
                      <td colSpan={colSpan} className="px-0 py-0">
                        <div className="bg-[var(--secondary)]/50 border-t border-[var(--border)] px-6 py-4">
                          {/* כותרת */}
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {showFormColumn ? `${row.form_name} · ` : ""}{formatDate(row.created_at)}
                            </p>
                            <span className="text-xs font-mono text-[var(--muted-foreground)] opacity-60">
                              #{row.id.slice(0, 8)}
                            </span>
                          </div>

                          {/* נתוני הפנייה */}
                          {dataEntries.length === 0 ? (
                            <p className="text-sm text-[var(--muted-foreground)]">אין נתונים בפנייה זו.</p>
                          ) : (
                            <ul className="flex flex-wrap gap-x-6 gap-y-1">
                              {dataEntries.map(([key, val]) => (
                                <li key={key} className="text-sm text-[var(--foreground)] break-words">
                                  {formatValue(val)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">
            עמוד {page} מתוך {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center justify-center h-7 w-7 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const n = page <= 3 ? i + 1 : page + i - 2;
              if (n < 1 || n > totalPages) return null;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-7 min-w-7 px-2 rounded-md border text-xs font-medium transition-colors ${
                    n === page
                      ? "bg-[var(--telhai-blue)] text-white border-[var(--telhai-blue)]"
                      : "border-[var(--border)] hover:bg-[var(--secondary)]"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center h-7 w-7 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ייצוא */}
      <div className="flex justify-end">
        <button
          onClick={() => exportToExcel(filtered)}
          disabled={!filtered.length}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--telhai-blue)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Download size={12} />
          ייצוא לאקסל
        </button>
      </div>
    </div>
  );
}
