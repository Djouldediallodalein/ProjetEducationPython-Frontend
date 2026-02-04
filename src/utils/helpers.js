export const calculateLevel = (xp) => {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2100) return 6;
  if (xp < 2800) return 7;
  if (xp < 3600) return 8;
  if (xp < 4500) return 9;
  if (xp < 5500) return 10;
  return 10 + Math.floor((xp - 5500) / 1000);
};

export const getXpForNextLevel = (currentXp) => {
  const level = calculateLevel(currentXp);
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
  
  if (level <= 10) {
    return thresholds[level];
  }
  return 5500 + (level - 10) * 1000;
};

export const getProgressPercentage = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  const currentThreshold = currentLevel <= 10 
    ? [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500][currentLevel - 1]
    : 5500 + (currentLevel - 11) * 1000;
  const nextThreshold = getXpForNextLevel(currentXp);
  
  const progress = ((currentXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getSuccessRate = (total, success) => {
  if (total === 0) return 0;
  return Math.round((success / total) * 100);
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    debutant: 'text-green-600 bg-green-100',
    intermediaire: 'text-yellow-600 bg-yellow-100',
    avance: 'text-red-600 bg-red-100',
  };
  return colors[difficulty] || 'text-gray-600 bg-gray-100';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
