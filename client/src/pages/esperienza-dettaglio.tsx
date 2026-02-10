import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageCarousel } from "@/components/image-carousel";
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
  Shield,
  MessageCircle,
  Loader2
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [numParticipants, setNumParticipants] = useState(1);

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

  const { data: availability } = useQuery<any[]>({
    queryKey: ['/api/experiences', id, 'availability'],
    queryFn: async () => {
      const res = await fetch(`/api/experiences/${id}/availability`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id,
  });

  const blockedDates = new Set<string>();
  if (availability) {
    availability.forEach((a: any) => {
      if (a.status === 'blocked' || a.status === 'booked') {
        const start = new Date(a.startDate);
        const end = new Date(a.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          blockedDates.add(d.toISOString().split('T')[0]);
        }
      }
    });
  }

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.has(dateStr);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna indietro
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

          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="p-5 space-y-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">€{pricePerPerson.toFixed(2)}</div>
                  <div className="text-gray-600">per persona</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Partecipanti</div>
                      <div className="text-xs text-gray-500">Max {experience.maxParticipants}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setNumParticipants(Math.max(1, numParticipants - 1))}
                        disabled={numParticipants <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg font-bold w-6 text-center">{numParticipants}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => setNumParticipants(Math.min(experience.maxParticipants, numParticipants + 1))}
                        disabled={numParticipants >= experience.maxParticipants}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-xs text-gray-500">Totale</div>
                    <div className="text-xl font-bold text-green-700">€{(pricePerPerson * numParticipants).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{numParticipants} {numParticipants === 1 ? 'persona' : 'persone'} × €{pricePerPerson.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durata</span>
                    <span className="font-medium">{experience.duration} ore</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max partecipanti</span>
                    <span className="font-medium">{experience.maxParticipants}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-ocean-blue hover:bg-blue-600 h-12 text-lg font-semibold"
                  onClick={() => {
                    if (!user) {
                      toast({ title: "Accedi", description: "Devi accedere per prenotare", variant: "destructive" });
                      return;
                    }
                    setShowCalendar(!showCalendar);
                  }}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Verifica Disponibilità
                </Button>

                {showCalendar && (
                  <div className="border rounded-lg p-3 space-y-3">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={it}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || isDateBlocked(date);
                      }}
                      modifiers={{
                        blocked: (date) => isDateBlocked(date),
                      }}
                      modifiersClassNames={{
                        blocked: 'line-through text-red-300 opacity-50',
                      }}
                    />
                    {selectedDate && (
                      <div className="space-y-2 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Data</span>
                          <span className="font-medium">{format(selectedDate, "dd MMM yyyy", { locale: it })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Prezzo/persona</span>
                          <span className="font-medium">€{pricePerPerson.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Partecipanti</span>
                          <span className="font-medium">{numParticipants}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t pt-2">
                          <span className="text-gray-900">Totale</span>
                          <span className="text-green-700">€{(pricePerPerson * numParticipants).toFixed(2)}</span>
                        </div>
                        {!isDateBlocked(selectedDate) ? (
                          <>
                            <Badge className="w-full justify-center bg-green-100 text-green-700 border-green-300 py-1">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Data disponibile
                            </Badge>
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 h-10 font-semibold"
                              onClick={() => navigate(`/checkout?type=experience&id=${experience.id}&date=${selectedDate.toISOString()}&participants=${numParticipants}`)}
                            >
                              Prenota ora
                            </Button>
                          </>
                        ) : (
                          <Badge className="w-full justify-center bg-red-100 text-red-700 border-red-300 py-1">
                            Data non disponibile
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full h-12"
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
                  {contactOwnerMutation.isPending ? "Apertura chat..." : "Contatta il proprietario"}
                </Button>

                <div className="text-center text-sm text-gray-500 space-y-1 pt-2">
                  <div className="flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Prenotazione sicura con Stripe
                  </div>
                  <p>Cancellazione gratuita fino a 24h prima</p>
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
