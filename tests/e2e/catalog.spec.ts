import { expect, test } from "@playwright/test";
import { expectNoA11yViolations, useEnglish } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await useEnglish(page);
});

test("home shows the featured title and main sections @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Watch" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top movies" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Coming soon" })).toBeVisible();
  // No horizontal scroll
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("catalog filters are stored in the URL", async ({ page }) => {
  await page.goto("/movies");
  const status = page.getByRole("status").first();
  await expect(status).toContainText("6 titles");

  await page.locator("aside").getByRole("button", { name: "B1", exact: true }).click();
  await expect(page).toHaveURL(/level=B1/);
  await expect(status).toContainText("2 titles");

  // Reload keeps the filter (URL is the source of truth)
  await page.reload();
  await expect(
    page.locator("aside").getByRole("button", { name: "B1", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page).not.toHaveURL(/level=/);
});

test("title page lists seasons and episodes", async ({ page }) => {
  await page.goto("/title/the-night-shift-files");
  await expect(
    page.getByRole("heading", { name: "The Night Shift Files", level: 1 }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Season 3" }).click();
  await expect(page.getByRole("tabpanel").getByRole("listitem")).toHaveCount(8);
});

test("search finds titles and actors", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Search titles and actors").fill("ava");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/q=ava/);
  await expect(page.getByRole("link", { name: "Ava Lindqvist" })).toBeVisible();
});

for (const path of [
  "/",
  "/movies",
  "/title/harbour-lane",
  "/watch/the-lighthouse-keepers-daughter",
  "/search?q=paper",
  "/help",
]) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expectNoA11yViolations(page);
  });
}
