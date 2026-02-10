import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageCarousel } from "@/components/image-carousel";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { 
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Euro,
  Calendar,
  Heart,
  CheckCircle2,
  Mail,
  MessageCircle,
  Loader2,
  Minus,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import type { Experience } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  sunset: "Tramonto",
  fishing: "Pesca",
  diving: "Immersione",
  aperitivo: "Aperitivo",
  tour: "Tour",
  sport: "Sport",
  romantic: "Romantico",
};

export default function EsperienzaDettaglio() {
  const [match, params] = useRoute("/esperienza/:id");
  const id = params?.id || "";
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [participants, setParticipants] = useState(1);

  const contactOwnerMutation = useMutation({
    mutationFn: async (info: { id: number; name: string; hostId: number }) => {
      const response = await apiRequest('POST', '/api/conversations/inquiry', {
        referenceType: 'experience',
        referenceId: info.id,
        referenceName: info.name,
        ownerId: info.hostId,
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

  const { data: experience, isLoading, error } = useQuery<Experience>({
    queryKey: ['/api/experiences', id],
    queryFn: async () => {
      const res = await fetch(`/api/experiences/${id}`);
      if (!res.ok) throw new Error("Esperienza non trovata");
      return res.json();
    },
    enabled: !!id,
  });

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

  if (!experience || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Esperienza non trovata</h1>
          <Button asChild>
            <Link href="/esperienze">Torna alle esperienze</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const numericId = parseInt(id);
  const pricePerPerson = parseFloat(String(experience.pricePerPerson) || '0');
  const total = pricePerPerson * participants;

  const handleBooking = () => {
    if (!user) {
      toast({ title: "Accedi", description: "Devi accedere per prenotare", variant: "destructive" });
      return;
    }
    if (!selectedDate) {
      toast({ title: "Seleziona una data", description: "Scegli la data dell'esperienza", variant: "destructive" });
      return;
    }
    navigate(`/checkout?type=experience&id=${experience.id}&date=${selectedDate.toISOString()}&participants=${participants}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Link href="/esperienze">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alle esperienze
            </Link>
          </Button>
        </div>
      </div>

      {experience.images && experience.images.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <ImageCarousel
            images={experience.images}
            alt={experience.name}
            className="h-64 md:h-96 rounded-xl"
          />
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Badge className="bg-white/20 text-white border-0 text-sm font-medium">
              {categoryLabels[experience.category] || experience.category}
            </Badge>
            {user && numericId > 0 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleFavorite('experience', numericId)}
                className="ml-auto"
              >
                <Heart className={`h-4 w-4 mr-1 ${isFavorite('experience', numericId) ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite('experience', numericId) ? 'Salvato' : 'Salva'}
              </Button>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{experience.name}</h1>
          <p className="text-lg text-blue-100 mb-6">{experience.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{experience.duration} ore</div>
              <div className="text-blue-200 text-sm">Durata</div>
            </div>
            <div>
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">Max {experience.maxParticipants}</div>
              <div className="text-blue-200 text-sm">Partecipanti</div>
            </div>
            <div>
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{experience.location}</div>
              <div className="text-blue-200 text-sm">Partenza</div>
            </div>
            <div>
              <Euro className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{pricePerPerson.toFixed(2)}</div>
              <div className="text-blue-200 text-sm">A persona</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {experience.includes && experience.includes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cosa include</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {experience.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {experience.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requisiti e note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{experience.requirements}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Scegli data e partecipanti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-3 border">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={it}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-4">Riepilogo prenotazione</h4>

                    <div className="mb-4">
                      <label className="text-sm text-gray-600 mb-2 block">Partecipanti</label>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setParticipants(Math.max(1, participants - 1))}
                          disabled={participants <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{participants}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setParticipants(Math.min(experience.maxParticipants, participants + 1))}
                          disabled={participants >= experience.maxParticipants}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {selectedDate ? (
                      <div className="space-y-3">
                        <div className="flex justify-between pb-2 border-b">
                          <span className="text-gray-600">Data</span>
                          <span className="font-medium">{format(selectedDate, "dd MMM yyyy", { locale: it })}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="text-gray-600">Durata</span>
                          <span className="font-medium">{experience.duration} ore</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="text-gray-600">Prezzo/persona</span>
                          <span className="font-medium">{pricePerPerson.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pb-2 border-b">
                          <span className="text-gray-600">Partecipanti</span>
                          <span className="font-medium">{participants}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Totale</span>
                          <span className="text-green-600">{total.toFixed(2)}</span>
                        </div>
                        <Button
                          className="w-full bg-coral hover:bg-orange-600 text-white mt-3"
                          onClick={handleBooking}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Prenota
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Seleziona una data per vedere il riepilogo</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {pricePerPerson.toFixed(2)} <span className="text-base font-normal text-gray-600">/ persona</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Accedi", description: "Devi accedere per contattare il proprietario", variant: "destructive" });
                      return;
                    }
                    contactOwnerMutation.mutate({
                      id: numericId,
                      name: experience.name,
                      hostId: experience.hostId,
                    });
                  }}
                  disabled={contactOwnerMutation.isPending}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {contactOwnerMutation.isPending ? "Apertura chat..." : "Chiedi informazioni"}
                </Button>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Conferma immediata via email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cancellazione gratuita fino a 24h prima</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
