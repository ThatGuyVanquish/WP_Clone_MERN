import { useEffect, useState, createContext, useContext } from "react";

// Create a context for managing theme data.
const ThemeContext = createContext();

/**
 * Provider component for managing the application theme.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export const ThemeProvider = ({ children }) => {
  // State for managing the current theme (light or dark).
  const [theme, setTheme] = useState("light");

  /**
   * useEffect hook to set the theme from localStorage when the component mounts.
   * @function
   */
  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook for accessing theme data and operations.
 * @returns {object} - An object containing the current theme and theme-setting function.
 */
export function useTheme() {
  return useContext(ThemeContext);
}
