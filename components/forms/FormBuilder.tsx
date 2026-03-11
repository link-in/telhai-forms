"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Type, Mail, Phone, Hash, AlignLeft,
  ChevronDown, List, CircleDot, SquareCheck,
  Calendar, Paperclip, Star,
  Search, CheckSquare, Pencil, SeparatorHorizontal, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { FieldConfig, FieldType, FormSchema } from "@/types/form";

/* ─────────────────────────────────────────
   סוגי שדות עם קטגוריות ואייקונים
───────────────────────────────────────── */
type FieldTypeDef = {
  value: FieldType;
  label: string;
  icon: React.ReactNode;
  category: "common" | "text" | "choice" | "advanced" | "layout";
};

const FIELD_DEFS: FieldTypeDef[] = [
  { value: "text",        label: "טקסט קצר",         icon: <Type size={18} />,         category: "common"   },
  { value: "email",       label: "דוא״ל",             icon: <Mail size={18} />,         category: "common"   },
  { value: "phone",       label: "טלפון",             icon: <Phone size={18} />,        category: "common"   },
  { value: "select",      label: "תפריט בחירה",       icon: <ChevronDown size={18} />,  category: "common"   },
  { value: "textarea",    label: "טקסט ארוך",         icon: <AlignLeft size={18} />,    category: "text"     },
  { value: "number",      label: "מספר",              icon: <Hash size={18} />,         category: "text"     },
  { value: "radio",       label: "בחירה יחידה",       icon: <CircleDot size={18} />,    category: "choice"   },
  { value: "multiselect", label: "בחירה מרובה",       icon: <List size={18} />,         category: "choice"   },
  { value: "checkbox",    label: "תיבת סימון",        icon: <CheckSquare size={18} />,  category: "choice"   },
  { value: "date",        label: "תאריך",             icon: <Calendar size={18} />,              category: "advanced" },
  { value: "file",        label: "העלאת קובץ",        icon: <Paperclip size={18} />,             category: "advanced" },
  { value: "rating",      label: "דירוג",             icon: <Star size={18} />,                  category: "advanced" },
  { value: "divider",     label: "מפריד שורה",        icon: <SeparatorHorizontal size={18} />,   category: "layout"   },
];

const CATEGORIES = [
  { key: "common",   label: "נפוצים"     },
  { key: "text",     label: "טקסט"       },
  { key: "choice",   label: "בחירה"      },
  { key: "advanced", label: "מתקדם"      },
  { key: "layout",   label: "פריסה"      },
] as const;

/* ─────────────────────────────────────────
   טיפוס שדה בבונה
───────────────────────────────────────── */
type FieldColSpan = "full" | "half" | "third";

type BuilderField = {
  tempId: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options: { value: string; label: string }[];
  showWhenField?: string;
  showWhenValue?: string;
  showWhenOneOf?: string;
  min?: number;
  max?: number;
  colSpan?: FieldColSpan;
  conditionOpen?: boolean;
  expanded?: boolean;
};

/* ─────────────────────────────────────────
   פונקציות עזר
───────────────────────────────────────── */
function generateRandomFieldName(existing: string[]): string {
  const normalized = new Set(existing.map((n) => n.trim().replace(/\s+/g, "_")).filter(Boolean));
  let name: string;
  do { name = `field_${Math.random().toString(36).slice(2, 8)}`; }
  while (normalized.has(name));
  return name;
}

