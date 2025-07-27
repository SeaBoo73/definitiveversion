import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Cloud, 
  Fuel, 
  Anchor, 
  Wind, 
  Thermometer, 
  Eye, 
  Compass, 
  MapPin, 
  Phone,
  Clock,
  Euro,
  Info,
  RefreshCw,
  Zap,
  ArrowLeft,
  Search,
  Calendar,
  User,
  Users,
  Sparkles
} from 'lucide-react';
import seagoLogo from "@assets/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753363582856.jpg";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { SEOHead } from '@/components/seo-head';
import { StructuredData } from '@/components/structured-data';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PartnersSection } from '@/components/partners-section';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  visibility: number;
  waves: {
    height: number;
    direction: number;
    period: number;
  };
  forecast: Array<{
    time: string;
    temperature: number;
    description: string;
    windSpeed: number;
    waves: number;
  }>;
}

interface FuelPrice {
  station: string;
  location: string;
  gasoline: number;
  diesel: number;
  lastUpdated: string;
  distance: number;
  services: string[];
}

interface PortService {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  services: {
    mooring: boolean;
    fuel: boolean;
    water: boolean;
    electricity: boolean;
    wifi: boolean;
    restaurant: boolean;
    repair: boolean;
    security: boolean;
  };
  pricing: {
    mooring: number; // per meter per day
    fuel: number;
    water: number;
    electricity: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    vhf?: string;
  };
  availability: {
    total: number;
    available: number;
    reserved: number;
  };
  rating: number;
  reviews: number;
}

