import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFinance } from './FinanceContext';

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { userProfile, updateProfile } = useFinance();

  // Load theme preference from user profile
  useEffect(() => {
    if (userProfile && userProfile.preferences) {
      setDarkMode(userProfile.preferences.darkMode || false);
    }
    
    // Apply theme to document
    applyTheme(userProfile?.preferences?.darkMode || false);
  }, [userProfile]);

  // Function to toggle dark mode
  const toggleDarkMode = async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    
    // Save preference to user profile if logged in
    if (userProfile) {
      try {
        const preferences = {
          ...(userProfile.preferences || {}),
          darkMode: newDarkMode
        };
        
        await updateProfile({ preferences });
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };
  
  // Function to apply theme to document
  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Value to be provided by the context
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
