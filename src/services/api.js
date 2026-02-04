import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      config.headers["X-User-Id"] = user.id;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
};

export default api;
