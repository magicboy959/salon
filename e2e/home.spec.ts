import { expect, test } from "@playwright/test";

test("home page renders luxury salon brand", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Alshanab Alaswad Salon" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Book/i }).first()).toBeVisible();
});
