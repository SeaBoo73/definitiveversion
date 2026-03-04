import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function useFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();

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
      toast({ title: "Aggiunto ai preferiti" });
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message === "Non autorizzato") {
        toast({
          title: "Accesso richiesto",
          description: "Devi essere loggato per salvare i preferiti",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Errore",
          description: "Impossibile aggiungere ai preferiti",
          variant: "destructive",
        });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({ itemType, itemId }: { itemType: string; itemId: number }) => {
      return await apiRequest("DELETE", "/api/favorites", { itemType, itemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({ title: "Rimosso dai preferiti" });
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message === "Non autorizzato") {
        toast({
          title: "Accesso richiesto",
          description: "Devi essere loggato per gestire i preferiti",
          variant: "destructive",
        });
      }
    },
  });

  const isFavorite = (itemType: string, itemId: number) => {
    return favorites.some((f: any) => f.itemType === itemType && f.itemId === itemId);
  };

  const toggleFavorite = (itemType: string, itemId: number) => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere loggato per salvare i preferiti",
        variant: "destructive",
      });
      return;
    }
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

export function useMooringFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{ favorites: any[] }>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  const favorites = data?.favorites || [];

  const addMutation = useMutation({
    mutationFn: async ({ mooringId, title }: { mooringId: string; title: string }) => {
      return await apiRequest("POST", "/api/favorites", { itemType: "mooring", itemId: Number(mooringId) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message === "Non autorizzato") {
        toast({
          title: "Accesso richiesto",
          description: "Devi essere loggato per salvare i preferiti",
          variant: "destructive",
        });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({ mooringId }: { mooringId: string }) => {
      return await apiRequest("DELETE", "/api/favorites", { itemType: "mooring", itemId: Number(mooringId) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {},
  });

  const isFavorite = (mooringId: string) => {
    return favorites.some((f: any) => f.itemType === "mooring" && String(f.itemId) === mooringId);
  };

  const toggleFavorite = (mooringId: string, title?: string): boolean => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere loggato per salvare i preferiti",
        variant: "destructive",
      });
      return false;
    }
    const alreadyFav = isFavorite(mooringId);
    if (alreadyFav) {
      removeMutation.mutate({ mooringId });
      return false;
    } else {
      addMutation.mutate({ mooringId, title: title || "Ormeggio" });
      return true;
    }
  };

  return { favorites, isLoading, toggleFavorite, isFavorite };
}
