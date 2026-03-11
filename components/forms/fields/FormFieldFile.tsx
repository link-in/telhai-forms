"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FileFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: FileFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldFile<T extends FieldValues>({ config, control, name }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field: { onChange, value, ...field }, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={config.name}>{config.label}</Label>
          <Input
            id={config.name}
            type="file"
            accept={config.accept}
            {...field}
            onChange={(e) => onChange(e.target.files?.[0])}
          />
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
