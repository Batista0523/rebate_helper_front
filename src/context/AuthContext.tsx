import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

type RebateUser = {
  id: number;
  name?: string | null;
  email: string;
  created_at: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: RebateUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<RebateUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

 
  const baseUrl =
    import.meta.env.VITE_BASE_URL
    
  const loginEndpoint =
    import.meta.env.VITE_LOGING_ENPOING                

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${baseUrl}/${loginEndpoint}`, {
        email,
        password,
      });

      const payload: RebateUser | undefined = data?.payload;
      if (!payload || !payload.id || !payload.email) {
        throw new Error("Invalid user data received");
      }

      setUser(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
     
      throw new Error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
