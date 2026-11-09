import type { Metadata } from "next";
import { SignOutButton, UserAvatar } from "@/features/auth";
import { requireUser } from "@/features/auth/server";
import { ProfileForm, ProfileStats, SubscriptionCard } from "@/features/profile";
import { getProfile } from "@/features/profile/server";
import { isLocale } from "@/lib/i18n";
import { getDictionary, getLocale } from "@/lib/i18n/get-locale";
import styles from "./page.module.scss";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser("/profile");
  const [profile, t, locale] = await Promise.all([
    getProfile(user.id),
    getDictionary(),
    getLocale(),
  ]);
  const memberSince = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    profile.createdAt,
  );

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <UserAvatar name={profile.name} email={profile.email} image={profile.image} size="lg" />
        <div className={styles.identity}>
          <h1 className={styles.name}>{profile.name ?? profile.email}</h1>
          <p className={styles.muted}>{profile.email}</p>
          <p className={styles.muted}>
            {t.profile.memberSince} {memberSince}
          </p>
        </div>
      </header>

      <div className={styles.cards}>
        <SubscriptionCard subscription={profile.subscription} t={t.profile} />
        <ProfileStats stats={profile.stats} t={t.profile} />
      </div>

      <section aria-labelledby="settings-heading" className={styles.settings}>
        <h2 id="settings-heading" className={styles.sectionTitle}>
          {t.profile.title}
        </h2>
        <ProfileForm
          defaultValues={{
            name: profile.name ?? "",
            locale: isLocale(profile.locale) ? profile.locale : locale,
          }}
        />
      </section>

      <SignOutButton label={t.auth.signOut} />
    </div>
  );
}
