"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./dialog.module.scss";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

export interface DialogContentProps {
  title: string;
  description?: string;
  /** Visually hide the title (it stays available to screen readers). */
  isTitleHidden?: boolean;
  closeLabel: string;
  placement?: "center" | "start" | "end";
  className?: string;
  children: ReactNode;
}

export function DialogContent({
  title,
  description,
  isTitleHidden = false,
  closeLabel,
  placement = "center",
  className,
  children,
}: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content
        className={clsx(styles.content, styles[placement], className)}
        {...(description ? {} : { "aria-describedby": undefined })}
      >
        <header className={styles.header}>
          <RadixDialog.Title className={clsx(styles.title, isTitleHidden && styles.isHidden)}>
            {title}
          </RadixDialog.Title>
          <RadixDialog.Close className={styles.close} aria-label={closeLabel}>
            <X aria-hidden="true" />
          </RadixDialog.Close>
        </header>
        {description ? (
          <RadixDialog.Description className={styles.description}>
            {description}
          </RadixDialog.Description>
        ) : null}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
