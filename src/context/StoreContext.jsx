import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStores } from '../services/api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [stores, setStores] = useState([]);
  const [selectedCity, setSelectedCity] = useState('İstanbul');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load stores on mount via native fetch
  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        const data = await fetchStores();
        setStores(data);
        // Default to first store in selected city
        const defaultStore = data.find(s => s.city === 'İstanbul') || data[0];
        setSelectedStore(defaultStore);
      } catch (err) {
        console.error('Failed to load stores:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStores();
  }, []);

  // Update selected store when city changes if current store is not in that city
  const changeCity = (city) => {
    setSelectedCity(city);
    const storeInCity = stores.find(s => s.city.toLowerCase() === city.toLowerCase());
    if (storeInCity) {
      setSelectedStore(storeInCity);
    }
  };

  const selectStore = (store) => {
    setSelectedStore(store);
    setSelectedCity(store.city);
    setIsStoreModalOpen(false);
  };

  // Get unique list of available cities
  const cities = ['Tüm Şehirler', ...Array.from(new Set(stores.map(s => s.city)))];

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedCity,
        selectedStore,
        changeCity,
        selectStore,
        cities,
        loading,
        isStoreModalOpen,
        openStoreModal: () => setIsStoreModalOpen(true),
        closeStoreModal: () => setIsStoreModalOpen(false)
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
