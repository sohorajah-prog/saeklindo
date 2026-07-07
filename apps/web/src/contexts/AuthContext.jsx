
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load check
    setIsAuthenticated(pb.authStore.isValid);
    setCurrentUser(pb.authStore.model);
    setIsLoading(false);

    // Subscribe to auth state changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      setIsAuthenticated(!!token);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
