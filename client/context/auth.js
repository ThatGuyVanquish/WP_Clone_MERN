import { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

/**
 * Authentication provider component that manages the user's authentication state.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export const AuthProvider = ({ children }) => {
  // state
  const [auth, setAuth] = useState({ user: null, token: "" });

  // Configure Axios based on the authentication token.
  if (process.server) {
    axios.defaults.baseURL = process.env.API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.token}`;
  } else {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.token}`;
  }

  // Load authentication data from local storage on component mount.

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(JSON.parse(localStorage.getItem("auth")));
    }
  }, []); // empty array = default behavior

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for accessing the authentication context.
 * @returns {Array} An array containing the authentication state and setter function.
 */
export function useAuth() {
  return useContext(AuthContext);
}
