import { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const theme = {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode ? {
      bg: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      card: '#242424',
      gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      primary: '#667eea',
      success: '#10b981',
      danger: '#ef4444',
      info: '#3b82f6'
    } : {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'white',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e5e7eb',
      card: 'white',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      primary: '#667eea',
      success: '#10b981',
      danger: '#ef4444',
      info: '#3b82f6'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
