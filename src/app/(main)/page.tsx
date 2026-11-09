import Link from "next/link";
import { Badge, Button, Container } from "@/components/ui";
import { getDictionary } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export default async function HomePage() {
  const t = await getDictionary();

  return (
    <Container className={styles.root}>
      <Badge variant="secondary">A1 → C2</Badge>
      <h1 className={styles.title}>{t.home.title}</h1>
      <p className={styles.subtitle}>{t.home.subtitle}</p>
      <div className={styles.actions}>
        <Button asChild size="lg">
          <Link href="/movies">{t.nav.movies}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/series">{t.nav.series}</Link>
        </Button>
      </div>
    </Container>
  );
}
