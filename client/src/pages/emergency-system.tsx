import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin, AlertTriangle, Shield, Anchor, Navigation, Radio, Clock, Users } from 'lucide-react';
import seabooLogo from "@/assets/seaboo-logo-new.svg";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'coast_guard' | 'medical' | 'technical' | 'towing';
  region: string;
  available24h: boolean;
}

interface EmergencyAlert {
  id: string;
  boatId: number;
  type: 'medical' | 'mechanical' | 'weather' | 'collision' | 'fire' | 'grounding' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number };
  description: string;
  contactInfo: string;
  personsOnBoard: number;
  status: 'active' | 'resolved' | 'in_progress';
  createdAt: string;
  resolvedAt?: string;
}

interface BoatLocation {
  boatId: number;
  boatName: string;
  location: { lat: number; lng: number };
  lastUpdate: string;
  status: 'normal' | 'alert' | 'emergency';
  speed: number;
  heading: number;
}

export default function EmergencySystem() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [description, setDescription] = useState('');
  const [personsOnBoard, setPersonsOnBoard] = useState(2);
  const [contactInfo, setContactInfo] = useState('');
  const queryClient = useQueryClient();

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Emergency contacts query
  const { data: emergencyContacts } = useQuery<EmergencyContact[]>({
    queryKey: ['emergency-contacts'],
    queryFn: async () => {
      const response = await fetch('/api/emergency/contacts');
      if (!response.ok) throw new Error('Failed to fetch emergency contacts');
      return response.json();
    }
  });

  // Active alerts query
  const { data: activeAlerts } = useQuery<EmergencyAlert[]>({
    queryKey: ['emergency-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/emergency/alerts');
      if (!response.ok) throw new Error('Failed to fetch emergency alerts');
      return response.json();
    }
  });

  // Boat locations query
  const { data: boatLocations } = useQuery<BoatLocation[]>({
    queryKey: ['boat-locations'],
    queryFn: async () => {
      const response = await fetch('/api/emergency/boat-locations');
      if (!response.ok) throw new Error('Failed to fetch boat locations');
      return response.json();
    },
    refetchInterval: 30000 // Update every 30 seconds
  });

  // Create emergency alert mutation
  const createEmergencyAlert = useMutation({
    mutationFn: async (alertData: Partial<EmergencyAlert>) => {
      const response = await fetch('/api/emergency/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      if (!response.ok) throw new Error('Failed to create emergency alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-alerts'] });
      setEmergencyType('');
      setSeverity('');
      setDescription('');
      setPersonsOnBoard(2);
      setContactInfo('');
    }
  });

  const handleEmergencyCall = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  const handleQuickEmergency = (type: string, severityLevel: string) => {
    if (!currentLocation) {
      alert('Posizione non disponibile. Attiva la geolocalizzazione.');
      return;
    }

    createEmergencyAlert.mutate({
      type: type as any,
      severity: severityLevel as any,
      location: currentLocation,
      description: `Emergenza ${type} - Allerta automatica`,
      contactInfo: contactInfo || 'Non specificato',
      personsOnBoard,
      status: 'active'
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'destructive';
      case 'alert': return 'secondary';
      case 'normal': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Emergency Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-red-600">Sistema di Emergenze</h1>
        </div>
        <p className="text-gray-600">
          Sistema integrato per la sicurezza marittima e assistenza di emergenza
        </p>
      </div>

      {/* Quick Emergency Actions */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="font-medium">Emergenza Immediata?</span>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => window.open('tel:1530', '_self')}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Emergenza Medica
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => window.open('tel:1530', '_self')}
                className="flex items-center gap-2"
              >
                <Anchor className="h-4 w-4" />
                Avaria Motore
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => window.open('tel:1530', '_self')}
                className="flex items-center gap-2"
              >
                <Radio className="h-4 w-4" />
                Meteo Avverso
              </Button>
            </div>
            <p className="text-xs text-red-600 mt-2">Tutti i pulsanti chiamano il 1530 - Guardia Costiera</p>
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="flex flex-col w-full h-auto space-y-1 bg-gray-100 p-2 rounded-lg">
          <TabsTrigger value="contacts" className="w-full justify-start">Contatti</TabsTrigger>
          <TabsTrigger value="locations" className="w-full justify-start">Localizzazione</TabsTrigger>
          <TabsTrigger value="protocols" className="w-full justify-start">Protocolli</TabsTrigger>
        </TabsList>

        {/* Emergency Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                Numeri di Emergenza
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guardia Costiera - Primary Emergency */}
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <span className="font-bold text-red-600">GUARDIA COSTIERA</span>
                      </div>
                      <Badge variant="destructive">24h/7</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-red-600">1530</div>
                      <div className="text-sm text-gray-600">Numero di emergenza nazionale</div>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleEmergencyCall({ 
                          id: 'coast-guard', 
                          name: 'Guardia Costiera', 
                          phone: '1530', 
                          type: 'coast_guard',
                          region: 'nazionale',
                          available24h: true 
                        })}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Chiama Ora
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Emergency Contacts */}
                {emergencyContacts?.map((contact) => (
                  <Card key={contact.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        {contact.available24h && <Badge variant="secondary">24h</Badge>}
                      </div>
                      <div className="text-sm text-gray-600">{contact.region}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="font-mono text-lg">{contact.phone}</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          onClick={() => handleEmergencyCall(contact)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Chiama
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Location Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                La Tua Posizione
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <MapPin className="h-5 w-5" />
                      <span className="font-semibold">Posizione GPS Attuale</span>
                    </div>
                    <div className="text-2xl font-mono text-blue-900 mb-4">
                      {formatCoordinates(currentLocation.lat, currentLocation.lng)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const coords = `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`;
                          navigator.clipboard.writeText(coords);
                          alert('Coordinate copiate negli appunti!');
                        }}
                      >
                        Copia Coordinate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const coords = `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`;
                          const message = `La mia posizione attuale: ${coords}`;
                          if (navigator.share) {
                            navigator.share({ title: 'Posizione', text: message });
                          } else {
                            navigator.clipboard.writeText(message);
                            alert('Messaggio copiato negli appunti!');
                          }
                        }}
                      >
                        Condividi Posizione
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => window.open(`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`, '_blank')}
                      >
                        Apri in Google Maps
                      </Button>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>In caso di emergenza:</strong> Comunica queste coordinate alla Guardia Costiera (1530) per permettere ai soccorsi di localizzarti.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-700 mb-2">Posizione non disponibile</h3>
                  <p className="text-gray-600 mb-4">
                    Attiva la geolocalizzazione nel browser per vedere la tua posizione.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setCurrentLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                          });
                        },
                        (error) => alert('Impossibile ottenere la posizione. Verifica i permessi del browser.'),
                        { enableHighAccuracy: true }
                      );
                    }}
                  >
                    Attiva Localizzazione
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Protocols Tab */}
        <TabsContent value="protocols" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Protocolli di Sicurezza Marittima
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Procedura di Emergenza Standard</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <strong>Valuta la situazione:</strong> Determina il tipo e la gravità dell'emergenza
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <strong>Chiama immediatamente la Guardia Costiera:</strong> Numero 1530
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <strong>Comunica:</strong> Posizione, natura dell'emergenza, numero persone a bordo
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <strong>Attiva segnalazioni:</strong> Razzi, riflettore, radio VHF canale 16
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                      <div>
                        <strong>Mantieni la calma:</strong> Segui le istruzioni dei soccorsi
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Equipaggiamenti di Sicurezza Obbligatori</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Giubbotti salvagente (uno per persona)</li>
                      <li>• Razzi di segnalazione</li>
                      <li>• Estintore</li>
                      <li>• Radio VHF o telefono satellitare</li>
                      <li>• Kit di primo soccorso</li>
                      <li>• Ancora galleggiante</li>
                      <li>• Pompa di sentina</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Segnali di Emergenza</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>MAYDAY:</strong> Pericolo immediato di vita</li>
                      <li>• <strong>PAN PAN:</strong> Situazione di urgenza</li>
                      <li>• <strong>SECURITÉ:</strong> Messaggio di sicurezza</li>
                      <li>• <strong>SOS:</strong> Segnale morse di soccorso</li>
                      <li>• <strong>Razzi rossi:</strong> Emergenza</li>
                      <li>• <strong>Specchio eliografico:</strong> Segnalazione</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Current Location Display */}
      {currentLocation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-800">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">La tua posizione attuale:</span>
              <span className="font-mono text-sm">
                {formatCoordinates(currentLocation.lat, currentLocation.lng)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}