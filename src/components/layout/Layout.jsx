import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css";

const Layout = () => {
  const { currentUser, loading } = useUser();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-large"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
