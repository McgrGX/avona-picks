import { expect, test } from "@playwright/test";

test("home shows the rivalry, scoreboards, and prototype notice", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Amazon vs Costco");
  await expect(page.getByRole("note").first()).toContainText("sample data");
  await expect(page.getByRole("group", { name: /United States: Amazon \d+, Costco \d+/ })).toBeVisible();
  await expect(page.getByRole("group", { name: /Canada: Amazon \d+, Costco \d+/ })).toBeVisible();
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
});

test("item page shows both sides with honest link notes", async ({ page }) => {
  await page.goto("/us/air-fryers/dual-basket-air-fryer-8qt");
  await expect(page.getByRole("heading", { name: "Costco wins" })).toBeVisible();
  const amazon = page.getByRole("link", { name: /Visit Amazon/ });
  await expect(amazon).toHaveAttribute("href", "https://www.amazon.com/");
  await expect(amazon).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByRole("link", { name: /Visit Costco/ })).toHaveAttribute("href", "https://www.costco.com/");
  await expect(page.getByText(/Sample link to the Costco home page/)).toBeVisible();
  await expect(page.locator('link[rel=alternate][hreflang="en-CA"]')).toHaveAttribute("href", /\/ca\/air-fryers\/dual-basket-air-fryer-8qt$/);
});

test("Canada prices are in CAD and link to Canadian retailers", async ({ page }) => {
  await page.goto("/ca/air-fryers/dual-basket-air-fryer-8qt");
  await expect(page.getByText(/CAD/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Visit Amazon/ })).toHaveAttribute("href", "https://www.amazon.ca/");
  await expect(page.getByRole("heading", { name: /Tie/ })).toBeVisible();
});

test("pending Amazon price withholds the verdict", async ({ page }) => {
  await page.goto("/us/blenders-juicers/slow-masticating-juicer");
  await expect(page.getByText("Check current price on Amazon")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pending live Amazon price" })).toBeVisible();
});

test("outdated video verdicts are flagged", async ({ page }) => {
  await page.goto("/ca/vacuums/cordless-stick-vacuum");
  await expect(page.getByRole("status")).toContainText("Verdict updated since this video");
});

test("legal pages are marked as drafts", async ({ page }) => {
  for (const path of ["/disclosure", "/privacy", "/terms"]) {
    await page.goto(path);
    await expect(page.getByText(/Draft for legal review/)).toBeVisible();
  }
});

test("email signup requires consent and stores nothing", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email address").fill("reader@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.getByRole("status")).toContainText("Nothing was sent or stored");
});

test("long-form video receipts list every item and flag changes", async ({ page }) => {
  await page.goto("/v/yt-004");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("7 kitchen buys");
  await expect(page.getByRole("listitem")).toHaveCount(7);
  await expect(page.getByText("Verdict updated since this video")).toHaveCount(1);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
});

test("short video receipts link to the item page", async ({ page }) => {
  await page.goto("/v/yt-001");
  await page.getByRole("link", { name: "8-qt dual-basket air fryer" }).click();
  await expect(page).toHaveURL(/\/us\/air-fryers\/dual-basket-air-fryer-8qt$/);
  await expect(page.getByRole("link", { name: "Amazon vs Costco: dual-basket air fryer" })).toHaveAttribute("href", "/v/yt-001");
});

test("unknown markets and items return 404", async ({ page }) => {
  for (const path of ["/uk", "/us/not-a-category", "/us/air-fryers/nope", "/us/vacuums/dual-basket-air-fryer-8qt", "/v/nope"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
  }
});

test("robots blocks crawling by default", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Disallow: /");
});

test("no horizontal overflow on item pages", async ({ page }) => {
  await page.goto("/us/vacuums/cordless-stick-vacuum");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
