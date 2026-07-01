import { createContext, useContext, useState } from "react";
import { getCurrentUser } from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      // TODO: also persist this to your backend / localStorage here,
      // e.g. localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}