import { useState, createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { fetchUserProfile } from "../Services/user-services";
type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, rememberMe?:boolean) => void;
  logout: () => void;
  profile?: any;
  loading?: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => Cookies.get("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
console.log("AuthProvider render, token:", token, "isAuthenticated:", isAuthenticated);
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

   useEffect(() => {
      if (token) {
        fetchUserProfile(token)
          .then((data) => setProfile(data))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    }, [token]);

  const login = (newToken: string, rememberMe?: boolean) => {
    if (rememberMe) {
      Cookies.set("token", newToken, { expires: 6 }); 
    } else {
      Cookies.set("token", newToken); 
    }
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};