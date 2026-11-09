import { Badge, type BadgeVariant } from "@/components/ui";
import type { CefrLevel } from "../types";

const VARIANT_BY_LEVEL: Record<CefrLevel, BadgeVariant> = {
  A1: "levelA",
  A2: "levelA",
  B1: "levelB",
  B2: "levelB",
  C1: "levelC",
  C2: "levelC",
};

export function LevelBadge({ level }: { level: CefrLevel }) {
  return (
    <Badge variant={VARIANT_BY_LEVEL[level]} title={`CEFR ${level}`}>
      {level}
    </Badge>
  );
}
