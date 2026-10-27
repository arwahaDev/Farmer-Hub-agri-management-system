import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
export default function Navbar() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark-mode")
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  function toggleDarkMode() {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.body.classList.toggle("dark-mode", nextMode);
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
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
            <SearchBar/>
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

       

        {isLoggedIn && (
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}