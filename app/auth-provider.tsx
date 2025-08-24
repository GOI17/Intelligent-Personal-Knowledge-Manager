'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, CreateUserInput, DBUser } from '@/types';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = await db.users.get({ email });
    
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: CreateUserInput) => {
    const existingUser = await db.users.get({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: DBUser = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      password: await hashPassword(userData.password),
    };

    await db.users.add(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
