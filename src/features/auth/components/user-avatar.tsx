import clsx from "clsx";
import styles from "./user-avatar.module.scss";

interface UserAvatarProps {
  name: string | null;
  email: string;
  image?: string | null;
  size?: "sm" | "lg";
}

const getInitials = (name: string | null, email: string) =>
  (name ?? email)
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function UserAvatar({ name, email, image, size = "sm" }: UserAvatarProps) {
  return (
    <span className={clsx(styles.root, styles[size])} aria-hidden="true">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- external avatar hosts vary (OAuth)
        <img src={image} alt="" className={styles.image} referrerPolicy="no-referrer" />
      ) : (
        getInitials(name, email)
      )}
    </span>
  );
}