function fieldConfigToBuilder(f: FieldConfig, tempId: string): BuilderField {
  if (f.type === "divider") {
    return { tempId, type: "divider", name: f.name, label: "", required: false, options: [], colSpan: "full", expanded: false };
  }
  const options =
    "options" in f && Array.isArray(f.options)
      ? f.options.map((o) => ({ value: String(o.value), label: String(o.label) }))
      : [];
  const showWhen = (f as { showWhen?: { field: string; value?: string | number | boolean; oneOf?: (string | number | boolean)[] } }).showWhen;
  return {
    tempId,
    type: f.type,
    name: f.name,
    label: (f as { label?: string }).label ?? "",
    placeholder: (f as { placeholder?: string }).placeholder,
    required: Boolean((f as { required?: boolean }).required),
    options,
    showWhenField: showWhen?.field,
    showWhenValue: showWhen?.value !== undefined ? String(showWhen.value) : undefined,
    showWhenOneOf: showWhen?.oneOf?.length ? showWhen.oneOf.map(String).join(", ") : undefined,
    min: "min" in f ? (f as { min?: number }).min : undefined,
    max: "max" in f ? (f as { max?: number }).max : undefined,
    colSpan: ((f as { layout?: { colSpan?: FieldColSpan } }).layout?.colSpan ?? "full") as FieldColSpan,
    conditionOpen: Boolean(showWhen?.field),
    expanded: false,
  };
}

function builderToFieldConfig(b: BuilderField, allFieldNames: string[]): FieldConfig | null {
  if (b.type === "divider") {
    const name = b.name.trim() || `divider_${b.tempId.slice(-6)}`;
    return { name, type: "divider" };
  }
  const name = b.name.trim().replace(/\s+/g, "_");
  if (!name || !b.label.trim()) return null;
  const layout = b.colSpan && b.colSpan !== "full" ? { colSpan: b.colSpan } : undefined;
  const base = { name, type: b.type, label: b.label.trim(), placeholder: b.placeholder?.trim() || undefined, required: b.required, layout };
  let showWhen: { field: string; value?: string; oneOf?: string[] } | undefined;
  if (b.showWhenField && allFieldNames.includes(b.showWhenField)) {
    if (b.showWhenOneOf?.trim()) {
      showWhen = { field: b.showWhenField, oneOf: b.showWhenOneOf.split(",").map((s) => s.trim()).filter(Boolean) };
    } else if (b.showWhenValue !== undefined && b.showWhenValue !== "") {
      showWhen = { field: b.showWhenField, value: b.showWhenValue.trim() };
    }
  }
  const withShow = { ...base, showWhen };
  switch (b.type) {
    case "text": case "email": case "phone": case "textarea":
      return { ...withShow, type: b.type };
    case "number":
      return { ...withShow, type: "number", min: b.min, max: b.max };
    case "select": case "radio": case "multiselect": {
      const options = b.options.filter((o) => o.value.trim() || o.label.trim()).map((o) => ({
        value: o.value.trim() || o.label.trim(),
        label: o.label.trim() || o.value.trim(),
      }));
      if (!options.length) return null;
      return { ...withShow, type: b.type, options };
    }
    case "checkbox": return { ...withShow, type: "checkbox" };
    case "date":     return { ...withShow, type: "date" };
    case "file":     return { ...withShow, type: "file" };
    case "rating":   return { ...withShow, type: "rating", max: b.max ?? 5 };
    default:         return { ...withShow, type: "text" };
  }
}

const hasOptions = (t: FieldType) => t === "select" || t === "radio" || t === "multiselect";

const emptyField = (tempId: string, type: FieldType, defaultName: string): BuilderField => ({
  tempId, type, name: defaultName, label: "", required: false,
  options: hasOptions(type) ? [{ value: "", label: "" }] : [],
  expanded: true,
});

