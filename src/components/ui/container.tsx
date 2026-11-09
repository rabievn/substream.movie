import clsx from "clsx";
import type { HTMLAttributes } from "react";
import styles from "./container.module.scss";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(styles.root, className)} {...props} />;
}
