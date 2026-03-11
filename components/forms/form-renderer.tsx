"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  shouldShowField,
  getVisibleFieldNames,
  buildFormSchema,
} from "@/lib/validations/form-schema";
import { createDynamicFormResolver } from "@/lib/validations/dynamic-resolver";
import type { FormSchema as FormSchemaType, FieldConfig } from "@/types/form";
import type { Control } from "react-hook-form";
import { FormFieldText } from "./fields/FormFieldText";
import { FormFieldNumber } from "./fields/FormFieldNumber";
import { FormFieldSelect } from "./fields/FormFieldSelect";
import { FormFieldRadio } from "./fields/FormFieldRadio";
import { FormFieldMultiselect } from "./fields/FormFieldMultiselect";
import { FormFieldCheckbox } from "./fields/FormFieldCheckbox";
import { FormFieldDate } from "./fields/FormFieldDate";
import { FormFieldFile } from "./fields/FormFieldFile";
import { FormFieldRating } from "./fields/FormFieldRating";

type FormRendererProps = {
  formSchema: FormSchemaType;
  formName: string;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting?: boolean;
};

function getDefaultValues(schema: FormSchemaType): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const field of schema.fields) {
    if (field.type === "checkbox") {
      defaults[field.name] = false;
    } else if (field.type === "multiselect") {
      defaults[field.name] = [];
    } else {
      defaults[field.name] = "";
    }
  }
  return defaults;
}

function FieldSwitch({
  field,
  control,
  visible,
}: {
  field: FieldConfig;
  control: Control<Record<string, unknown>>;
  visible: boolean;
}) {
  if (!visible) return null;

  const name = field.name;

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "textarea":
      return <FormFieldText config={field} control={control} name={name} />;
    case "number":
      return <FormFieldNumber config={field} control={control} name={name} />;
    case "select":
      return <FormFieldSelect config={field} control={control} name={name} />;
    case "radio":
      return <FormFieldRadio config={field} control={control} name={name} />;
    case "multiselect":
      return <FormFieldMultiselect config={field} control={control} name={name} />;
    case "checkbox":
      return <FormFieldCheckbox config={field} control={control} name={name} />;
    case "date":
      return <FormFieldDate config={field} control={control} name={name} />;
    case "file":
      return <FormFieldFile config={field} control={control} name={name} />;
    case "rating":
      return <FormFieldRating config={field} control={control} name={name} />;
    default: {
      const _: never = field;
      return null;
    }
  }
}

export function FormRenderer({
  formSchema,
  formName,
  onSubmit,
  isSubmitting = false,
}: FormRendererProps) {
  const defaultValues = getDefaultValues(formSchema);
  const form = useForm<Record<string, unknown>>({
    defaultValues,
    resolver: createDynamicFormResolver(formSchema),
  });

  const watchValues = form.watch();

  const handleSubmit = form.handleSubmit(async (data) => {
    const visibleNames = getVisibleFieldNames(formSchema, watchValues);
    const schema = buildFormSchema(formSchema, visibleNames);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (path) form.setError(path as keyof Record<string, unknown>, { message: issue.message });
      }
      return;
    }
    const toSend: Record<string, unknown> = {};
    for (const key of visibleNames) {
      if (key in parsed.data && parsed.data[key] !== undefined && parsed.data[key] !== "") {
        toSend[key] = parsed.data[key];
      }
    }
    await onSubmit(toSend);
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{formName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formSchema.fields.map((field) => (
            <FieldSwitch
              key={field.name}
              field={field}
              control={form.control as Control<Record<string, unknown>>}
              visible={shouldShowField(field, watchValues)}
            />
          ))}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "שולח..." : "שליחה"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
