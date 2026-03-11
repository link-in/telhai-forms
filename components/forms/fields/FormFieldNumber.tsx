"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NumberFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: NumberFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldNumber<T extends FieldValues>({ config, control, name }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={config.name}>{config.label}</Label>
          <Input
            id={config.name}
            type="number"
            min={config.min}
            max={config.max}
            placeholder={config.placeholder}
            {...field}
            value={field.value ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              field.onChange(v === "" ? undefined : Number(v));
            }}
          />
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
