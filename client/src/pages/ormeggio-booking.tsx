import { useQuery, useMutation } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMooringFavorites } from '@/hooks/use-favorites';
import { ImageCarousel } from '@/components/image-carousel';
import { apiRequest } from '@/lib/queryClient';
import { 
  Anchor, 
  MapPin, 
  Star, 
  Shield, 
  Wifi,
  Car,
  Fuel,
  Zap,
  Droplet,
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { Link, useRoute, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function OrmeggioBookingPage() {
  const [match, params] = useRoute('/ormeggio/:id');
  const mooringId = params?.id || '';
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useMooringFavorites();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const contactOwnerMutation = useMutation({
    mutationFn: async (info: { id: number; name: string; managerId: number }) => {
      const response = await apiRequest('POST', '/api/conversations/inquiry', {
        referenceType: 'mooring',
        referenceId: info.id,
        referenceName: info.name,
        ownerId: info.managerId,
      });
      return response.json();
    },
    onSuccess: () => {
      navigate('/messaging');
    },
    onError: () => {
      toast({ title: "Errore", description: "Devi accedere per contattare il proprietario", variant: "destructive" });
    },
  });

  const { data: mooring, isLoading, error } = useQuery<any>({
    queryKey: ['/api/moorings', mooringId],
    queryFn: async () => {
      const res = await fetch(`/api/moorings/${mooringId}`);
      if (!res.ok) throw new Error("Ormeggio non trovato");
      return res.json();
    },
    enabled: !!mooringId,
  });

  const handleShare = async () => {
    if (!mooring) return;
    const shareUrl = `${window.location.origin}/ormeggio/${mooring.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: mooring.name, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copiato!", description: "Il link è stato copiato negli appunti" });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl).catch(() => {});
        toast({ title: "Link copiato!", description: "Il link è stato copiato negli appunti" });
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!mooring) return;
    const wasFav = isFavorite(String(mooring.id));
    toggleFavorite(String(mooring.id));
    toast({
      title: wasFav ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: wasFav ? `${mooring.name} rimosso` : `${mooring.name} aggiunto`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!mooring || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Anchor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ormeggio Non Trovato</h2>
              <p className="text-gray-600 mb-6">L'ormeggio che stai cercando non esiste.</p>
              <Button asChild>
                <Link href="/ormeggio">Torna alla Lista Ormeggi</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const svc = (mooring.services as any) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Link href="/ormeggio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna agli ormeggi
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {mooring.images && mooring.images.length > 0 ? (
          <ImageCarousel
            images={mooring.images}
            alt={mooring.name}
            className="h-64 md:h-96 rounded-xl mb-6"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-xl mb-6">
            <Anchor className="h-16 w-16 text-blue-400" />
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{mooring.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{mooring.port} - {mooring.location}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleToggleFavorite}>
              <Heart className={`h-4 w-4 ${isFavorite(String(mooring.id)) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {mooring.rating && (
          <div className="flex items-center gap-1 mb-4">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="font-medium">{mooring.rating}</span>
            {mooring.reviewCount && <span className="text-sm text-gray-500">({mooring.reviewCount} recensioni)</span>}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {mooring.description && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2">Descrizione</h3>
                  <p className="text-gray-700">{mooring.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-3">Specifiche</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Max lunghezza</div>
                    <div className="font-bold text-lg">{mooring.maxLength}m</div>
                  </div>
                  {mooring.maxBeam && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Larghezza</div>
                      <div className="font-bold text-lg">{mooring.maxBeam}m</div>
                    </div>
                  )}
                  {mooring.depth && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Profondità</div>
                      <div className="font-bold text-lg">{mooring.depth}m</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Tipo</div>
                    <div className="font-bold text-lg">{mooring.type}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-3">Servizi disponibili</h3>
                <div className="flex flex-wrap gap-3">
                  {svc.security && <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" /> Sicurezza</Badge>}
                  {svc.fuel && <Badge variant="secondary"><Fuel className="h-3 w-3 mr-1" /> Carburante</Badge>}
                  {svc.water && <Badge variant="secondary"><Droplet className="h-3 w-3 mr-1" /> Acqua</Badge>}
                  {svc.electricity && <Badge variant="secondary"><Zap className="h-3 w-3 mr-1" /> Elettricità</Badge>}
                  {svc.wifi && <Badge variant="secondary"><Wifi className="h-3 w-3 mr-1" /> WiFi</Badge>}
                  {svc.parking && <Badge variant="secondary"><Car className="h-3 w-3 mr-1" /> Parcheggio</Badge>}
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Prenota ora</h3>
                  <Badge variant="outline" className="text-green-600 border-green-600">Disponibile</Badge>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">€{mooring.pricePerDay}</div>
                  <div className="text-gray-600">al giorno</div>
                </div>

                {(mooring.pricePerWeek || mooring.pricePerMonth) && (
                  <div className="space-y-2 text-sm">
                    {mooring.pricePerWeek && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Settimanale</span>
                        <span className="font-medium">€{mooring.pricePerWeek}</span>
                      </div>
                    )}
                    {mooring.pricePerMonth && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mensile</span>
                        <span className="font-medium">€{mooring.pricePerMonth}</span>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  className="w-full bg-ocean-blue hover:bg-blue-600 h-12 text-lg font-semibold"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Accedi", description: "Devi accedere per prenotare", variant: "destructive" });
                      return;
                    }
                    navigate(`/checkout?type=mooring&id=${mooring.id}`);
                  }}
                >
                  Prenota ora
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Accedi", description: "Devi accedere per contattare il proprietario", variant: "destructive" });
                      return;
                    }
                    contactOwnerMutation.mutate({
                      id: mooring.id,
                      name: mooring.name,
                      managerId: mooring.managerId,
                    });
                  }}
                  disabled={contactOwnerMutation.isPending}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {contactOwnerMutation.isPending ? "Apertura chat..." : "Contatta il proprietario"}
                </Button>

                <div className="text-center text-sm text-gray-500 space-y-1 pt-2">
                  <p>Prenotazione sicura con Stripe</p>
                  <p>Cancellazione gratuita fino a 24h prima</p>
                </div>

                {mooring.contactName && (
                  <div className="pt-4 border-t text-sm text-gray-600">
                    <div className="font-medium text-gray-900 mb-1">Proprietario</div>
                    <div>{mooring.contactName}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
