"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckboxFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: CheckboxFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldCheckbox<T extends FieldValues>({ config, control, name }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field }) => (
        <div className="flex items-center gap-2 space-y-0">
          <Checkbox
            id={config.name}
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={config.name} className="cursor-pointer font-normal">
            {config.label}
          </Label>
        </div>
      )}
    />
  );
}
