import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useAuth } from "./use-auth";

type OwnerModeContextType = {
  isOwnerMode: boolean;
  toggleOwnerMode: () => void;
  enterOwnerMode: () => void;
  exitOwnerMode: () => void;
};

const OwnerModeContext = createContext<OwnerModeContextType | null>(null);

export function OwnerModeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isOwnerMode, setIsOwnerMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('seaboo_owner_mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      setIsOwnerMode(false);
      localStorage.removeItem('seaboo_owner_mode');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('seaboo_owner_mode', String(isOwnerMode));
  }, [isOwnerMode]);

  const toggleOwnerMode = () => setIsOwnerMode(prev => !prev);
  const enterOwnerMode = () => setIsOwnerMode(true);
  const exitOwnerMode = () => setIsOwnerMode(false);

  return (
    <OwnerModeContext.Provider value={{ isOwnerMode, toggleOwnerMode, enterOwnerMode, exitOwnerMode }}>
      {children}
    </OwnerModeContext.Provider>
  );
}

export function useOwnerMode() {
  const context = useContext(OwnerModeContext);
  if (!context) {
    throw new Error("useOwnerMode must be used within an OwnerModeProvider");
  }
  return context;
}
