import Link from "next/link";
import { Button, VisuallyHidden } from "@/components/ui";
import { UserAvatar } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server";
import type { Dictionary } from "@/lib/i18n";
import styles from "./site-header.module.scss";

export async function HeaderUser({ t }: { t: Dictionary }) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Button asChild size="sm" variant="secondary">
        <Link href="/sign-in">{t.common.signIn}</Link>
      </Button>
    );
  }

  return (
    <Link href="/profile" className={styles.avatarLink} title={t.nav.profile}>
      <UserAvatar name={user.name} email={user.email} image={user.image} />
      <VisuallyHidden>{t.nav.profile}</VisuallyHidden>
    </Link>
  );
}
