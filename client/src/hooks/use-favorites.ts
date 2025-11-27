import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'seaboo_favorites_moorings';

interface FavoriteItem {
  id: string;
  title: string;
}

export function useMooringFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (typeof parsed[0] === 'string') {
            setFavorites(parsed.map(id => ({ id, title: 'Ormeggio' })));
          } else {
            setFavorites(parsed);
          }
        }
      } catch (e) {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (mooringId: string, title?: string): boolean => {
    const currentFavorites = favorites;
    const exists = currentFavorites.some(f => f.id === mooringId);
    const wasAdded = !exists;
    
    setFavorites(() => {
      let newFavorites: FavoriteItem[];
      if (exists) {
        newFavorites = currentFavorites.filter((f) => f.id !== mooringId);
      } else {
        newFavorites = [...currentFavorites, { id: mooringId, title: title || 'Ormeggio' }];
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
    return wasAdded;
  };

  const isFavorite = (mooringId: string) => favorites.some(f => f.id === mooringId);

  return { favorites, toggleFavorite, isFavorite };
}
