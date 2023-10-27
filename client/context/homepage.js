import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context
const HomepageContext = createContext();

/**
 * Provider component for managing homepage data.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export function HomepageProvider({ children }) {
  // State for managing homepage data.
  const [homepage, setHomepage] = useState({});

  /**
   * Custom hook for fetching and updating homepage data.
   * @function
   */
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const { data } = await axios.get("/page/home");
        setHomepage(data);
      } catch (err) {
        // Handle errors if needed
      }
    };
    fetchHomepageData();
  }, []);

  return (
    <HomepageContext.Provider value={{ homepage, setHomepage }}>
      {children}
    </HomepageContext.Provider>
  );
}

/**
 * Custom hook for accessing homepage data.
 * @returns {object} An object containing homepage data.
 */
export function useHomepage() {
  // Access homepage data from the context.
  return useContext(HomepageContext);
}
