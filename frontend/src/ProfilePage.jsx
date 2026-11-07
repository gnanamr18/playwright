import { useState } from "react";
import { api } from "./api.js";

export default function ProfilePage({ token, user, onUserUpdate, onLogout }) {
  const [age, setAge] = useState(user.age ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSave(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);

    try {
      const data = await api("/api/profile", {
        method: "PUT",
        token,
        body: { age, address, mobileNumber },
      });
      onUserUpdate(data.user);
      setMessage(data.message || "Profile saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="top-row">
        <div>
          <h1 data-testid="welcome">Hi, {user.username}</h1>
          <p className="subtitle">Update your profile details below.</p>
        </div>
        <button
          className="secondary"
          data-testid="logout-button"
          type="button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>

      <form onSubmit={handleSave}>
        <label>
          Age
          <input
            data-testid="age"
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>

        <label>
          Address
          <textarea
            data-testid="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label>
          Mobile number
          <input
            data-testid="mobile"
            inputMode="numeric"
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="10 digits"
          />
        </label>

        <div className="actions">
          <button data-testid="save-button" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>

      {message ? (
        <p className="message success" data-testid="save-success">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="message error" data-testid="save-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
