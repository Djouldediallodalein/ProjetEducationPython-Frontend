# Frontend - Python Education Platform

Application React moderne pour la plateforme d'education Python.

## Installation

```bash
npm install
```

## Configuration

Copier le fichier `.env.example` vers `.env` et configurer l'URL de l'API:

```bash
cp .env.example .env
```

## Lancement

```bash
# Mode developpement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## Structure

```
src/
├── components/       # Composants reutilisables
│   ├── common/      # Composants UI de base
│   └── layout/      # Layout et navigation
├── contexts/        # Contextes React (User, Theme)
├── pages/           # Pages de l'application
├── services/        # Services API
├── utils/           # Fonctions utilitaires
└── constants/       # Constantes
```

## Technologies

- React 18
- React Router v6
- Tailwind CSS
- Axios
- Vite

## Pages

- `/` - Login
- `/dashboard` - Tableau de bord
- `/exercises` - Exercices
- `/progression` - Progression par domaine
- `/badges` - Collection de badges
- `/quests` - Quetes actives et terminees
- `/leaderboard` - Classement
- `/profile` - Profil utilisateur

## API Backend

Le frontend communique avec le backend Flask sur `http://localhost:5000`.

Assurez-vous que le backend est lance avant d'utiliser l'application.
