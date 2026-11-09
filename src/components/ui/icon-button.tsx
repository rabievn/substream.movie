import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import styles from "./icon-button.module.scss";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons need an accessible name. */
  "aria-label": string;
  size?: "sm" | "md";
}

export function IconButton({ size = "md", className, type = "button", ...props }: IconButtonProps) {
  return <button className={clsx(styles.root, styles[size], className)} type={type} {...props} />;
}
