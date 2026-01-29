
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundAlt: string;
    text: string;
    textSecondary: string;
    card: string;
    cardBackground: string;
    highlight: string;
    success: string;
    border: string;
  };
}

const darkColors = {
  primary: '#60A5FA',
  secondary: '#0F172A',
  accent: '#1E293B',
  background: '#0F172A',
  backgroundAlt: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#CBD5E1',
  card: '#1E293B',
  cardBackground: '#1E293B',
  highlight: '#3B82F6',
  success: '#10B981',
  border: '#334155',
};

const lightColors = {
  primary: '#60A5FA',
  secondary: '#F8FAFC',
  accent: '#F1F5F9',
  background: '#FFFFFF',
  backgroundAlt: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  card: '#F8FAFC',
  cardBackground: '#F8FAFC',
  highlight: '#3B82F6',
  success: '#10B981',
  border: '#E2E8F0',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    console.log('User toggled theme from', theme, 'to', theme === 'dark' ? 'light' : 'dark');
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
