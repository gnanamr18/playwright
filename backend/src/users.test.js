/**
 * UNIT TEST example (Jest)
 *
 * - Tests ONE small function: findHardcodedUser
 * - No browser, no React, no Express server, no Postgres
 * - Fast — just calls the function and checks the return value
 *
 * Compare with e2e/auth.spec.js (Playwright):
 * that opens a real browser and clicks through the whole app.
 */
import { findHardcodedUser } from "./users.js";

describe("findHardcodedUser", () => {
  test("returns the user when username and password are correct", () => {
    const user = findHardcodedUser("alice", "alice123");

    expect(user).toEqual({ username: "alice", password: "alice123" });
  });

  test("returns undefined when password is wrong", () => {
    const user = findHardcodedUser("alice", "wrong-password");

    expect(user).toBeUndefined();
  });

  test("returns undefined when username is unknown", () => {
    const user = findHardcodedUser("charlie", "alice123");

    expect(user).toBeUndefined();
  });
});
