import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { apiService } from "../services/api";
import { Card, Button, Input, Alert } from "../components/common";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;
      if (isRegister) {
        response = await apiService.auth.register(formData.username, formData.email, formData.password);
      } else {
        response = await apiService.auth.login(formData.username, formData.password);
      }
      
      // Stocker les tokens et l'utilisateur
      const { user, access_token, refresh_token } = response.data.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      login(user);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1 className="login-title">🚀 Nexia</h1>
          <p className="login-subtitle">L'apprentissage universel par l'IA</p>
        </div>

        <Card className="login-card">
          <h2 className="login-form-title">{isRegister ? "Créer un compte" : "Connexion"}</h2>

          {error && <Alert type="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Nom d'utilisateur"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            {isRegister && (
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            )}

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="primary" disabled={loading} className="login-button">
              {loading ? "Chargement..." : isRegister ? "S'inscrire" : "Se connecter"}
            </Button>
          </form>

          <div className="login-toggle">
            <button onClick={() => setIsRegister(!isRegister)} className="login-toggle-button">
              {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
