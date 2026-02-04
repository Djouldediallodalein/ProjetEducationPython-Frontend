import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  health: () => api.get('/health'),

  exercises: {
    generate: (domain, difficulty) => 
      api.post('/exercices/generer', { domaine: domain, difficulte: difficulty }),
    execute: (code) => 
      api.post('/exercices/executer', { code }),
  },

  domains: {
    getAll: () => api.get('/domaines'),
    getProgress: (userId, domain) => 
      api.get(`/progression/${userId}/${domain}`),
  },

  users: {
    create: (username) => 
      api.post('/utilisateurs', { nom: username }),
    get: (userId) => 
      api.get(`/utilisateurs/${userId}`),
    getAll: () => 
      api.get('/utilisateurs'),
  },

  progression: {
    update: (userId, domain, success) => 
      api.post('/progression/mettre-a-jour', { 
        utilisateur_id: userId, 
        domaine: domain, 
        succes: success 
      }),
    getStats: (userId) => 
      api.get(`/progression/statistiques/${userId}`),
  },

  xp: {
    add: (userId, amount, reason) => 
      api.post('/xp/ajouter', { 
        utilisateur_id: userId, 
        montant: amount, 
        raison: reason 
      }),
    getLevel: (userId) => 
      api.get(`/xp/niveau/${userId}`),
  },

  badges: {
    getAll: (userId) => 
      api.get(`/badges/${userId}`),
    check: (userId) => 
      api.post('/badges/verifier', { utilisateur_id: userId }),
  },

  leaderboard: {
    get: () => api.get('/classement'),
  },

  quests: {
    getActive: (userId) => 
      api.get(`/quetes/actives/${userId}`),
    getCompleted: (userId) => 
      api.get(`/quetes/terminees/${userId}`),
  },

  analytics: {
    get: (userId) => 
      api.get(`/analytics/${userId}`),
  },

  challenges: {
    getDaily: () => api.get('/defis/quotidien'),
    complete: (userId, challengeId) => 
      api.post('/defis/completer', { 
        utilisateur_id: userId, 
        defi_id: challengeId 
      }),
  },
};

export default api;
