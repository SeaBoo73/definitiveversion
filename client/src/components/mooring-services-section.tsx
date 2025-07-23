import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Anchor, 
  MapPin, 
  Shield, 
  Clock,
  Euro,
  Waves,
  Phone,
  Wifi,
  Fuel,
  Droplet,
  Zap,
  Car,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'wouter';

interface MooringPort {
  id: string;
  name: string;
  location: string;
  distance: string;
  pricing: {
    daily: number;
    weekly: number;
    monthly: number;
    seasonal: number;
  };
  services: {
    security: boolean;
    fuel: boolean;
    water: boolean;
    electricity: boolean;
    wifi: boolean;
    parking: boolean;
    assistance: boolean;
  };
  capacity: {
    total: number;
    available: number;
    maxLength: number;
  };
  contact: {
    phone: string;
    vhf: string;
  };
  rating: number;
  features: string[];
}

const mooringPorts: MooringPort[] = [
  {
    id: "marina-civitavecchia",
    name: "Marina di Civitavecchia",
    location: "Civitavecchia, RM",
    distance: "60 km da Roma",
    pricing: {
      daily: 45,
      weekly: 280,
      monthly: 1050,
      seasonal: 5200
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: true,
      parking: true,
      assistance: true
    },
    capacity: {
      total: 350,
      available: 45,
      maxLength: 80
    },
    contact: {
      phone: "+39 0766 123456",
      vhf: "Ch 9"
    },
    rating: 4.8,
    features: ["Porto turistico completo", "Servizi h24", "Vicinanza aeroporto"]
  },
  {
    id: "marina-gaeta",
    name: "Marina di Gaeta",
    location: "Gaeta, LT",
    distance: "120 km da Roma",
    pricing: {
      daily: 38,
      weekly: 230,
      monthly: 890,
      seasonal: 4200
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: true,
      parking: true,
      assistance: true
    },
    capacity: {
      total: 280,
      available: 32,
      maxLength: 60
    },
    contact: {
      phone: "+39 0771 987654",
      vhf: "Ch 12"
    },
    rating: 4.6,
    features: ["Baia protetta", "Centro storico", "Ristoranti sul porto"]
  },
  {
    id: "marina-anzio",
    name: "Marina di Anzio",
    location: "Anzio, RM",
    distance: "45 km da Roma",
    pricing: {
      daily: 35,
      weekly: 210,
      monthly: 780,
      seasonal: 3800
    },
    services: {
      security: true,
      fuel: true,
      water: true,
      electricity: true,
      wifi: false,
      parking: true,
      assistance: true
    },
    capacity: {
      total: 200,
      available: 28,
      maxLength: 45
    },
    contact: {
      phone: "+39 06 9876543",
      vhf: "Ch 16"
    },
    rating: 4.4,
    features: ["Vicinanza Roma", "Spiagge sabbiose", "Mercato del pesce"]
  }
];

export function MooringServicesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-blue-600 text-white px-4 py-2 mb-4">
            Ormeggi Garantiti
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Posto barca sempre disponibile per i noleggiatori
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Mai più barche in rada! I nostri partner offrono ormeggi sicuri con servizi completi per le tue imbarcazioni a noleggio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {mooringPorts.map((port) => (
            <Card key={port.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{port.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{port.location}</span>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">{port.distance}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{port.rating}</span>
                  </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">€{port.pricing.daily}</div>
                    <div className="text-xs text-gray-600">per metro/giorno</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">€{port.pricing.monthly}</div>
                    <div className="text-xs text-gray-600">per metro/mese</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">€{port.pricing.seasonal}</div>
                    <div className="text-xs text-gray-600">stagionale</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <div className="text-sm font-bold text-orange-600">{port.capacity.available}</div>
                    <div className="text-xs text-gray-600">posti liberi</div>
                  </div>
                </div>

                {/* Services Icons */}
                <div className="flex justify-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  {port.services.security && <Shield className="h-5 w-5 text-green-500" title="Sicurezza 24h" />}
                  {port.services.fuel && <Fuel className="h-5 w-5 text-orange-500" title="Carburante" />}
                  {port.services.water && <Droplet className="h-5 w-5 text-blue-500" title="Acqua" />}
                  {port.services.electricity && <Zap className="h-5 w-5 text-yellow-500" title="Elettricità" />}
                  {port.services.wifi && <Wifi className="h-5 w-5 text-purple-500" title="WiFi" />}
                  {port.services.parking && <Car className="h-5 w-5 text-gray-500" title="Parcheggio" />}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Servizi inclusi:</h4>
                  <ul className="space-y-1">
                    {port.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {port.contact.phone}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Waves className="h-4 w-4" />
                      VHF {port.contact.vhf}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button size="sm" asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/external-services?tab=ports&port=${port.id}`}>
                      Prenota Ormeggio
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(`tel:${port.contact.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Chiama Porto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Calculator */}
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              🧮 Calcola i Costi di Ormeggio per la Tua Barca
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-2">8m</div>
                <div className="text-sm text-gray-600 mb-3">Lunghezza barca</div>
                <div className="space-y-1 text-xs">
                  <div>Giornaliero: €280-360</div>
                  <div>Mensile: €6.240-8.400</div>
                  <div>Stagionale: €30.400-41.600</div>
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">12m</div>
                <div className="text-sm text-gray-600 mb-3">Lunghezza barca</div>
                <div className="space-y-1 text-xs">
                  <div>Giornaliero: €420-540</div>
                  <div>Mensile: €9.360-12.600</div>
                  <div>Stagionale: €45.600-62.400</div>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-2">15m</div>
                <div className="text-sm text-gray-600 mb-3">Lunghezza barca</div>
                <div className="space-y-1 text-xs">
                  <div>Giornaliero: €525-675</div>
                  <div>Mensile: €11.700-15.750</div>
                  <div>Stagionale: €57.000-78.000</div>
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 mb-2">20m</div>
                <div className="text-sm text-gray-600 mb-3">Lunghezza barca</div>
                <div className="space-y-1 text-xs">
                  <div>Giornaliero: €700-900</div>
                  <div>Mensile: €15.600-21.000</div>
                  <div>Stagionale: €76.000-104.000</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 mb-4">
                * Prezzi indicativi per metro lineare. Include tutti i servizi base: acqua, elettricità, sicurezza
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/diventa-noleggiatore">
                  Richiedi Preventivo Personalizzato
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits for Boat Owners */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">
              🎯 Vantaggi Esclusivi per i Noleggiatori SeaGO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Anchor className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">Posto Garantito</h4>
                <p className="text-green-100 text-sm">
                  Mai più barche in rada. Ormeggio riservato per le tue imbarcazioni a noleggio con tariffe scontate del 20%
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Clock className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">Check-in Assistito</h4>
                <p className="text-green-100 text-sm">
                  Il nostro staff gestisce il check-in/out dei clienti, verificando le condizioni della barca prima e dopo il noleggio
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h4 className="font-bold mb-2">Sicurezza H24</h4>
                <p className="text-green-100 text-sm">
                  Videosorveglianza, accesso controllato e assistenza portuale 24/7 per la massima tranquillità
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" asChild className="bg-white text-green-600 hover:bg-green-50 font-bold">
                <Link href="/diventa-noleggiatore">
                  <div className="flex items-center gap-2">
                    Registra la Tua Barca Ora
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              </Button>
              <p className="text-green-100 text-sm mt-4">
                Registrazione gratuita • Tariffe ormeggio scontate • Assistenza dedicata
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}