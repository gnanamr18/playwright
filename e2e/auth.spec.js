import { test, expect } from "@playwright/test";

/**
 * These tests drive a real browser against your React app.
 * Think of each test as: open page → do actions → check result.
 */

test.describe("Login", () => {
  test("shows an error for bad credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("username").fill("alice");
    await page.getByTestId("password").fill("wrong-password");
    await page.getByTestId("login-button").click();

    await expect(page.getByTestId("login-error")).toContainText(
      "Invalid username or password"
    );
  });

  test("logs in with a demo account", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("username").fill("alice");
    await page.getByTestId("password").fill("alice123");
    await page.getByTestId("login-button").click();

    await expect(page.getByTestId("welcome")).toContainText("Hello, alice");
    await expect(page.getByTestId("logout-button")).toBeVisible();
  });
});

test.describe("Profile + logout", () => {
  test("can save profile details and log out", async ({ page }) => {
    // Arrange: log in first
    await page.goto("/");
    await page.getByTestId("username").fill("bob");
    await page.getByTestId("password").fill("bob123");
    await page.getByTestId("login-button").click();
    await expect(page.getByTestId("welcome")).toContainText("Hi, bob");

    // Act: fill profile
    await page.getByTestId("age").fill("28");
    await page.getByTestId("address").fill("12 Learning Street");
    await page.getByTestId("mobile").fill("9876543210");
    await page.getByTestId("save-button").click();

    // Assert: saved
    await expect(page.getByTestId("save-success")).toContainText("Profile saved");

    // Act: log out
    await page.getByTestId("logout-button").click();

    // Assert: back on login screen
    await expect(page.getByTestId("login-button")).toBeVisible();
  });
});
