import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { apiService } from "../services/api";
import { Card, Badge, ProgressBar, Spinner, Alert } from "../components/common";
import { getDomainesList } from "../data/domaines";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const domaines = getDomainesList();

  const handleDomainSelect = (domaine) => {
    setSelectedDomain(domaine);
    console.log("🎯 Domaine sélectionné:", domaine.nom);
    alert(`🚀 Domaine sélectionné: ${domaine.nom}\nBientôt disponible!`);
    // TODO: Naviguer vers la page d'exercices du domaine
    // navigate(`/exercises/${domaine.id}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenue, {currentUser?.username} ! 👋</h1>
        <p className="dashboard-subtitle">Que souhaitez-vous apprendre aujourd'hui ?</p>
      </div>

      <section className="domaines-section">
        <h2 className="section-title">📚 Choisissez votre domaine d'apprentissage</h2>
        <div className="domaines-grid">
          {domaines.map((domaine) => (
            <Card
              key={domaine.id}
              className="domaine-card"
              onClick={() => handleDomainSelect(domaine)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="domaine-emoji" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {domaine.emoji}
              </div>
              <h3 className="domaine-nom">{domaine.nom}</h3>
              <p className="domaine-type" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                {domaine.type}
              </p>
              <p className="domaine-description" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {domaine.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="stats-section" style={{ marginTop: '3rem' }}>
        <h2 className="section-title">📊 Vos statistiques</h2>
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
      </section>
    </div>
  );
};

export default Dashboard;
