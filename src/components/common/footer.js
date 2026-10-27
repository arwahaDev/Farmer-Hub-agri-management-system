import React from "react";

function footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h3>
            <span className="footer-icon">🌱</span>
            Kisan Seva
          </h3>

          <p>
            Smart farming solutions for a better
            and more sustainable future.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>

          <a href="/">Dashboard</a>
          <a href="/crops">Crops</a>
          <a href="/harvest-orders">Harvest Orders</a>
          <a href="/buyers">Buyers</a>
        </div>

        <div className="footer-contact">
          <h4>Our Platform</h4>

          <p>Manage your crops efficiently.</p>
          <p>Track harvest orders with ease.</p>
          <p>Keep your farming data organized.</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Kisan Seva. All rights reserved.
        </p>

        <p>Growing Better, Together 🌿</p>
      </div>
    </footer>
  );
}

export default footer;