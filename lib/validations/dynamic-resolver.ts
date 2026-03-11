import type { Resolver } from "react-hook-form";
import type { FormSchema } from "@/types/form";
import { buildFormSchema, getVisibleFieldNames } from "./form-schema";

/**
 * Creates a resolver that builds Zod schema from current form values (for conditional visibility).
 */
export function createDynamicFormResolver(formSchema: FormSchema): Resolver<Record<string, unknown>> {
  return (values) => {
    const visibleNames = getVisibleFieldNames(formSchema, values as Record<string, unknown>);
    const schema = buildFormSchema(formSchema, visibleNames);
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = { type: issue.code, message: issue.message };
      }
    }
    return { values: {}, errors };
  };
}
