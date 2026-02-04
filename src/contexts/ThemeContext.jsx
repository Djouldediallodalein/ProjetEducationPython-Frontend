import React, { createContext, useContext, useState } from 'react';
import { THEMES } from '../constants';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('theme') || 'clair'
  );

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
  };

  const theme = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};
