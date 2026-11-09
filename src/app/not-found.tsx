import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "./not-found.module.scss";

export default async function NotFound() {
  const t = await getDictionary();

  return (
    <Container className={styles.root}>
      <p className={styles.code}>404</p>
      <h1>{t.common.notFound}</h1>
      <Button asChild>
        <Link href="/">{t.common.backHome}</Link>
      </Button>
    </Container>
  );
}
