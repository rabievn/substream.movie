import { Container, Skeleton } from "@/components/ui";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <Container className={styles.root} aria-busy="true">
      <Skeleton width="40%" height={40} />
      <Skeleton width="70%" height={20} />
      <div className={styles.grid}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} height={240} radius="lg" />
        ))}
      </div>
    </Container>
  );
}
