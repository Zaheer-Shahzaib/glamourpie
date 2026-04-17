import { useState, createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { fetchUserProfile } from "../Services/user-services";
import { api } from "../Services/api";
import { UserProfile } from "../types/profile.types";
type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  profile?: UserProfile | null;
  loading?: boolean;
  isSellerConnected?: boolean | null;
  refreshSellerStatus?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => Cookies.get("token") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSellerConnected, setIsSellerConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(
    "AuthProvider render, token:",
    token,
    "isAuthenticated:",
    isAuthenticated
  );
  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  const fetchStatus = async (authToken: string) => {
    try {
      const response = await api.get('/api/aws/seller-status', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setIsSellerConnected(response.data.isConnected);
    } catch (err) {
      console.error('Failed to fetch seller status:', err);
      setIsSellerConnected(false);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([
        fetchUserProfile(token),
        fetchStatus(token)
      ])
        .then(([userData]) => {
          setProfile(userData);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setProfile(null);
      setIsSellerConnected(null);
      setLoading(false);
    }
  }, [token]);

  const refreshSellerStatus = async () => {
    if (token) {
      await fetchStatus(token);
    }
  };

  const login = (newToken: string, rememberMe?: boolean) => {
    if (rememberMe) {
      Cookies.set("token", newToken, { expires: 30 });
    } else {
      Cookies.set("token", newToken);
    }
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post("/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log("Logout error (ignored):", err);
    }

    Cookies.remove("token");
    setToken(null);
    setIsAuthenticated(false);
    window.location.reload();
  };


  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, login, logout, profile, loading, isSellerConnected, refreshSellerStatus }}
    >
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