export default function ExternalServices() {
  const [selectedLocation, setSelectedLocation] = useState('Roma');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [portFilter, setPortFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('weather');

  // Weather data query
  const { data: weatherData, isLoading: weatherLoading, refetch: refetchWeather } = useQuery<WeatherData>({
    queryKey: ['weather', selectedLocation],
    queryFn: async () => {
      const response = await fetch(`/api/external/weather?location=${selectedLocation}`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      return response.json();
    },
    staleTime: 0, // Always refetch for new location
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Fuel prices query
  const { data: fuelPrices, isLoading: fuelLoading, refetch: refetchFuel } = useQuery<FuelPrice[]>({
    queryKey: ['fuel-prices', selectedLocation, fuelFilter],
    queryFn: async () => {
      const response = await fetch(`/api/external/fuel-prices?location=${selectedLocation}&filter=${fuelFilter}`);
      if (!response.ok) throw new Error('Failed to fetch fuel prices');
      return response.json();
    },
    staleTime: 0, // Always refetch for new location
    refetchInterval: 3600000 // Refresh every hour
  });

  // Port services query
  const { data: portServices, isLoading: portsLoading, refetch: refetchPorts } = useQuery<PortService[]>({
    queryKey: ['port-services', selectedLocation, portFilter],
    queryFn: async () => {
      const response = await fetch(`/api/external/port-services?location=${selectedLocation}&filter=${portFilter}`);
      if (!response.ok) throw new Error('Failed to fetch port services');
      return response.json();
    },
    staleTime: 0, // Always refetch for new location
    refetchInterval: 1800000 // Refresh every 30 minutes
  });

  // Force refetch when location changes
  useEffect(() => {
    refetchWeather();
    refetchFuel();
    refetchPorts();
  }, [selectedLocation, refetchWeather, refetchFuel, refetchPorts]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getWaveCondition = (height: number) => {
    if (height <= 0.5) return { text: 'Calmo', color: 'bg-green-500' };
    if (height <= 1.0) return { text: 'Leggero', color: 'bg-yellow-500' };
    if (height <= 2.0) return { text: 'Moderato', color: 'bg-orange-500' };
    return { text: 'Mosso', color: 'bg-red-500' };
  };

  const renderServiceIcon = (service: keyof PortService['services'], available: boolean) => {
    const icons = {
      mooring: <Anchor className="h-4 w-4" />,
      fuel: <Fuel className="h-4 w-4" />,
      water: <Cloud className="h-4 w-4" />,
      electricity: <Zap className="h-4 w-4" />,
      wifi: <RefreshCw className="h-4 w-4" />,
      restaurant: <Euro className="h-4 w-4" />,
      repair: <Compass className="h-4 w-4" />,
      security: <Eye className="h-4 w-4" />
    };

    return (
      <div className={`p-2 rounded-lg ${available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
        {icons[service]}
      </div>
    );
  };

  const servicesPageSEO = {
    title: "Servizi Nautici Esterni - Meteo, Carburante, Porti | SeaGO",
    description: "Servizi marittimi completi: meteo marino in tempo reale, prezzi carburante nautico, disponibilità porti e condizioni marine per la tua navigazione sicura.",
    keywords: "meteo marino, carburante nautico, servizi portuali, condizioni marine, assistenza marittima, porti Italia"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead {...servicesPageSEO} />
      <StructuredData type="service-page" />
      <Breadcrumbs />
      
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Titolo */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-ocean-blue" />
              </Link>
              <div className="flex items-center gap-3">
                <Compass className="h-6 w-6 text-ocean-blue" />
                <h1 className="text-xl font-bold text-gray-900">Servizi</h1>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors">
                <Search className="h-4 w-4" />
                <span>Esplora</span>
              </Link>
              <Link href="/ormeggio" className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Ormeggio</span>
              </Link>
              <Link href="/esperienze" className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors">
                <Sparkles className="h-4 w-4" />
                <span>Esperienze</span>
              </Link>
              <Link href="/profilo" className="flex items-center gap-2 text-gray-600 hover:text-ocean-blue transition-colors">
                <User className="h-4 w-4" />
                <span>Profilo</span>
              </Link>
            </nav>

            {/* Quick Service Links - Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('fuel')}
                className="text-xs"
              >
                <Fuel className="h-3 w-3 mr-1" />
                Carburante
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveTab('ports')}
                className="text-xs"
              >
                <Anchor className="h-3 w-3 mr-1" />
                Porti
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Servizi Esterni</h2>
          </div>
          <p className="text-gray-600">
            Informazioni in tempo reale per una navigazione sicura e conveniente
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
              activeTab === 'weather' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'hover:border-blue-200'
            }`}
            onClick={() => setActiveTab('weather')}
          >
            <CardContent className="p-4 text-center">
              <Cloud className={`h-8 w-8 mx-auto mb-2 ${
                activeTab === 'weather' ? 'text-blue-600' : 'text-blue-500'
              }`} />
              <h3 className="font-medium text-sm">Meteo Marine</h3>
              <p className="text-xs text-gray-500 mt-1">Condizioni attuali</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
              activeTab === 'fuel' 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'hover:border-green-200'
            }`}
            onClick={() => setActiveTab('fuel')}
          >
            <CardContent className="p-4 text-center">
              <Fuel className={`h-8 w-8 mx-auto mb-2 ${
                activeTab === 'fuel' ? 'text-green-600' : 'text-green-500'
              }`} />
              <h3 className="font-medium text-sm">Prezzi Carburante</h3>
              <p className="text-xs text-gray-500 mt-1">Stazioni vicine</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
              activeTab === 'ports' 
                ? 'border-orange-500 bg-orange-50 shadow-lg' 
                : 'hover:border-orange-200'
            }`}
            onClick={() => setActiveTab('ports')}
          >
            <CardContent className="p-4 text-center">
              <Anchor className={`h-8 w-8 mx-auto mb-2 ${
                activeTab === 'ports' ? 'text-orange-600' : 'text-orange-500'
              }`} />
              <h3 className="font-medium text-sm">Servizi Portuali</h3>
              <p className="text-xs text-gray-500 mt-1">Porti e marine</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
              activeTab === 'marine' 
                ? 'border-teal-500 bg-teal-50 shadow-lg' 
                : 'hover:border-teal-200'
            }`}
            onClick={() => setActiveTab('marine')}
          >
            <CardContent className="p-4 text-center">
              <img src={seagoLogo} alt="SeaGO" className="h-8 w-8 mx-auto mb-2 object-contain" />
              <h3 className="font-medium text-sm">Condizioni Marine</h3>
              <p className="text-xs text-gray-500 mt-1">Onde e sicurezza</p>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
              activeTab === 'partners' 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'hover:border-purple-200'
            }`}
            onClick={() => setActiveTab('partners')}
          >
            <CardContent className="p-4 text-center">
              <Users className={`h-8 w-8 mx-auto mb-2 ${
                activeTab === 'partners' ? 'text-purple-600' : 'text-purple-500'
              }`} />
              <h3 className="font-medium text-sm">Partner</h3>
              <p className="text-xs text-gray-500 mt-1">Servizi verificati</p>
            </CardContent>
          </Card>
        </div>

      {/* Location Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Località:</span>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Seleziona località" />
                {(weatherLoading || fuelLoading || portsLoading) && (
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin text-blue-600" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roma">Roma / Fiumicino</SelectItem>
                <SelectItem value="Civitavecchia">Civitavecchia</SelectItem>
                <SelectItem value="Gaeta">Gaeta</SelectItem>
                <SelectItem value="Anzio">Anzio</SelectItem>
                <SelectItem value="Terracina">Terracina</SelectItem>
                <SelectItem value="Ponza">Ponza</SelectItem>
                <SelectItem value="Formia">Formia</SelectItem>
                {/* Campania Ports */}
                <SelectItem value="Napoli">Napoli</SelectItem>
                <SelectItem value="Salerno">Salerno</SelectItem>
                <SelectItem value="Sorrento">Sorrento</SelectItem>
                <SelectItem value="Amalfi">Amalfi</SelectItem>
                <SelectItem value="Positano">Positano</SelectItem>
                <SelectItem value="Capri">Capri</SelectItem>
                <SelectItem value="Ischia">Ischia</SelectItem>
                <SelectItem value="Procida">Procida</SelectItem>
                <SelectItem value="Pozzuoli">Pozzuoli</SelectItem>
                <SelectItem value="Castellammare di Stabia">Castellammare di Stabia</SelectItem>
                <SelectItem value="Agropoli">Agropoli</SelectItem>
                <SelectItem value="Palinuro">Palinuro</SelectItem>
                <SelectItem value="Marina di Camerota">Marina di Camerota</SelectItem>
                <SelectItem value="Sapri">Sapri</SelectItem>
                <SelectItem value="Cetara">Cetara</SelectItem>
                <SelectItem value="Maiori">Maiori</SelectItem>
                <SelectItem value="Minori">Minori</SelectItem>
                <SelectItem value="Acciaroli">Acciaroli</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                refetchWeather();
                refetchFuel();
                refetchPorts();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna Tutto
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="weather">Meteo</TabsTrigger>
          <TabsTrigger value="fuel">Carburante</TabsTrigger>
          <TabsTrigger value="ports">Porti</TabsTrigger>
          <TabsTrigger value="marine">Condizioni Marine</TabsTrigger>
          <TabsTrigger value="partners">Partner</TabsTrigger>
        </TabsList>

        {/* Weather Tab */}
        <TabsContent value="weather" className="space-y-6">
          {weatherLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Caricamento dati meteo...
              </CardContent>
            </Card>
          ) : weatherData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Condizioni Attuali - {weatherData.location}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                      <div className="text-sm text-gray-600 capitalize">{weatherData.description}</div>
                    </div>
                    
                    <div className="text-center">
                      <Wind className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{weatherData.windSpeed} kn</div>
                      <div className="text-sm text-gray-600">
                        {getWindDirection(weatherData.windDirection)} ({weatherData.windDirection}°)
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">{weatherData.visibility} km</div>
                      <div className="text-sm text-gray-600">Visibilità</div>
                    </div>
                    
                    <div className="text-center">
                      <img src={seagoLogo} alt="SeaGO" className="h-8 w-8 mx-auto mb-2 object-contain" />
                      <div className="text-2xl font-bold">{weatherData.waves.height} m</div>
                      <div className="text-sm text-gray-600">
                        {getWaveCondition(weatherData.waves.height).text}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Pressione:</span>
                      <div className="font-medium">{weatherData.pressure} hPa</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Umidità:</span>
                      <div className="font-medium">{weatherData.humidity}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Previsioni 24h</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {weatherData.forecast.map((forecast, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-gray-600 mb-2">
                          {formatTime(forecast.time)}
                        </div>
                        <div className="font-medium">{forecast.temperature}°C</div>
                        <div className="text-xs text-gray-500 capitalize">{forecast.description}</div>
                        <div className="text-xs mt-1">
                          <span className="text-blue-600">{forecast.windSpeed} kn</span>
                          <span className="mx-1">•</span>
                          <span className="text-teal-600">{forecast.waves} m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Impossibile caricare i dati meteo. Verificare la connessione internet.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Fuel Prices Tab */}
        <TabsContent value="fuel" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={fuelFilter} onValueChange={setFuelFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra carburante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i servizi</SelectItem>
                <SelectItem value="cheapest">Più economici</SelectItem>
                <SelectItem value="nearest">Più vicini</SelectItem>
                <SelectItem value="premium">Servizi premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fuelLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Caricamento prezzi carburante...
              </CardContent>
            </Card>
          ) : fuelPrices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fuelPrices.map((station, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{station.station}</CardTitle>
                      <Badge variant="outline">{station.distance} km</Badge>
                    </div>
                    <div className="text-sm text-gray-600">{station.location}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-600">Benzina:</span>
                        <div className="text-xl font-bold text-green-600">€{station.gasoline.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Gasolio:</span>
                        <div className="text-xl font-bold text-blue-600">€{station.diesel.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">Servizi:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {station.services.map((service, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Aggiornato: {formatTime(station.lastUpdated)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Impossibile caricare i prezzi del carburante. Riprovare più tardi.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Port Services Tab */}
        <TabsContent value="ports" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={portFilter} onValueChange={setPortFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra porti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i porti</SelectItem>
                <SelectItem value="available">Posti disponibili</SelectItem>
                <SelectItem value="fuel">Con rifornimento</SelectItem>
                <SelectItem value="services">Servizi completi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {portsLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Caricamento servizi portuali...
              </CardContent>
            </Card>
          ) : portServices ? (
            <div className="space-y-4">
              {portServices.map((port) => (
                <Card key={port.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{port.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < Math.floor(port.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({port.reviews})</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{port.location}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Services */}
                      <div>
                        <h4 className="font-medium mb-3">Servizi Disponibili</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(port.services).map(([service, available]) => (
                            <div key={service} title={service}>
                              {renderServiceIcon(service as keyof PortService['services'], available)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div>
                        <h4 className="font-medium mb-3">Tariffe</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Ormeggio:</span>
                            <span>€{port.pricing.mooring}/m/giorno</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carburante:</span>
                            <span>€{port.pricing.fuel}/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Acqua:</span>
                            <span>€{port.pricing.water}/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Elettricità:</span>
                            <span>€{port.pricing.electricity}/kWh</span>
                          </div>
                        </div>
                      </div>

                      {/* Availability & Contact */}
                      <div>
                        <h4 className="font-medium mb-3">Disponibilità</h4>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span>Totale posti:</span>
                            <span>{port.availability.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Disponibili:</span>
                            <span className="text-green-600 font-medium">{port.availability.available}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prenotati:</span>
                            <span className="text-orange-600">{port.availability.reserved}</span>
                          </div>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span>{port.contact.phone}</span>
                          </div>
                          {port.contact.vhf && (
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-3 w-3" />
                              <span>VHF {port.contact.vhf}</span>
                            </div>
                          )}
                        </div>

                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Phone className="h-4 w-4 mr-2" />
                          Contatta Porto
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Impossibile caricare i servizi portuali. Verificare la connessione.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Marine Conditions Tab */}
        <TabsContent value="marine" className="space-y-6">
          {weatherData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <img src={seagoLogo} alt="SeaGO" className="h-5 w-5 object-contain" />
                    Condizioni Marine Attuali
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <img src={seagoLogo} alt="SeaGO" className="h-12 w-12 mx-auto mb-3 object-contain" />
                      <div className="text-3xl font-bold">{weatherData.waves.height} m</div>
                      <div className="text-sm text-gray-600">Altezza Onde</div>
                      <Badge 
                        className={`mt-2 ${getWaveCondition(weatherData.waves.height).color} text-white`}
                      >
                        {getWaveCondition(weatherData.waves.height).text}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <Compass className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                      <div className="text-3xl font-bold">{weatherData.waves.direction}°</div>
                      <div className="text-sm text-gray-600">Direzione Onde</div>
                      <div className="text-sm mt-2 text-blue-600">
                        {getWindDirection(weatherData.waves.direction)}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Clock className="h-12 w-12 mx-auto mb-3 text-purple-500" />
                      <div className="text-3xl font-bold">{weatherData.waves.period}s</div>
                      <div className="text-sm text-gray-600">Periodo Onde</div>
                      <div className="text-sm mt-2 text-purple-600">
                        {weatherData.waves.period < 6 ? 'Frequenti' : 
                         weatherData.waves.period < 10 ? 'Moderate' : 'Lunghe'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raccomandazioni di Navigazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherData.waves.height <= 0.5 && weatherData.windSpeed <= 10 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-green-800">
                          <strong>Condizioni Ottime:</strong> Mare calmo, ideale per tutte le imbarcazioni. 
                          Navigazione sicura per principianti.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {((weatherData.waves.height > 0.5 && weatherData.waves.height <= 1.5) || 
                      (weatherData.windSpeed > 10 && weatherData.windSpeed <= 20)) && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-yellow-800">
                          <strong>Condizioni Moderate:</strong> Prestare attenzione. Consigliata esperienza di navigazione. 
                          Verificare stabilità dell'imbarcazione.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {(weatherData.waves.height > 1.5 || weatherData.windSpeed > 20) && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          <strong>Condizioni Difficili:</strong> Sconsigliata la navigazione per imbarcazioni piccole. 
                          Solo navigatori esperti con imbarcazioni adeguate.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Equipaggiamento Consigliato</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center gap-2">
                              <img src={seagoLogo} alt="SeaGO" className="h-3 w-3 object-contain" />
                              Giubbotto di salvataggio
                            </li>
                            <li className="flex items-center gap-2">
                              <img src={seagoLogo} alt="SeaGO" className="h-3 w-3 object-contain" />
                              VHF nautico
                            </li>
                            <li className="flex items-center gap-2">
                              <img src={seagoLogo} alt="SeaGO" className="h-3 w-3 object-contain" />
                              Kit di primo soccorso
                            </li>
                            <li className="flex items-center gap-2">
                              <img src={seagoLogo} alt="SeaGO" className="h-3 w-3 object-contain" />
                              Ancora di emergenza
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Previsioni Brevi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {weatherData.forecast.slice(0, 3).map((forecast, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{formatTime(forecast.time)}</span>
                                <span>{forecast.waves}m • {forecast.windSpeed}kn</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <PartnersSection />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}