import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Card, Spinner, Alert } from "../components/common";
import { BookOpen, Code, ArrowLeft } from "lucide-react";
import "./Exercises.css";

const Exercises = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const domain = searchParams.get("domain");
  
  const [domainInfo, setDomainInfo] = useState(null);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingExercise, setGeneratingExercise] = useState(false);

  useEffect(() => {
    if (!domain) {
      navigate("/dashboard");
      return;
    }

    const fetchDomainData = async () => {
      try {
        setLoading(true);
        
        // Charger les domaines pour obtenir les infos
        const domainsResponse = await apiService.domaines.getAll();
        if (domainsResponse.data?.success && domainsResponse.data?.data?.domaines) {
          const domainData = domainsResponse.data.data.domaines[domain];
          setDomainInfo(domainData);
        }

        // Charger les thèmes
        const themesResponse = await apiService.domaines.getThemes(domain);
        if (themesResponse.data?.success && themesResponse.data?.data?.themes) {
          setThemes(themesResponse.data.data.themes);
        }
      } catch (err) {
        console.error("❌ Erreur chargement thèmes:", err);
        setError("Impossible de charger les thèmes. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomainData();
  }, [domain, navigate]);

  const handleGenerateExercise = async (theme) => {
    // Navigation vers la page d'exercice
    navigate(`/exercise?domain=${domain}&theme=${encodeURIComponent(theme)}`);
  };

  if (loading) {
    return (
      <div className="exercises-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner />
          <p style={{ marginTop: '1rem', color: 'white', opacity: 0.7 }}>
            Chargement des thèmes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercises-container">
        <Alert type="error" message={error} />
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate("/dashboard")}
          style={{ marginTop: '1rem' }}
        >
          <ArrowLeft size={20} /> Retour au Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="exercises-container">
      <div className="exercises-header">
        <button 
          className="btn-back" 
          onClick={() => navigate("/dashboard")}
          title="Retour au Dashboard"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="header-content">
          <div className="domain-badge">
            <span style={{ fontSize: '2.5rem' }}>{domainInfo?.emoji || ""}</span>
          </div>
          <div>
            <h1>{domainInfo?.nom || domain}</h1>
            <p className="domain-subtitle">{domainInfo?.description}</p>
          </div>
        </div>
      </div>

      <section className="themes-section">
        <h2 className="section-title">
          <BookOpen size={28} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Choisissez un thème
        </h2>
        
        <div className="themes-grid">
          {themes.map((theme, index) => (
            <Card 
              key={index}
              className="theme-card"
              onClick={() => handleGenerateExercise(theme)}
              style={{ 
                cursor: generatingExercise ? 'wait' : 'pointer',
                opacity: generatingExercise ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="theme-number">{index + 1}</div>
              <div className="theme-content">
                <h3>{theme}</h3>
                <div className="theme-action">
                  <Code size={20} />
                  <span>Générer un exercice</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {themes.length === 0 && (
          <Card style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'white', opacity: 0.7 }}>
              Aucun thème disponible pour ce domaine.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Exercises;
