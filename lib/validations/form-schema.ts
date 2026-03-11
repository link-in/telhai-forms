import { z } from "zod";
import type { FieldConfig, FormSchema, ShowWhenCondition } from "@/types/form";

/**
 * Returns whether a field should be visible based on showWhen and current form values.
 */
export function shouldShowField(
  fieldConfig: FieldConfig,
  watchValues: Record<string, unknown>
): boolean {
  if (fieldConfig.type === "divider") return true;
  const condition = (fieldConfig as { showWhen?: { field: string; value?: string | number | boolean; oneOf?: (string | number | boolean)[] } }).showWhen;
  if (!condition) return true;
  const watchedValue = watchValues[condition.field];

  if (condition.value !== undefined) {
    return watchedValue === condition.value;
  }
  if (condition.oneOf && Array.isArray(condition.oneOf)) {
    return condition.oneOf.includes(watchedValue as string | number | boolean);
  }
  return false;
}

/**
 * Build a Zod schema dynamically from form schema.
 * Only visible fields are validated as required when required is true.
 */
export function buildFormSchema(
  formSchema: FormSchema,
  visibleFieldNames: string[]
): z.ZodType<Record<string, unknown>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of formSchema.fields) {
    if (field.type === "divider") continue;
    const isVisible = visibleFieldNames.includes(field.name);
    const isRequired = Boolean((field as { required?: boolean }).required) && isVisible;

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        shape[field.name] = isRequired
          ? z.string().min(1, "שדה חובה")
          : z.string().optional().or(z.literal(""));
        break;
      case "textarea":
        shape[field.name] = isRequired
          ? z.string().min(1, "שדה חובה")
          : z.string().optional().or(z.literal(""));
        break;
      case "number":
        shape[field.name] = isRequired
          ? z.union([z.number(), z.string()]).refine((v) => v !== "" && !Number.isNaN(Number(v)), "יש להזין מספר")
          : z.union([z.number(), z.string()]).optional();
        break;
      case "select":
      case "radio":
        shape[field.name] = isRequired
          ? z.union([z.string(), z.number(), z.boolean()]).refine((v) => v !== "" && v !== undefined && v !== null, "שדה חובה")
          : z.union([z.string(), z.number(), z.boolean()]).optional();
        break;
      case "multiselect":
        shape[field.name] = isRequired
          ? z.array(z.union([z.string(), z.number(), z.boolean()])).min(1, "יש לבחור לפחות אפשרות אחת")
          : z.array(z.union([z.string(), z.number(), z.boolean()])).optional();
        break;
      case "checkbox":
        shape[field.name] = z.boolean().optional();
        break;
      case "date":
        shape[field.name] = isRequired
          ? z.string().min(1, "שדה חובה")
          : z.string().optional().or(z.literal(""));
        break;
      case "file":
        shape[field.name] = isRequired
          ? z.union([z.string().url(), z.instanceof(File)]).refine((v) => v !== undefined && v !== null && (typeof v === "string" || (v instanceof File && v.size > 0)), "יש להעלות קובץ")
          : z.union([z.string().url(), z.instanceof(File)]).optional();
        break;
      case "rating":
        shape[field.name] = isRequired
          ? z.number().min(1, "שדה חובה")
          : z.number().optional();
        break;
      default: {
        const f = field as FieldConfig;
        shape[f.name] = z.unknown().optional();
      }
    }
  }

  return z.object(shape) as z.ZodType<Record<string, unknown>>;
}

/**
 * Get visible field names from schema and current values (for building schema).
 */
export function getVisibleFieldNames(
  formSchema: FormSchema,
  watchValues: Record<string, unknown>
): string[] {
  return formSchema.fields
    .filter((f) => f.type !== "divider" && shouldShowField(f, watchValues))
    .map((f) => f.name);
}
