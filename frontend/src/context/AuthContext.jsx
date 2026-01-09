import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(
    userInfo ? JSON.parse(userInfo) : null
  );

  // Check if user is logged in on mount
  useEffect(() => {
    if (token && userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

