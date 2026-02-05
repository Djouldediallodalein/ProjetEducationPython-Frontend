import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Sparkles } from "lucide-react";
import "./Layout.css";

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "" },
    { path: "/exercises", label: "Exercices", icon: "" },
    { path: "/progression", label: "Progression", icon: "" },
    { path: "/badges", label: "Badges", icon: "" },
    { path: "/quests", label: "Quêtes", icon: "" },
    { path: "/leaderboard", label: "Classement", icon: "" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} strokeWidth={2.5} />
          <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>Nexia</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path) ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="navbar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <Link to="/profile" className="navbar-profile">
            {currentUser?.username}
          </Link>
          <button onClick={logout} className="navbar-logout">
            Déconnexion
          </button>
        </div>

        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
