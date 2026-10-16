import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const updateProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  const addAddress = (newAddress) => {
    setUser(prev => ({
      ...prev,
      addresses: [...prev.addresses, { ...newAddress, id: `addr-${Date.now()}` }]
    }));
  };

  const setDefaultAddress = (addressId) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a => ({
        ...a,
        isDefault: a.id === addressId
      }))
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        updateProfile,
        addAddress,
        setDefaultAddress
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
