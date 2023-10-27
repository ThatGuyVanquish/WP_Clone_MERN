import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create a context for stats data.
const StatsContext = createContext();

/**
 * Provider component for managing stats data.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export function StatsProvider({ children }) {
  // State for managing admin, author, and subscriber stats data.
  const [adminStats, setAdminStats] = useState([]);
  const [authorStats, setAuthorStats] = useState([]);
  const [subscriberStats, setSubscriberStats] = useState([]);

  /**
   * Fetch stats data based on the user's role and update the corresponding state.
   * @function
   * @param {number} userID - The user's unique identifier.
   * @param {string} role - The user's role (Admin, Author, Subscriber).
   */
  const fetchStats = async (userID = 0, role = "") => {
    try {
      const url = userID ? `/numbers/${userID}` : "/numbers";
      const { data } = await axios.get(url);
      switch (role) {
        case "Subscriber":
          setSubscriberStats(data);
          break;
        case "Author":
          setAuthorStats(data);
          break;
        default:
          setAdminStats(data);
      }
      return data;
    } catch (err) {
      toast.error(`Failed to fetch stats for user: ${err.message}`);
    }
  };

  return (
    <StatsContext.Provider
      value={{
        adminStats,
        setAdminStats,
        authorStats,
        setAuthorStats,
        subscriberStats,
        setSubscriberStats,
        fetchStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

/**
 * Custom hook for accessing stats data and operations.
 * @returns {object} - An object containing stats data and related functions.
 */
export function useStats() {
  return useContext(StatsContext);
}
