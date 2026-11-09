"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./tabs.module.scss";

export const Tabs = RadixTabs.Root;
export const TabsContent = RadixTabs.Content;

export function TabsList({ className, ...props }: ComponentProps<typeof RadixTabs.List>) {
  return <RadixTabs.List className={clsx(styles.list, className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof RadixTabs.Trigger>) {
  return <RadixTabs.Trigger className={clsx(styles.trigger, className)} {...props} />;
}
