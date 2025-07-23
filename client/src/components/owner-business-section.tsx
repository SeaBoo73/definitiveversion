import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Anchor, 
  Euro, 
  TrendingUp, 
  MapPin,
  Calendar,
  Users,
  Shield,
  ArrowRight,
  DollarSign,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Link } from 'wouter';

export function OwnerBusinessSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="bg-green-600 text-white px-4 py-2 mb-4">
            Opportunità di Business
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trasforma la tua barca in una fonte di reddito
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Ormeggia la tua imbarcazione, ricevi pagamenti sicuri e guadagna fino a €15.000+ all'anno con SeaGO
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Guadagni e Pagamenti */}
          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Guadagni Garantiti</h3>
                  <p className="text-gray-600">Pagamenti sicuri e tempestivi</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Guadagno medio annuale</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">€12.500</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Giorni occupazione media</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">85/anno</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Prenotazioni mensili</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">7-12</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">💳 Sistema di Pagamento</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    <span>Stripe integration - pagamenti sicuri</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-green-500" />
                    <span>Bonifico automatico ogni 7 giorni</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Protezione anti-frode inclusa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>Commissione trasparente del 15%</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Ormeggio e Servizi */}
          <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Anchor className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Ormeggio e Servizi</h3>
                  <p className="text-gray-600">Gestione completa della tua barca</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">5 Porti Partner nel Lazio</span>
                  </div>
                  <p className="text-sm text-gray-600">Civitavecchia, Gaeta, Anzio, Terracina, Nettuno</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">€25-45</div>
                    <div className="text-xs text-gray-600">Ormeggio/metro/giorno</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-600">Assistenza portuale</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">⚓ Servizi Inclusi</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Sicurezza H24 nei porti partner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Check-in/out assistito per clienti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>Tracciamento GPS in tempo reale</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Gestione automatica calendario</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiche di Performance */}
        <Card className="bg-white shadow-xl border-0 mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              📊 Performance Media Proprietari SeaGO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">€350</div>
                <div className="text-sm text-gray-600">Tariffa media/giorno</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">78%</div>
                <div className="text-sm text-gray-600">Tasso occupazione</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-sm text-gray-600">Rating medio</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
                <div className="text-sm text-gray-600">Clienti soddisfatti</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="text-center space-y-4">
          <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-bold shadow-lg">
            <Link href="/diventa-noleggiatore">
              <div className="flex items-center gap-3">
                <Anchor className="h-6 w-6" />
                Inizia a Guadagnare Ora
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" size="lg" asChild className="border-green-600 text-green-700 hover:bg-green-50">
              <Link href="/owner-dashboard">
                Dashboard Proprietari
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="border-blue-600 text-blue-700 hover:bg-blue-50">
              <Link href="/commissioni-guadagni">
                Calcola i Tuoi Guadagni
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            <strong>Registrazione gratuita</strong> • No costi di setup • Commissione solo su prenotazioni confermate • 
            Assistenza dedicata 7/7
          </p>
        </div>
      </div>
    </section>
  );
}