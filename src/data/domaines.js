/**
 * Domaines d'apprentissage disponibles dans Nexia
 * Données hardcodées pour développement rapide
 */

export const domaines = {
  python: {
    id: "python",
    nom: "Python",
    emoji: "🐍",
    type: "Langage de programmation",
    description: "Langage polyvalent, idéal pour débuter",
    couleur: "#3776ab",
    popularite: 1
  },
  javascript: {
    id: "javascript",
    nom: "JavaScript",
    emoji: "⚡",
    type: "Langage de programmation",
    description: "Le langage du web moderne",
    couleur: "#f7df1e",
    popularite: 2
  },
  anglais: {
    id: "anglais",
    nom: "Anglais",
    emoji: "🇬🇧",
    type: "Langue",
    description: "La langue internationale par excellence",
    couleur: "#012169",
    popularite: 3
  },
  mathematiques: {
    id: "mathematiques",
    nom: "Mathématiques",
    emoji: "🔢",
    type: "Sciences",
    description: "Logique, algèbre et raisonnement",
    couleur: "#ff6b6b",
    popularite: 4
  },
  sql: {
    id: "sql",
    nom: "SQL",
    emoji: "🗃️",
    type: "Base de données",
    description: "Gérer et interroger les bases de données",
    couleur: "#00758f",
    popularite: 5
  },
  html_css: {
    id: "html_css",
    nom: "HTML/CSS",
    emoji: "🎨",
    type: "Web Design",
    description: "Créer des interfaces web élégantes",
    couleur: "#e34c26",
    popularite: 6
  }
};

export const getDomainesList = () => Object.values(domaines);

export const getDomaineById = (id) => domaines[id] || null;
