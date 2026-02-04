import React from "react";
import "./Card.css";

export const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Button = ({ children, variant = "primary", className = "", onClick, disabled, ...props }) => {
  return (
    <button
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className={`input ${error ? "input-error" : ""}`} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export const Badge = ({ children, variant = "default", className = "" }) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
};

export const ProgressBar = ({ value, max = 100, className = "" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
        <span className="progress-bar-text">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export const Spinner = ({ size = "medium" }) => {
  return <div className={`spinner spinner-${size}`}></div>;
};

export const Alert = ({ type = "info", children }) => {
  return <div className={`alert alert-${type}`}>{children}</div>;
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
