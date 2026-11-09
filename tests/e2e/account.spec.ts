import { expect, test } from "@playwright/test";
import { expectNoA11yViolations } from "./fixtures";
import { STORAGE_STATE } from "./global-setup";

test("anonymous users are redirected to sign-in", async ({ page }) => {
  await page.goto("/profile");
  await expect(page).toHaveURL(/\/sign-in\?callbackUrl=%2Fprofile/);
});

test.describe("signed in", () => {
  test.use({ storageState: STORAGE_STATE });

  test("profile shows subscription and is accessible", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("demo@substream.movie")).toBeVisible();
    await expect(page.getByText(/days left/)).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test("save a word from subtitles, then remove it from the dictionary", async ({ page }) => {
    await page.goto("/watch/the-lighthouse-keepers-daughter");
    const video = page.locator("video");
    await expect(video)
      .toHaveJSProperty("readyState", 4, { timeout: 15_000 })
      .catch(() => undefined);
    await video.evaluate((element: HTMLVideoElement) => {
      element.currentTime = 12;
    });

    await page.locator("p[lang=en] button", { hasText: "twenty" }).click();
    const panel = page.getByRole("dialog", { name: "Word lookup" });
    await expect(panel.getByRole("textbox")).toHaveValue("двадцать");
    await panel.getByRole("button", { name: "Save to dictionary" }).click();
    await expect(panel.getByRole("button", { name: "In your dictionary" })).toBeVisible();

    await page.goto("/dictionary");
    const item = page.getByRole("listitem").filter({ hasText: "twenty — двадцать" });
    await expect(item).toBeVisible();
    await item.getByRole("button", { name: "Delete: twenty" }).click();
    await expect(item).toHaveCount(0);
  });

  test("subtitle shortcuts toggle the translation line", async ({ page }) => {
    await page.goto("/watch/the-lighthouse-keepers-daughter");
    await page.locator("video").evaluate((element: HTMLVideoElement) => {
      element.currentTime = 2;
    });
    const translation = page.locator("p[lang=ru]");
    await expect(translation).toBeVisible();
    await page.keyboard.press("t");
    await expect(translation).toBeHidden();
    await page.keyboard.press("t");
    await expect(translation).toBeVisible();
  });
});
