import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Forces the English UI so assertions don't depend on the default locale. */
export async function useEnglish(page: Page) {
  await page.context().addCookies([{ name: "locale", value: "en", url: "http://localhost" }]);
}

/** Fails on serious/critical axe violations (WCAG 2.1 A/AA). */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(
    serious.map(
      (v) =>
        `${v.id}: ${v.help} (${v.nodes
          .map((n) => n.target.join(" "))
          .slice(0, 3)
          .join(", ")})`,
    ),
  ).toEqual([]);
}
