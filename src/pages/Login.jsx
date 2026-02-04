import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Button, Input, Alert } from '../../components/common';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser, setUsers } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.users.getAll();
      const users = response.data.utilisateurs || [];
      setUsers(users);

      const existingUser = users.find(u => u.nom.toLowerCase() === username.toLowerCase());

      if (existingUser) {
        loginUser(existingUser);
        navigate('/dashboard');
      } else {
        setError('Utilisateur non trouve. Veuillez creer un nouveau compte.');
        setIsCreating(true);
      }
    } catch (err) {
      setError('Erreur lors de la connexion. Verifiez que le backend est lance.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.users.create(username);
      const newUser = response.data.utilisateur;
      loginUser(newUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la creation du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Python Education</h1>
          <p className="text-gray-600 mt-2">Plateforme d'apprentissage interactive</p>
        </div>

        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={isCreating ? handleCreateUser : handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isCreating ? 'Nom d\'utilisateur' : 'Se connecter'}
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !username.trim()}
            >
              {loading ? 'Chargement...' : isCreating ? 'Creer le compte' : 'Connexion'}
            </Button>

            {isCreating && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setIsCreating(false);
                  setError('');
                }}
              >
                Retour
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Assurez-vous que le backend est lance sur http://localhost:5000</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
