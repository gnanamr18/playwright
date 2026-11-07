import { useState } from "react";
import { api } from "./api.js";

export default function LoginPage({ onLogin, bannerError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(bannerError || "");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const data = await api("/api/login", {
        method: "POST",
        body: { username, password },
      });
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <h1>Playright Profile</h1>
      <p className="subtitle">Log in to edit your profile details.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            data-testid="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            data-testid="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <div className="actions">
          <button data-testid="login-button" type="submit" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="message error" data-testid="login-error">
          {error}
        </p>
      ) : null}

      <div className="hint">
        Demo accounts:
        <br />
        <code>alice</code> / <code>alice123</code>
        <br />
        <code>bob</code> / <code>bob123</code>
      </div>
    </div>
  );
}
