import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "./badge.module.scss";

export type BadgeVariant = "neutral" | "accent" | "secondary" | "levelA" | "levelB" | "levelC";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span className={clsx(styles.root, styles[variant], className)} {...props} />;
}
