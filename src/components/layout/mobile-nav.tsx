"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, IconButton } from "@/components/ui";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { LocaleSwitch } from "./locale-switch";
import styles from "./mobile-nav.module.scss";
import { NavLinks } from "./nav-links";

export function MobileNav() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <IconButton aria-label={t.nav.openMenu} className={styles.trigger}>
          <Menu aria-hidden="true" />
        </IconButton>
      </DialogTrigger>
      <DialogContent
        title={t.nav.mainNavigation}
        isTitleHidden
        closeLabel={t.nav.closeMenu}
        placement="start"
      >
        <nav aria-label={t.nav.mainNavigation}>
          <NavLinks orientation="vertical" onNavigate={() => setIsOpen(false)} />
        </nav>
        <div className={styles.footer}>
          <LocaleSwitch />
        </div>
      </DialogContent>
    </Dialog>
  );
}
