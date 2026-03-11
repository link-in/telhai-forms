"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TextFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: TextFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldText<T extends FieldValues>({ config, control, name }: Props<T>) {
  const isTextarea = config.type === "textarea";
  const inputType =
    config.type === "email" ? "email" :
    config.type === "phone" ? "tel" :
    "text";

  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label htmlFor={config.name}>{config.label}</Label>
          {isTextarea ? (
            <Textarea
              id={config.name}
              placeholder={config.placeholder}
              {...field}
              value={field.value ?? ""}
            />
          ) : (
            <Input
              id={config.name}
              type={inputType}
              placeholder={config.placeholder}
              {...field}
              value={field.value ?? ""}
            />
          )}
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