/* ─────────────────────────────────────────
   רכיב: כרטיס שדה בתפריט הצד
───────────────────────────────────────── */
function FieldTypeCard({ def, onClick }: { def: FieldTypeDef; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-center text-xs font-medium hover:border-[var(--primary)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors w-full"
    >
      <span className="text-[var(--muted-foreground)]">{def.icon}</span>
      <span className="leading-tight">{def.label}</span>
    </button>
  );
}

/* ─────────────────────────────────────────
   רכיב: תפריט צד לסוגי שדות
───────────────────────────────────────── */
function FieldTypeSidebar({ onAdd }: { onAdd: (type: FieldType) => void }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? FIELD_DEFS.filter((d) => d.label.includes(search.trim()))
    : null;

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-3">
      {/* חיפוש */}
      <div className="relative shrink-0">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--muted-foreground)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפש שדה..."
          className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] py-2 pe-8 ps-3 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-4 pb-4">
        {filtered ? (
          /* תוצאות חיפוש */
          filtered.length ? (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((def) => (
                <FieldTypeCard key={def.value} def={def} onClick={() => onAdd(def.value)} />
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-[var(--muted-foreground)] pt-4">לא נמצאו שדות</p>
          )
        ) : (
          /* לפי קטגוריות */
          CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <p className="mb-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                {cat.label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FIELD_DEFS.filter((d) => d.category === cat.key).map((def) => (
                  <FieldTypeCard key={def.value} def={def} onClick={() => onAdd(def.value)} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   פרופס ראשי
───────────────────────────────────────── */
type FormBuilderProps = {
  mode: "new" | "edit";
  formId?: string;
  initialName: string;
  initialSlug: string;
  initialFields: FieldConfig[];
  initialSuccessMessage?: string;
  saveFormAction: (mode: "new" | "edit", formId: string | null, name: string, slug: string, schema: FormSchema) => Promise<void>;
};

/* ─────────────────────────────────────────
   מפתח שדה – נסתר עד ללחיצה
───────────────────────────────────────── */
function FieldKeyEditor({
  tempId, value, onChange,
}: { tempId: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="flex items-center gap-2 min-h-[28px]">
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            ref={inputRef}
            id={`key-${tempId}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            placeholder="מפתח_שדה"
            className="h-7 text-xs font-mono"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <Pencil size={11} />
          <span>מפתח שדה</span>
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   רכיב ראשי: FormBuilder
───────────────────────────────────────── */
export function FormBuilder({ mode, formId, initialName, initialSlug, initialFields, initialSuccessMessage, saveFormAction }: FormBuilderProps) {
  const router = useRouter();
  const [name, setName]   = useState(initialName);
  const [slug, setSlug]   = useState(initialSlug);
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage ?? "");
  const [fields, setFields] = useState<BuilderField[]>(() =>
    initialFields.length > 0
      ? initialFields.map((f, i) => fieldConfigToBuilder(f, `f-${i}`))
      : []
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  /* ── הוספת שדה מהסיידבר ── */
  const addFieldOfType = (type: FieldType) => {
    const existing = fields.map((f) => f.name.trim().replace(/\s+/g, "_")).filter(Boolean);
    const newId = `f-${Date.now()}`;
    setFields((prev) => [
      ...prev.map((f) => ({ ...f, expanded: false })), // סגור את השאר
      emptyField(newId, type, generateRandomFieldName(existing)),
    ]);
    // גלול לתחתית
    setTimeout(() => {
      document.getElementById(`field-${newId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  const removeField = (tempId: string) => setFields((prev) => prev.filter((f) => f.tempId !== tempId));

  const moveField = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= fields.length) return;
    setFields((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const updateField = (tempId: string, patch: Partial<BuilderField>) =>
    setFields((prev) => prev.map((f) => f.tempId === tempId ? { ...f, ...patch } : f));

  const addOption = (tempId: string) =>
    setFields((prev) => prev.map((f) => f.tempId === tempId ? { ...f, options: [...f.options, { value: "", label: "" }] } : f));

  const updateOption = (tempId: string, oi: number, key: "value" | "label", val: string) =>
    setFields((prev) => prev.map((f) => {
      if (f.tempId !== tempId) return f;
      const opts = [...f.options]; opts[oi] = { ...opts[oi], [key]: val }; return { ...f, options: opts };
    }));

  const removeOption = (tempId: string, oi: number) =>
    setFields((prev) => prev.map((f) => {
      if (f.tempId !== tempId) return f;
      const opts = f.options.filter((_, i) => i !== oi);
      return { ...f, options: opts.length ? opts : [{ value: "", label: "" }] };
    }));

  /* ── שמירה ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nameTrim = name.trim();
    const slugTrim = slug.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
    if (!nameTrim) { setError("יש להזין שם לטופס."); return; }
    if (!slugTrim) { setError("יש להזין כתובת (slug) לטופס."); return; }
    if (!fields.length) { setError("יש להוסיף לפחות שדה אחד."); return; }

    const nonDividers = fields.filter((f) => f.type !== "divider");
    const fieldNames = nonDividers.map((f) => f.name.trim().replace(/\s+/g, "_")).filter(Boolean);
    if (fieldNames.length !== new Set(fieldNames).size) { setError("כל שדה חייב לקבל מפתח ייחודי."); return; }

    const configs: FieldConfig[] = [];
    for (const f of fields) { const c = builderToFieldConfig(f, fieldNames); if (c) configs.push(c); }
    if (!configs.filter((c) => c.type !== "divider").length) { setError("יש להוסיף לפחות שדה אחד עם תווית ומפתח."); return; }

    setSaving(true);
    try {
      await saveFormAction(mode, formId ?? null, nameTrim, slugTrim, {
        fields: configs,
        ...(successMessage.trim() ? { successMessage: successMessage.trim() } : {}),
      });
      router.push(mode === "new" ? "/dashboard/forms?success=created" : "/dashboard/forms?success=updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה בשמירה.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* ── פרטי הטופס ── */}
      <Card>
        <CardHeader><CardTitle>פרטי הטופס</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="form-name">שם הטופס</Label>
              <Input id="form-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="למשל: פנייה ללימודים" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-slug">כתובת הטופס (slug)</Label>
              <Input id="form-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="contact-request" />
              <p className="text-xs text-[var(--muted-foreground)]">הקישור יהיה: /form/{slug || "..."}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="success-message">הודעת הצלחה לאחר שליחה</Label>
            <textarea
              id="success-message"
              value={successMessage}
              onChange={(e) => setSuccessMessage(e.target.value)}
              placeholder="תודה על פנייתך! נחזור אליך בהקדם."
              rows={2}
              className="w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none"
            />
            <p className="text-xs text-[var(--muted-foreground)]">טקסט זה יוצג למשתמש לאחר שישלח את הטופס בהצלחה.</p>
          </div>
        </CardContent>
      </Card>

      {/* ── אזור הבנייה: סיידבר + שדות ── */}
      <div className="flex gap-4 items-start">

        {/* תפריט צד סוגי שדות */}
        <aside className="sticky top-20 flex flex-col w-52 shrink-0 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 max-h-[calc(100vh-8rem)] overflow-hidden">
          <p className="mb-3 shrink-0 text-sm font-semibold">סוגי שדות</p>
          <div className="min-h-0 flex-1 flex flex-col">
            <FieldTypeSidebar onAdd={addFieldOfType} />
          </div>
        </aside>

        {/* רשימת השדות */}
        <div className="flex-1 min-w-0 space-y-2">
          {!fields.length && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] py-16 text-center text-[var(--muted-foreground)]">
              <List size={32} className="mb-3 opacity-40" />
              <p className="font-medium">לחץ על סוג שדה בתפריט הצד כדי להוסיפו לטופס</p>
            </div>
          )}

          {fields.map((field, index) => {
            const def = FIELD_DEFS.find((d) => d.value === field.type);
            const isExpanded = Boolean(field.expanded);

            /* ─── מפריד שורה ─── */
            if (field.type === "divider") {
              return (
                <div key={field.tempId} className="flex items-center gap-2 group">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button type="button" onClick={() => moveField(index, -1)} disabled={index === 0}
                      className="rounded px-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]">▲</button>
                    <button type="button" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}
                      className="rounded px-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]">▼</button>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 border-t-2 border-dashed border-[var(--border)]" />
                    <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 shrink-0">
                      <SeparatorHorizontal size={13} /> מפריד שורה
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-[var(--border)]" />
                  </div>
                  <button type="button" onClick={() => removeField(field.tempId)}
                    className="shrink-0 rounded p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={field.tempId}
                id={`field-${field.tempId}`}
                className="rounded-lg border border-[var(--border)] overflow-hidden shadow-sm"
              >
                {/* ─── שורת כותרת ─── */}
                <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-2.5">
                  {/* חצי סדר */}
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button type="button" onClick={() => moveField(index, -1)} disabled={index === 0}
                      className="rounded px-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]" title="הזז למעלה">▲</button>
                    <button type="button" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}
                      className="rounded px-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-30 text-[10px]" title="הזז למטה">▼</button>
                  </div>

                  {/* לחיצה לפתיחה/סגירה */}
                  <button type="button"
                    className="flex flex-1 items-center gap-2.5 text-right min-w-0"
                    onClick={() => updateField(field.tempId, { expanded: !isExpanded })}
                  >
                    <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-[var(--secondary)] text-[var(--primary)]">
                      {def?.icon}
                    </span>
                    <span className="truncate font-medium text-sm">
                      {field.label || <span className="text-[var(--muted-foreground)] font-normal italic">ללא תווית</span>}
                    </span>
                    <span className="shrink-0 flex items-center gap-1.5 ms-auto">
                      <span className="text-xs text-[var(--muted-foreground)]">{def?.label}</span>
                      {field.required && (
                        <span className="rounded-full bg-[var(--destructive)]/15 px-1.5 py-0.5 text-[10px] text-[var(--destructive)]">חובה</span>
                      )}
                      {field.showWhenField && (
                        <span className="rounded-full bg-[var(--primary)]/15 px-1.5 py-0.5 text-[10px] text-[var(--primary)]">תנאי</span>
                      )}
                      <span className="text-xs text-[var(--muted-foreground)]">{isExpanded ? "▲" : "▼"}</span>
                    </span>
                  </button>

                  {/* מחיקה */}
                  <button type="button" onClick={() => removeField(field.tempId)}
                    className="shrink-0 rounded p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
                    title="מחק שדה">
                    ✕
                  </button>
                </div>

                {/* ─── תוכן מורחב ─── */}
                {isExpanded && (
                  <div className="space-y-4 border-t border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>תווית (מה שהמשתמש רואה)</Label>
                        <Input value={field.label} onChange={(e) => updateField(field.tempId, { label: e.target.value })} placeholder="שם מלא" />
                      </div>
                      <div className="space-y-2">
                        <Label>Placeholder (אופציונלי)</Label>
                        <Input value={field.placeholder ?? ""} onChange={(e) => updateField(field.tempId, { placeholder: e.target.value })} placeholder="הזן את שמך" />
                      </div>
                    </div>

                    {/* שורת הגדרות – חובה + מפתח + רוחב */}
                    <div className="flex items-center justify-between gap-3 flex-wrap rounded-md bg-[var(--muted)] px-3 py-2">
                      <div className="flex items-center gap-2 shrink-0">
                        <Checkbox id={`req-${field.tempId}`} checked={field.required} onCheckedChange={(v) => updateField(field.tempId, { required: Boolean(v) })} />
                        <Label htmlFor={`req-${field.tempId}`} className="font-normal text-xs">שדה חובה</Label>
                      </div>

                      {/* רוחב שדה */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--muted-foreground)]">רוחב:</span>
                        {(["full", "half", "third"] as FieldColSpan[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateField(field.tempId, { colSpan: opt })}
                            className={`px-2 py-0.5 rounded text-xs border transition-colors ${
                              (field.colSpan ?? "full") === opt
                                ? "bg-[var(--telhai-blue)] text-white border-[var(--telhai-blue)]"
                                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--telhai-blue)] hover:text-[var(--telhai-blue)]"
                            }`}
                          >
                            {opt === "full" ? "מלא" : opt === "half" ? "חצי" : "שליש"}
                          </button>
                        ))}
                      </div>

                      <FieldKeyEditor
                        tempId={field.tempId}
                        value={field.name}
                        onChange={(val) => updateField(field.tempId, { name: val })}
                      />
                    </div>

                    {(field.type === "number" || field.type === "rating") && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2"><Label>מינימום</Label>
                          <Input type="number" value={field.min ?? ""} onChange={(e) => updateField(field.tempId, { min: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2"><Label>מקסימום</Label>
                          <Input type="number" value={field.max ?? ""} onChange={(e) => updateField(field.tempId, { max: e.target.value === "" ? undefined : Number(e.target.value) })} />
                        </div>
                      </div>
                    )}

                    {hasOptions(field.type) && (
                      <div className="space-y-2">
                        <Label>אפשרויות (ערך + תווית)</Label>
                        <div className="space-y-2">
                          {field.options.map((opt, oi) => (
                            <div key={oi} className="flex gap-2">
                              <Input placeholder="ערך" value={opt.value} onChange={(e) => updateOption(field.tempId, oi, "value", e.target.value)} className="max-w-[120px]" />
                              <Input placeholder="תווית" value={opt.label} onChange={(e) => updateOption(field.tempId, oi, "label", e.target.value)} className="flex-1" />
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(field.tempId, oi)} disabled={field.options.length === 1}>×</Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => addOption(field.tempId)}>הוסף אפשרות</Button>
                        </div>
                      </div>
                    )}

                    {/* תנאי הצגה */}
                    <div className="rounded-md border border-[var(--border)] overflow-hidden">
                      <button type="button"
                        onClick={() => updateField(field.tempId, { conditionOpen: !field.conditionOpen })}
                        className="flex w-full items-center justify-between bg-[var(--muted)]/40 px-4 py-2.5 text-sm font-medium hover:bg-[var(--muted)]/70 transition-colors">
                        <span className="flex items-center gap-2">
                          תנאי הצגה
                          {field.showWhenField && (
                            <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-[var(--primary-foreground)]">פעיל</span>
                          )}
                        </span>
                        <span className="text-[var(--muted-foreground)]">{field.conditionOpen ? "▲" : "▼"}</span>
                      </button>

                      {field.conditionOpen && (
                        <div className="p-4 space-y-3 bg-[var(--muted)]/20">
                          <p className="text-xs text-[var(--muted-foreground)]">השדה יוצג רק כאשר שדה אחר מקבל ערך מסוים.</p>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1">
                              <Label className="text-xs">תלוי בשדה</Label>
                              <select className="flex h-9 w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-2 text-sm"
                                value={field.showWhenField ?? ""}
                                onChange={(e) => updateField(field.tempId, { showWhenField: e.target.value || undefined })}>
                                <option value="">— ללא תנאי —</option>
                                {fields.filter((f) => f.tempId !== field.tempId && f.name.trim()).map((f) => (
                                  <option key={f.tempId} value={f.name.trim().replace(/\s+/g, "_")}>{f.label || f.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">שווה ל</Label>
                              <Input className="h-9" value={field.showWhenValue ?? ""} onChange={(e) => updateField(field.tempId, { showWhenValue: e.target.value })} placeholder="ערך בודד" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">או אחד מ (פסיק)</Label>
                              <Input className="h-9" value={field.showWhenOneOf ?? ""} onChange={(e) => updateField(field.tempId, { showWhenOneOf: e.target.value })} placeholder="ערך1, ערך2" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-[var(--destructive)] bg-[var(--destructive)]/10 px-4 py-2 text-sm text-[var(--destructive)]">{error}</div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? "שומר..." : "שמירה"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/forms")}>ביטול</Button>
        </div>
        {fields.length > 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">{fields.length} שדות</p>
        )}
      </div>
    </form>
  );
}
