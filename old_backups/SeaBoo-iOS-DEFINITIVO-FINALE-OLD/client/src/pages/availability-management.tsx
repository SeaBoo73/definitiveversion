import { useState } from "react";
import { useParams } from "wouter";
import { ArrowLeft, Calendar, Settings, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { OwnerAvailabilityManager } from "@/components/owner-availability-manager";
import { AdvancedAvailabilityCalendar } from "@/components/advanced-availability-calendar";
import { Link } from "wouter";

export default function AvailabilityManagement() {
  const { boatId } = useParams();
  const [selectedDates, setSelectedDates] = useState<{startDate: Date, endDate: Date} | null>(null);

  const { data: boat, isLoading } = useQuery({
    queryKey: ['/api/boats', boatId],
    queryFn: () => apiRequest(`/api/boats/${boatId}`),
    enabled: !!boatId
  });

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user'),
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!boat) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Imbarcazione non trovata</h1>
            <p className="text-gray-600 mb-6">L'imbarcazione richiesta non esiste o non è più disponibile.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna alla Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && boat && boat.ownerId === user.id;

  const handleDateSelection = (startDate: Date, endDate: Date) => {
    setSelectedDates({ startDate, endDate });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={isOwner ? `/owner-dashboard` : `/boats/${boatId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Indietro
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestione Disponibilità</h1>
                <p className="text-gray-600">{boat?.name || "Caricamento..."} - {boat?.location || ""}</p>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Modalità Proprietario</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {isOwner ? (
          /* Owner Management Interface */
          <OwnerAvailabilityManager boatId={parseInt(boatId!)} />
        ) : (
          /* Customer Booking Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Calendario Disponibilità</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedAvailabilityCalendar 
                    boatId={parseInt(boatId!)} 
                    onDateSelect={handleDateSelection}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Boat Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli Imbarcazione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prezzo base</span>
                    <span className="font-semibold">€{boat?.pricePerDay || 0}/giorno</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Persone max</span>
                    <span className="font-semibold">{boat?.maxPersons || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Skipper</span>
                    <span className="font-semibold">
                      {boat?.skipperRequired ? "Richiesto" : "Opzionale"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carburante</span>
                    <span className="font-semibold">
                      {boat?.fuelIncluded ? "Incluso" : "Non incluso"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Dates Summary */}
              {selectedDates && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Date Selezionate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm text-blue-700">Check-in</div>
                      <div className="font-semibold text-blue-900">
                        {selectedDates.startDate.toLocaleDateString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-700">Check-out</div>
                      <div className="font-semibold text-blue-900">
                        {selectedDates.endDate.toLocaleDateString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-700">Durata</div>
                      <div className="font-semibold text-blue-900">
                        {Math.ceil((selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) / (1000 * 60 * 60 * 24))} giorni
                      </div>
                    </div>
                    <Link href={`/boats/${boatId}/booking?startDate=${selectedDates.startDate.toISOString()}&endDate=${selectedDates.endDate.toISOString()}`}>
                      <Button className="w-full">
                        Procedi alla Prenotazione
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Caratteristiche Avanzate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Prezzi dinamici stagionali</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Sconti per soggiorni lunghi</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Offerte last minute</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Calendario sincronizzato</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Blocco temporaneo date</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}