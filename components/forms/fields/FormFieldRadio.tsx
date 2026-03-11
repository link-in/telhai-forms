"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { SelectLikeFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: SelectLikeFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

export function FormFieldRadio<T extends FieldValues>({ config, control, name }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{config.label}</Label>
          <div className="flex flex-col gap-2 pt-1">
            {config.options.map((opt) => (
              <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={config.name}
                  value={String(opt.value)}
                  checked={field.value === opt.value}
                  onChange={() => field.onChange(opt.value)}
                  className="h-4 w-4 rounded-full border-[var(--input)] focus:ring-2 focus:ring-[var(--ring)]"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {fieldState.error && (
            <p className="text-sm text-[var(--destructive)]">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
