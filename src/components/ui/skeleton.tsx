import clsx from "clsx";
import type { CSSProperties } from "react";
import styles from "./skeleton.module.scss";

export interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export function Skeleton({ width = "100%", height = 16, radius = "md", className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(styles.root, styles[radius], className)}
      style={{ width, height }}
    />
  );
}
