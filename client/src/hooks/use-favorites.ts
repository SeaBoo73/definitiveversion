import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

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

export function useFavorites() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<{ favorites: any[] }>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  const favorites = data?.favorites || [];

  const addMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: number }) => {
      return await apiRequest("POST", "/api/favorites", { itemType, itemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: number }) => {
      return await apiRequest("DELETE", "/api/favorites", { itemType, itemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const isFavorite = (itemType: string, itemId: number) => {
    return favorites.some((f: any) => f.itemType === itemType && f.itemId === itemId);
  };

  const toggleFavorite = (itemType: string, itemId: number) => {
    if (isFavorite(itemType, itemId)) {
      removeMutation.mutate({ itemType, itemId });
    } else {
      addMutation.mutate({ itemType, itemId });
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
}
