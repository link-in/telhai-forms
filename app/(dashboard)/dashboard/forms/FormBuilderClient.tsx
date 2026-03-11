"use client";

import { FormBuilder } from "@/components/forms/FormBuilder";
import type { FieldConfig, FormSchema } from "@/types/form";

type Props = {
  mode: "new" | "edit";
  formId?: string;
  initialName: string;
  initialSlug: string;
  initialFields: FieldConfig[];
  initialSuccessMessage?: string;
  saveFormAction: (
    mode: "new" | "edit",
    formId: string | null,
    name: string,
    slug: string,
    schema: FormSchema
  ) => Promise<void>;
};

export function FormBuilderClient(props: Props) {
  return <FormBuilder {...props} />;
}
