import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { Card, Spinner, Alert } from "../components/common";
import Terminal from "../components/common/Terminal";
import { ArrowLeft, Send, Lightbulb, CheckCircle, XCircle } from "lucide-react";
import "./Exercise.css";

const Exercise = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const domain = searchParams.get("domain");
  const theme = searchParams.get("theme");
  
  const [exercise, setExercise] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showTerminal, setShowTerminal] = useState(true);

  useEffect(() => {
    if (!domain || !theme) {
      navigate("/exercises?domain=" + (domain || "python"));
      return;
    }

    const generateExercise = async () => {
      try {
        setLoading(true);
        const response = await apiService.exercises.generate(domain, theme, 1);
        
        if (response.data?.success && response.data?.data?.exercice) {
          const ex = response.data.data.exercice;
          setExercise(ex);
          setCode(ex.code_initial || "");
        } else {
          setError("Impossible de générer l'exercice. Réessayez.");
        }
      } catch (err) {
        console.error("❌ Erreur génération:", err);
        setError("Erreur lors de la génération de l'exercice.");
      } finally {
        setLoading(false);
      }
    };

    generateExercise();
  }, [domain, theme, navigate]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Veuillez écrire du code avant de soumettre !");
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const response = await apiService.exercises.verify(domain, theme, code);
      
      if (response.data?.success) {
        const res = response.data.data;
        setResult({
          success: res.correct || false,
          message: res.message || "",
          tests_results: res.tests_results || [],
          tests_passed: res.tests_passed || 0,
          tests_total: res.tests_total || 0
        });
      }
    } catch (err) {
      console.error("❌ Erreur vérification:", err);
      setResult({
        success: false,
        message: "Erreur lors de la vérification du code.",
        tests_results: [],
        tests_passed: 0,
        tests_total: 0
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewExercise = () => {
    navigate(`/exercises?domain=${domain}`);
  };

  if (loading) {
    return (
      <div className="exercise-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner />
          <p style={{ marginTop: '1rem', color: 'white', opacity: 0.7 }}>
            Génération de l'exercice...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercise-container">
        <Alert type="error" message={error} />
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(`/exercises?domain=${domain}`)}
          style={{ marginTop: '1rem' }}
        >
          <ArrowLeft size={20} /> Retour aux thèmes
        </button>
      </div>
    );
  }

  return (
    <div className="exercise-container">
      <div className="exercise-header">
        <button 
          className="btn-back" 
          onClick={() => navigate(`/exercises?domain=${domain}`)}
          title="Retour aux thèmes"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="header-info">
          <h1>{theme}</h1>
          <p className="domain-name">{domain.toUpperCase()}</p>
        </div>
      </div>

      <div className="exercise-content">
        <div className="exercise-left">
          <Card className="instruction-card">
            <h2>📋 Consigne</h2>
            <div className="instruction-text">
              {exercise?.enonce || "Résolvez cet exercice."}
            </div>

            {exercise?.exemple && (
              <div className="example-section">
                <h3><Lightbulb size={20} /> Exemple</h3>
                <pre className="example-code">{exercise.exemple}</pre>
              </div>
            )}

            {exercise?.indice && (
              <details className="hint-section">
                <summary>💡 Indice</summary>
                <p>{exercise.indice}</p>
              </details>
            )}
          </Card>

          {result && (
            <Card className={`result-card ${result.success ? 'success' : 'error'}`}>
              <div className="result-header">
                {result.success ? (
                  <>
                    <CheckCircle size={32} />
                    <h2>✅ Bravo !</h2>
                  </>
                ) : (
                  <>
                    <XCircle size={32} />
                    <h2>❌ Pas tout à fait...</h2>
                  </>
                )}
              </div>
              <p className="result-message">{result.message}</p>
              
              {result.tests_results && result.tests_results.length > 0 && (
                <div className="tests-results">
                  <h3>Résultats des tests :</h3>
                  {result.tests_results.map((test, idx) => (
                    <div key={idx} className={`test-item ${test.passed ? 'test-passed' : 'test-failed'}`}>
                      <span className="test-icon">{test.passed ? '✓' : '✗'}</span>
                      <div className="test-details">
                        <p className="test-description">{test.description}</p>
                        {test.output && (
                          <pre className="test-output">{test.output}</pre>
                        )}
                        {test.error && (
                          <pre className="test-error">{test.error}</pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.success && (
                <button 
                  className="btn btn-primary" 
                  onClick={handleNewExercise}
                  style={{ marginTop: '1rem' }}
                >
                  Exercice suivant
                </button>
              )}
            </Card>
          )}
        </div>

        <div className="exercise-right">
          <Card className="editor-card">
            <div className="editor-header">
              <h2>💻 Votre code</h2>
              <button 
                className="btn btn-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <Spinner size={16} />
                ) : (
                  <Send size={20} />
                )}
                {submitting ? "Vérification..." : "Soumettre"}
              </button>
            </div>
            
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Écrivez votre code ici..."
              spellCheck={false}
            />
          </Card>

          <div className="terminal-card">
            <Terminal code={code} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
