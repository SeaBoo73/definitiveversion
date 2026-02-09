import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { 
  Heart, 
  Ship, 
  Anchor, 
  Compass,
  ArrowLeft, 
  MapPin,
  Star,
  Trash2
} from "lucide-react";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { favorites, isLoading, toggleFavorite, isToggling } = useFavorites();

  const { data: boatsData } = useQuery<any[]>({
    queryKey: ["/api/boats"],
  });

  const { data: experiencesData } = useQuery<any[]>({
    queryKey: ["/api/experiences"],
  });

  const boats = boatsData || [];
  const experiences = experiencesData || [];

  const favoriteBoats = favorites
    .filter((f: any) => f.itemType === 'boat')
    .map((f: any) => {
      const boat = boats.find((b: any) => b.id === f.itemId);
      return boat ? { ...boat, favoriteId: f.id, addedAt: f.createdAt } : null;
    })
    .filter(Boolean);

  const favoriteMoorings = favorites
    .filter((f: any) => f.itemType === 'mooring')
    .map((f: any) => ({ itemId: f.itemId, favoriteId: f.id, addedAt: f.createdAt }));

  const favoriteExperiences = favorites
    .filter((f: any) => f.itemType === 'experience')
    .map((f: any) => {
      const exp = experiences.find((e: any) => e.id === f.itemId);
      return exp ? { ...exp, favoriteId: f.id, addedAt: f.createdAt } : null;
    })
    .filter(Boolean);

  const totalCount = favoriteBoats.length + favoriteMoorings.length + favoriteExperiences.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profilo')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">I tuoi preferiti</h1>
            <p className="text-gray-500 text-sm">{totalCount} {totalCount === 1 ? 'elemento salvato' : 'elementi salvati'}</p>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Caricamento...</p>
            </CardContent>
          </Card>
        ) : totalCount === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Heart className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">Nessun preferito salvato</p>
              <p className="text-gray-400 text-sm mt-2">
                Tocca il cuoricino su barche, ormeggi o esperienze per salvarli qui
              </p>
              <Link href="/">
                <Button className="mt-6 bg-ocean-blue hover:bg-blue-600">
                  Esplora le barche
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {favoriteBoats.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Ship className="h-5 w-5 text-ocean-blue" />
                  Imbarcazioni ({favoriteBoats.length})
                </h3>
                <div className="space-y-3">
                  {favoriteBoats.map((boat: any) => (
                    <Card key={boat.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-28 h-24 bg-gray-100 flex-shrink-0">
                            {boat.imageUrl ? (
                              <img src={boat.imageUrl} alt={boat.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Ship className="h-8 w-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-3 flex items-center justify-between">
                            <Link href={`/boats/${boat.id}`}>
                              <a className="flex-1">
                                <p className="font-semibold text-gray-900">{boat.name}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {boat.location}
                                </p>
                                {boat.pricePerDay && (
                                  <p className="text-sm font-semibold text-ocean-blue mt-1">€{boat.pricePerDay}/giorno</p>
                                )}
                              </a>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite('boat', boat.id)}
                              disabled={isToggling}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Heart className="h-5 w-5 fill-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {favoriteMoorings.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-ocean-blue" />
                  Ormeggi ({favoriteMoorings.length})
                </h3>
                <div className="space-y-3">
                  {favoriteMoorings.map((mooring: any) => (
                    <Card key={mooring.itemId}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Anchor className="h-5 w-5 text-ocean-blue" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Ormeggio #{mooring.itemId}</p>
                            <p className="text-xs text-gray-500">Salvato il {new Date(mooring.addedAt).toLocaleDateString('it-IT')}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite('mooring', mooring.itemId)}
                          disabled={isToggling}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Heart className="h-5 w-5 fill-red-500" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {favoriteExperiences.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-ocean-blue" />
                  Esperienze ({favoriteExperiences.length})
                </h3>
                <div className="space-y-3">
                  {favoriteExperiences.map((exp: any) => (
                    <Card key={exp.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Compass className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{exp.title || exp.name}</p>
                            {exp.location && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" /> {exp.location}
                              </p>
                            )}
                            {exp.price && (
                              <p className="text-sm font-semibold text-purple-600 mt-1">€{exp.price}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite('experience', exp.id)}
                          disabled={isToggling}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Heart className="h-5 w-5 fill-red-500" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
