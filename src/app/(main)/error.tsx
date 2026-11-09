"use client";

import { Button, Container } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import styles from "./error.module.scss";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  return (
    <Container className={styles.root} role="alert">
      <h1>{t.common.errorTitle}</h1>
      <Button onClick={reset}>{t.common.retry}</Button>
    </Container>
  );
}
