import React, { createContext, useState, useContext, useEffect } from "react";

const THEMES = {
  retro: {
    name: "Retro",
    primary: "#667eea",
    secondary: "#764ba2",
    background: "#1a1a2e",
    surface: "#16213e",
    text: "#e94560",
  },
  neon: {
    name: "Neon",
    primary: "#00f5ff",
    secondary: "#ff00f5",
    background: "#0a0a0f",
    surface: "#151520",
    text: "#ffffff",
  },
  forest: {
    name: "Forest",
    primary: "#52b788",
    secondary: "#2d6a4f",
    background: "#081c15",
    surface: "#1b4332",
    text: "#d8f3dc",
  },
  sunset: {
    name: "Sunset",
    primary: "#ff6b6b",
    secondary: "#ee5a6f",
    background: "#2c003e",
    surface: "#3e0052",
    text: "#ffe66d",
  },
  ocean: {
    name: "Ocean",
    primary: "#4cc9f0",
    secondary: "#4361ee",
    background: "#03045e",
    surface: "#023e8a",
    text: "#caf0f8",
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("retro");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && THEMES[storedTheme]) {
      setCurrentTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const theme = THEMES[currentTheme];
    if (theme) {
      document.documentElement.style.setProperty("--color-primary", theme.primary);
      document.documentElement.style.setProperty("--color-secondary", theme.secondary);
      document.documentElement.style.setProperty("--color-background", theme.background);
      document.documentElement.style.setProperty("--color-surface", theme.surface);
      document.documentElement.style.setProperty("--color-text", theme.text);
    }
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem("theme", themeName);
    }
  };

  const value = {
    currentTheme,
    themes: THEMES,
    changeTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
