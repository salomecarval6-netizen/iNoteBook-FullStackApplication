//Global react state so that each componnet can access it thus preventing need to pass it via prop to each component
import { createContext, useState } from "react";

const AuthContext = createContext();

// Keeps the auth token in React state (and localStorage) so the NavBar and other components re-render instantly on login / logout
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
