"use client";

import * as React from "react";

export interface SelectOption {
  value: string | number | boolean;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  options: SelectOption[];
  placeholder?: string;
  value?: string | number | boolean;
  onValueChange?: (value: string | number | boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      options,
      placeholder,
      value,
      onValueChange,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      const opt = options.find((o) => String(o.value) === v);
      const out = opt ? opt.value : v;
      onValueChange?.(out);
      onChange?.(e);
    };

    const displayValue = value !== undefined && value !== null ? String(value) : "";

    return (
      <select
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        className={`flex h-10 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
