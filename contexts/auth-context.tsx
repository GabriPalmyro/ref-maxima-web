'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Mentor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  token: string | null;
  mentor: Mentor | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateMentor: (updated: Partial<Mentor>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedMentor = localStorage.getItem('mentor');
    if (storedToken) setToken(storedToken);
    if (storedMentor) setMentor(JSON.parse(storedMentor));
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    document.cookie = `token=${newToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    setToken(newToken);
    const profile = await api.get<Mentor>('/mentor/profile');
    localStorage.setItem('mentor', JSON.stringify(profile));
    setMentor(profile);
  };

  const updateMentor = (updated: Partial<Mentor>) => {
    setMentor((prev) => {
      if (!prev) return prev;
      const merged = { ...prev, ...updated };
      localStorage.setItem('mentor', JSON.stringify(merged));
      return merged;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mentor');
    document.cookie = 'token=; path=/; max-age=0';
    setToken(null);
    setMentor(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ token, mentor, login, logout, updateMentor }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
