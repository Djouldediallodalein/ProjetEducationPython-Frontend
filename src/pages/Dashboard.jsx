import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { apiService } from "../services/api";
import { Card, Badge, ProgressBar, Spinner, Alert } from "../components/common";
import { Plus } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [domaines, setDomaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  // MISSION 2: Charger les domaines depuis l'API
  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        setLoading(true);
        const response = await apiService.domaines.getAll();
        
        if (response.data?.success && response.data?.data?.domaines) {
          const domainesArray = Object.entries(response.data.data.domaines).map(([id, info]) => ({
            id,
            ...info
          }));
          setDomaines(domainesArray.sort((a, b) => (a.popularite || 99) - (b.popularite || 99)));
        }
      } catch (err) {
        console.error("Erreur chargement domaines:", err);
        setError("Impossible de charger le catalogue de cours. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomaines();
  }, []);

  const handleDomainSelect = (domaine) => {
    console.log("Domaine sélectionné:", domaine.nom);
    // TODO: Naviguer vers la page d'exercices du domaine
    navigate(`/exercises?domain=${domaine.id}`);
  };

  const handleCreateCustom = () => {
    setShowCustomModal(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Bienvenue, {currentUser?.username} !</h1>
        <p className="dashboard-subtitle">Que souhaitez-vous apprendre aujourd'hui ?</p>
      </div>

      <section className="domaines-section">
        <h2 className="section-title">Choisissez votre domaine d'apprentissage</h2>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner />
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>Chargement du catalogue...</p>
          </div>
        )}

        {error && (
          <Alert type="error" message={error} />
        )}

        {!loading && !error && (
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

            {/* MISSION 3: Carte pour créer un domaine personnalisé */}
            <Card
              className="domaine-card domaine-card-custom"
              onClick={handleCreateCustom}
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                border: '2px dashed rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.8 }}>
                <Plus size={48} strokeWidth={2} />
              </div>
              <h3 className="domaine-nom">Créer un sujet</h3>
              <p className="domaine-type" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                PERSONNALISÉ
              </p>
              <p className="domaine-description" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Définissez votre propre domaine d'apprentissage
              </p>
            </Card>
          </div>
        )}
      </section>

      <section className="stats-section" style={{ marginTop: '3rem' }}>
        <h2 className="section-title">Vos statistiques</h2>
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

      {/* MISSION 3: Modal de création de domaine personnalisé */}
      {showCustomModal && (
        <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Créer un domaine personnalisé</h2>
            <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
              Cette fonctionnalité sera disponible prochainement. Vous pourrez créer des domaines comme "Électronique", "Espagnol", "VHDL", etc.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCustomModal(false)}
              style={{ width: '100%' }}
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
