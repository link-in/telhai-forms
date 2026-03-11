import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--telhai-blue-light)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40";
    const variants = {
      default: "bg-[var(--telhai-blue-light)] text-white hover:bg-[var(--telhai-blue)] shadow-sm hover:shadow",
      secondary: "bg-[var(--secondary)] text-[var(--telhai-green-dark)] hover:bg-[var(--secondary)]/80 shadow-sm",
      outline: "border border-[var(--border)] bg-white text-[var(--telhai-blue-light)] hover:border-[var(--telhai-blue-light)] hover:bg-[var(--secondary)]",
      ghost: "text-[var(--telhai-blue-light)] hover:bg-[var(--secondary)]",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    };
    const sizes = {
      default: "h-8 px-3 py-1 text-sm",
      sm: "h-7 px-2.5 text-xs",
      lg: "h-10 px-6 text-sm",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
