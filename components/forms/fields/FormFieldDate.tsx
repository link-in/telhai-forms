"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DateFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: DateFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldDate<T extends FieldValues>({ config, control, name }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={config.name}>{config.label}</Label>
          <Input
            id={config.name}
            type="date"
            {...field}
            value={field.value ?? ""}
          />
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
