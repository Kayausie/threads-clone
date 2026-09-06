import { test, expect } from "@playwright/test";
import { sidebarLinks } from "../constants";

const baseURL = process.env.BASE_URL;
const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

if (!baseURL) throw new Error("BASE_URL is not set");
if (!email) throw new Error("E2E_USER_EMAIL is not set");
if (!password) throw new Error("E2E_USER_PASSWORD is not set");

test.use({ baseURL });

test.describe("Threads application user journey", () => {
  test("signs in, completes onboarding, views profile, and creates a thread", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    const profileName = "E2E Test User";
    const expectedUsername = "broinhere";
    const profileBio = "This profile was created by Playwright.";
    const threadContent = `E2E thread created at ${Date.now()}`;

    // 1. Open the protected landing page
    await page.goto("/");

    // Clerk sign-in form
    await page.getByLabel(/email address/i).fill(email);
    await page.getByRole("button", { name: /continue/i }).click();

    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /continue|sign in/i }).click();

    // 2. Verify onboarding page
    await expect(page).toHaveURL(/\/onboarding(?:\/)?$/);
    await expect(
      page.getByRole("heading", { name: "Onboarding" })
    ).toBeVisible();

    await expect(page.getByText("Complete your profile now")).toBeVisible();

    const nameInput = page.getByLabel("Name", { exact: true });
    const usernameInput = page.getByLabel("Username", { exact: true });
    const bioInput = page.getByLabel("Bio", { exact: true });

    // Verify the Clerk username defaults to "broinhere"
    await expect(usernameInput).toHaveValue(expectedUsername);

    await nameInput.fill(profileName);
    await bioInput.fill(profileBio);

    await page.getByRole("button", { name: "Submit" }).click();

    // 3. Verify homepage and six sidebar links
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();

    const sidebar = page.locator("section.leftsidebar");

    for (const link of sidebarLinks) {
      await expect(
        sidebar.getByRole("link", {
          name: new RegExp(`^${link.label}`, "i"),
        })
      ).toBeVisible();
    }

    // 4. Open profile and verify onboarding details
    await sidebar
      .getByRole("link", { name: /^Profile/i })
      .click();

    await expect(page).toHaveURL(/\/profile\/[^/]+$/);
    await expect(
      page.getByRole("heading", { name: profileName })
    ).toBeVisible();
    await expect(
      page.getByText(`@${expectedUsername}`, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(profileBio, { exact: true })
    ).toBeVisible();

    // 5. Create a thread
    await sidebar
      .getByRole("link", { name: /^Create Thread/i })
      .click();

    await expect(
      page.getByRole("heading", { name: "Create Thread" })
    ).toBeVisible();

    await page
      .getByLabel("Content", { exact: true })
      .fill(threadContent);

    await page.getByRole("button", { name: "Post Thread" }).click();

    // Verify the new thread is shown at the top of the homepage
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByText(threadContent, { exact: true }).first()
    ).toBeVisible();
  });
});