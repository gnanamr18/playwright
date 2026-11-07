/**
 * Two hardcoded logins for learning.
 * Passwords are checked here — they are NOT stored in Postgres.
 */
export const HARDCODED_USERS = [
  { username: "alice", password: "alice123" },
  { username: "bob", password: "bob123" },
];

export function findHardcodedUser(username, password) {
  return HARDCODED_USERS.find(
    (user) => user.username === username && user.password === password
  );
}
