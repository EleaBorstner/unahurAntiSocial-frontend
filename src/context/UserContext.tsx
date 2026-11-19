import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

const STORAGE_KEY = "unahur_antisocial_user"

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {

  // 1. Al cargar la app, revisamos si hay un usuario en localStorage
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? (JSON.parse(saved) as User) : null;
    } catch {
        return null;
    }
  })

  useEffect(() => {
    try {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    } catch (err) {
        console.error("Error al persistir usuario en la localStorage:", err)
    }
  }, [user]);

  // 2. Función para cuando el usuario se loguea
  const login = (userData: User) => {
    setUser(userData);
  };

  // 3. Función para cerrar sesión
  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para consumir el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};