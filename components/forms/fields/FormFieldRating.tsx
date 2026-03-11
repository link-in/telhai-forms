"use client";

import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { RatingFieldConfig } from "@/types/form";

type Props<T extends FieldValues> = {
  config: RatingFieldConfig;
  control: Control<T>;
  name: FieldPath<T>;
};

const maxRating = 5;

export function FormFieldRating<T extends FieldValues>({ config, control, name }: Props<T>) {
  const limit = config.max ?? maxRating;

  return (
    <Controller
      control={control}
      name={name as FieldPath<T>}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label>{config.label}</Label>
          <div className="flex gap-1">
            {Array.from({ length: limit }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => field.onChange(star)}
                className="text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-[var(--ring)] rounded"
              >
                {Number(field.value) >= star ? "★" : "☆"}
              </button>
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
