import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CamperUser, UserStats, UserBadge, UserLogEntry } from '../types/user';
import { api } from '../services/apiClient';

interface AuthContextType {
  user: CamperUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (payload: { email: string; name?: string; avatar?: string; googleId?: string }) => Promise<void>;
  register: (payload: { email: string; password: string; name: string; avatar?: string; bio?: string; primary_vehicle?: string }) => Promise<void>;

  logout: () => void;
  refreshUser: () => Promise<void>;
  stats: UserStats;
  badges: UserBadge[];
  logs: UserLogEntry[];
  addLogEntry: (payload: any) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAddLogModalOpen: boolean;
  setIsAddLogModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CamperUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalNights: 0,
    totalSteps: 0,
    totalKm: 0,
    spotsExplored: 0
  });
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [logs, setLogs] = useState<UserLogEntry[]>([]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);

  const loadUserData = async () => {
    try {
      const me = await api.getMe();
      if (me) {
        setUser(me);
        const statsData = await api.getStats();
        setStats(statsData.stats);
        setBadges(statsData.badges);
        const logsData = await api.getLogs();
        setLogs(logsData);
      }
    } catch (e) {
      console.warn('Could not load user data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const login = async (payload: { email: string; password: string }) => {
    const res = await api.login(payload);
    setUser(res.user);
    setStats(res.user.stats);
    await loadUserData();
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (payload: { email: string; name?: string; avatar?: string; googleId?: string }) => {
    const res = await api.loginWithGoogle(payload);
    setUser(res.user);
    setStats(res.user.stats);
    await loadUserData();
    setIsAuthModalOpen(false);
  };

  const register = async (payload: { email: string; password: string; name: string; avatar?: string; bio?: string; primary_vehicle?: string }) => {

    const res = await api.register(payload);
    setUser(res.user);
    setStats(res.user.stats);
    await loadUserData();
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setStats({ totalNights: 0, totalSteps: 0, totalKm: 0, spotsExplored: 0 });
    setBadges([]);
    setLogs([]);
    setIsProfileOpen(false);
  };

  const refreshUser = async () => {
    await loadUserData();
  };

  const addLogEntry = async (payload: any) => {
    const res = await api.addLogEntry(payload);
    if (res.log) {
      setLogs(prev => [res.log, ...prev]);
    }
    if (res.stats) {
      setStats(res.stats);
    }
    await loadUserData();
    setIsAddLogModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,

        refreshUser,
        stats,
        badges,
        logs,
        addLogEntry,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAddLogModalOpen,
        setIsAddLogModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
