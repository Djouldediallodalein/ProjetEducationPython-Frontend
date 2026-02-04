import React from "react";
import "./Layout.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 PyQuest - Apprendre Python en s'amusant</p>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span>•</span>
          <a href="https://docs.python.org" target="_blank" rel="noopener noreferrer">
            Documentation Python
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
