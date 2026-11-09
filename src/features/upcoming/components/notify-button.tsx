"use client";

import { Bell, BellRing } from "lucide-react";
import { useState, useTransition } from "react";
import { Button, type ButtonProps } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { toggleReleaseNotification } from "../server/actions";

interface NotifyButtonProps {
  titleId: string;
  isSubscribed: boolean;
  size?: ButtonProps["size"];
}

export function NotifyButton({ titleId, isSubscribed, size = "sm" }: NotifyButtonProps) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [isOn, setIsOn] = useState(isSubscribed);

  const handleClick = () => {
    const next = !isOn;
    setIsOn(next); // optimistic
    startTransition(async () => {
      const result = await toggleReleaseNotification(titleId, next);
      if (!result.ok) setIsOn(!next);
    });
  };

  return (
    <Button
      variant={isOn ? "secondary" : "outline"}
      size={size}
      aria-pressed={isOn}
      disabled={isPending}
      onClick={handleClick}
    >
      {isOn ? <BellRing aria-hidden="true" /> : <Bell aria-hidden="true" />}
      {isOn ? t.lists.notifying : t.lists.notifyMe}
    </Button>
  );
}
