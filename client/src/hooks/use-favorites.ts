import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'seaboo_favorites_moorings';

export function useMooringFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = (mooringId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(mooringId)
        ? prev.filter((id) => id !== mooringId)
        : [...prev, mooringId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (mooringId: string) => favorites.includes(mooringId);

  return { favorites, toggleFavorite, isFavorite };
}
