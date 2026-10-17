import { useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleDarkMode() {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.body.classList.toggle("dark-mode", nextMode);
  }

  const today = new Date().toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="top-navbar">
      <div className="navbar-title">
        <span className="navbar-eyebrow">AGRICULTURE MANAGEMENT</span>
        <h2>Farm Overview</h2>
        <p>Welcome back! Here is your farm's latest overview.</p>
      </div>

      <div className="navbar-actions">
        <div className="today-date">
          <span>📅</span>
          <span>{today}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={toggleDarkMode}
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          type="button"
          className="profile-button"
          aria-label="Farmer profile"
        >
          👨‍🌾
          <span>Farmer</span>
        </button>
      </div>
    </header>
  );
}