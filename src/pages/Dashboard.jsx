import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { apiService } from "../services/api";
import { Card, Badge, ProgressBar, Spinner, Alert } from "../components/common";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiService.users.getStats(currentUser.id);
      setStats(response.data);
    } catch (err) {
      setError("Impossible de charger les statistiques");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenue, {currentUser.username} ! 👋</h1>
        <p>Niveau {stats?.level || 1}</p>
      </div>

      <div className="dashboard-grid">
        <Card className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Points XP</h3>
            <p className="stat-value">{stats?.xp || 0}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Exercices complétés</h3>
            <p className="stat-value">{stats?.exercises_completed || 0}</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Série actuelle</h3>
            <p className="stat-value">{stats?.streak || 0} jours</p>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">🎖️</div>
          <div className="stat-content">
            <h3>Badges</h3>
            <p className="stat-value">{stats?.badges_count || 0}</p>
          </div>
        </Card>
      </div>

      <Card className="progress-section">
        <h2>Progression vers le niveau suivant</h2>
        <ProgressBar value={stats?.xp || 0} max={stats?.next_level_xp || 100} />
        <p className="progress-text">
          {stats?.xp || 0} / {stats?.next_level_xp || 100} XP
        </p>
      </Card>

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="action-grid">
          <Card className="action-card">
            <h3>💻 Exercices</h3>
            <p>Continue ton apprentissage</p>
          </Card>
          <Card className="action-card">
            <h3>⚔️ Quêtes</h3>
            <p>Relève des défis</p>
          </Card>
          <Card className="action-card">
            <h3>👑 Classement</h3>
            <p>Compare tes scores</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
