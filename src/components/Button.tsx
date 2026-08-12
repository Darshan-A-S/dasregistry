import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "muted";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={`das-btn das-btn-${variant} ${className ?? ""}`.trim()} {...props} />;
}
