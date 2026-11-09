import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render the child element (e.g. a Next.js <Link>) with button styles. */
  asChild?: boolean;
  isFullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  isFullWidth = false,
  className,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={clsx(
        styles.root,
        styles[variant],
        styles[size],
        isFullWidth && styles.isFullWidth,
        className,
      )}
      type={asChild ? undefined : (type ?? "button")}
      {...props}
    />
  );
}
