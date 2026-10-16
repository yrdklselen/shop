import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nova_favorites');
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-04'];
    } catch {
      return ['prod-01', 'prod-04'];
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.some(id => (typeof id === 'string' ? id === product.id : id.id === product.id));
      if (exists) {
        return prev.filter(id => (typeof id === 'string' ? id !== product.id : id.id !== product.id));
      } else {
        return [...prev, product.id];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.some(id => (typeof id === 'string' ? id === productId : id.id === productId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isFavoritesOpen,
        openFavorites: () => setIsFavoritesOpen(true),
        closeFavorites: () => setIsFavoritesOpen(false),
        favoriteCount: favorites.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
