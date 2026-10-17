import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", path: "/", icon: "▦" },
  { title: "Crops", path: "/crops", icon: "🌱" },
  { title: "Harvest & Orders", path: "/harvest-orders", icon: "📦" },
  { title: "Buyers", path: "/buyers", icon: "👥" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🌿</span>
        <div>
          <h2>Farmer Hub</h2>
          <p>Farm Management</p>
        </div>
      </div>

      <p className="menu-heading">MAIN MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>🌾</span>
        <div>
          <strong>Agriculture System</strong>
          <p>Grow better, together.</p>
        </div>
      </div>
    </aside>
  );
}