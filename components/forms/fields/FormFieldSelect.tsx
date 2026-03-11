"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Select, type SelectOption } from "@/components/ui/select";
import type { SelectLikeFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: SelectLikeFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldSelect<T extends FieldValues>({ config, control, name }: Props<T>) {
  const options: SelectOption[] = config.options.map((o) => ({
    value: o.value,
    label: o.label,
  }));

  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={config.name}>{config.label}</Label>
          <Select
            id={config.name}
            options={options}
            placeholder={config.placeholder ?? "בחר..."}
            value={field.value}
            onValueChange={field.onChange}
          />
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
