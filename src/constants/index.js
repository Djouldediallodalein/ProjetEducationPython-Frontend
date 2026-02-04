export const DOMAINS = [
  { id: 'python', name: 'Python', color: 'bg-blue-500', icon: 'Code' },
  { id: 'java', name: 'Java', color: 'bg-red-500', icon: 'Coffee' },
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-500', icon: 'Zap' },
  { id: 'html_css', name: 'HTML/CSS', color: 'bg-orange-500', icon: 'Layout' },
  { id: 'c', name: 'C', color: 'bg-gray-600', icon: 'Terminal' },
  { id: 'bdd', name: 'BDD', color: 'bg-green-500', icon: 'Database' },
  { id: 'algo', name: 'Algorithmes', color: 'bg-purple-500', icon: 'GitBranch' },
  { id: 'git', name: 'Git', color: 'bg-pink-500', icon: 'GitCommit' },
];

export const DIFFICULTY_LEVELS = [
  { value: 'debutant', label: 'Debutant', color: 'text-green-600' },
  { value: 'intermediaire', label: 'Intermediaire', color: 'text-yellow-600' },
  { value: 'avance', label: 'Avance', color: 'text-red-600' },
];

export const THEMES = [
  { id: 'clair', name: 'Clair', colors: ['#ffffff', '#f3f4f6'] },
  { id: 'sombre', name: 'Sombre', colors: ['#1f2937', '#111827'] },
  { id: 'bleu', name: 'Bleu', colors: ['#dbeafe', '#bfdbfe'] },
  { id: 'vert', name: 'Vert', colors: ['#d1fae5', '#a7f3d0'] },
  { id: 'violet', name: 'Violet', colors: ['#ede9fe', '#ddd6fe'] },
];

export const BADGE_TYPES = {
  BEGINNER: 'debutant',
  INTERMEDIATE: 'intermediaire',
  EXPERT: 'expert',
  MASTER: 'maitre',
  STREAK: 'serie',
  CHALLENGE: 'defi',
};

export const XP_THRESHOLDS = {
  LEVEL_1: 0,
  LEVEL_2: 100,
  LEVEL_3: 300,
  LEVEL_4: 600,
  LEVEL_5: 1000,
  LEVEL_10: 5000,
  LEVEL_20: 20000,
};
