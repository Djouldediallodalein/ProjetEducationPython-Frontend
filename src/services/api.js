import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Logging amélioré pour le debug
console.log("🌐 API configurée sur:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Erreur de requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("⚠️ Impossible de joindre le Backend sur", API_BASE_URL);
      console.error("Vérifiez que le serveur Flask tourne sur le port 5000");
      error.message = "Impossible de contacter le serveur. Vérifiez que le backend est démarré.";
    } else {
      console.error("❌ Erreur API:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  auth: {
    login: (username, password) => api.post("/auth/login", { username, password }),
    register: (username, email, password) => api.post("/auth/register", { username, email, password }),
  },

  users: {
    getProfile: (userId) => api.get(`/users/${userId}`),
    updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
    getStats: (userId) => api.get(`/users/${userId}/stats`),
  },

  exercises: {
    getAll: (params) => api.get("/exercises", { params }),
    getById: (exerciseId) => api.get(`/exercises/${exerciseId}`),
    submit: (exerciseId, code) => api.post(`/exercises/${exerciseId}/submit`, { code }),
  },

  progression: {
    get: (userId) => api.get(`/users/${userId}/progression`),
    update: (userId, data) => api.put(`/users/${userId}/progression`, data),
  },

  badges: {
    getUserBadges: (userId) => api.get(`/users/${userId}/badges`),
    getAll: () => api.get("/badges"),
  },

  quests: {
    getAll: () => api.get("/quests"),
    getById: (questId) => api.get(`/quests/${questId}`),
    getUserQuests: (userId) => api.get(`/users/${userId}/quests`),
    complete: (questId) => api.post(`/quests/${questId}/complete`),
  },

  leaderboard: {
    getTop: (limit = 100) => api.get("/leaderboard", { params: { limit } }),
  },

  domaines: {
    getAll: () => api.get("/domaines"),
    getThemes: (domaineId) => api.get(`/domaines/${domaineId}/themes`),
  },
};

export default api;
