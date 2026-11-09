/**
 * Two hardcoded logins for learning.
 * Passwords are checked here — they are NOT stored in Postgres.
 */
export const HARDCODED_USERS = [
  // Intentionally broken for CI-fail learning demo (was alice123)
  { username: "alice", password: "alice999" },
  { username: "bob", password: "bob123" },
];

export function findHardcodedUser(username, password) {
  return HARDCODED_USERS.find(
    (user) => user.username === username && user.password === password
  );
}
