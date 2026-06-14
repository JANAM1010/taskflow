import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

const accentColors = {
  '#6366f1': { primary: '#6366f1', hover: '#4f46e5' },
  '#10b981': { primary: '#10b981', hover: '#059669' },
  '#f59e0b': { primary: '#f59e0b', hover: '#d97706' },
  '#ef4444': { primary: '#ef4444', hover: '#dc2626' },
  '#8b5cf6': { primary: '#8b5cf6', hover: '#7c3aed' },
  '#06b6d4': { primary: '#06b6d4', hover: '#0891b2' },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('taskflow_darkmode') === 'true';
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('taskflow_accent') || '#6366f1';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('taskflow_darkmode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('taskflow_accent', accentColor);
  }, [accentColor]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      darkMode, toggleDarkMode, accentColor, setAccentColor, accentColors
    }}>
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);