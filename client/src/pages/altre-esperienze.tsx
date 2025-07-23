import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QuickStatsCard } from "@/components/quick-stats-card";
import { TrendingDestinations } from "@/components/trending-destinations";
import { AdvancedReviewsSystem } from "@/components/advanced-reviews-system";
import { SmartBookingAssistant } from "@/components/smart-booking-assistant";
import { WeatherWidget } from "@/components/weather-widget";
import { ExternalServicesQuickAccess } from "@/components/external-services-quick-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  Bot,
  CloudSun,
  Compass,
  Map
} from "lucide-react";

export default function AltreEsperienzePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Esperienze</h1>
              <p className="text-gray-600">Funzionalità avanzate e servizi aggiuntivi per una navigazione completa</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              🌟 Esperienze Premium
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              🤖 IA Integrata
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              📊 Analytics Avanzate
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              ⭐ Recensioni Verificate
            </Badge>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <section className="mb-12">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Statistiche SeaGO in Tempo Reale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuickStatsCard />
            </CardContent>
          </Card>
        </section>

        {/* Main Features Tabs */}
        <Tabs defaultValue="destinations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 gap-2 bg-white p-2 rounded-lg">
            <TabsTrigger value="destinations" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
              <Map className="h-4 w-4" />
              Destinazioni
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
              <Bot className="h-4 w-4" />
              Assistente IA
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-yellow-100">
              <Star className="h-4 w-4" />
              Recensioni
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2 data-[state=active]:bg-green-100">
              <CloudSun className="h-4 w-4" />
              Meteo
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-orange-100">
              <Compass className="h-4 w-4" />
              Servizi
            </TabsTrigger>
          </TabsList>

          {/* Destinazioni in Tendenza */}
          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-purple-600" />
                  Destinazioni in Tendenza del Lazio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendingDestinations />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assistente IA */}
          <TabsContent value="assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmartBookingAssistant />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    Funzionalità IA Avanzate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">🧠 Raccomandazioni Intelligenti</h4>
                    <p className="text-sm text-blue-800">
                      L'IA analizza le tue preferenze e suggerisce le barche più adatte alle tue esigenze
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">💰 Analisi Prezzi Dinamica</h4>
                    <p className="text-sm text-green-800">
                      Monitoriamo i prezzi in tempo reale per offrirti sempre le migliori tariffe
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🗺️ Pianificazione Itinerari</h4>
                    <p className="text-sm text-purple-800">
                      Crea itinerari personalizzati basati su meteo, distanze e punti di interesse
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-2">🌤️ Consigli Meteo Personalizzati</h4>
                    <p className="text-sm text-orange-800">
                      Ricevi alert e consigli basati sulle condizioni meteo-marine in tempo reale
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sistema Recensioni */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Sistema Recensioni Avanzato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedReviewsSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meteo e Condizioni Marine */}
          <TabsContent value="weather" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-green-600" />
                  Meteo e Condizioni Marine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget />
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🌊 Informazioni Meteo Marine Complete</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">• Temperature aria e mare</p>
                      <p className="text-sm text-gray-700">• Velocità e direzione vento</p>
                      <p className="text-sm text-gray-700">• Altezza e periodo onde</p>
                      <p className="text-sm text-gray-700">• Visibilità e pressione atmosferica</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">• Previsioni a 48 ore</p>
                      <p className="text-sm text-gray-700">• Alert condizioni critiche</p>
                      <p className="text-sm text-gray-700">• Raccomandazioni navigazione</p>
                      <p className="text-sm text-gray-700">• Dati da Open-Meteo API</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Servizi Esterni */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-orange-600" />
                  Servizi per la Navigazione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExternalServicesQuickAccess />
                <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🛟 Servizi Integrati SeaGO</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl mb-2">⛽</div>
                      <h5 className="font-semibold text-gray-900">Carburante</h5>
                      <p className="text-sm text-gray-600">Prezzi aggiornati distributori marini</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl mb-2">⚓</div>
                      <h5 className="font-semibold text-gray-900">Porti</h5>
                      <p className="text-sm text-gray-600">Servizi portuali e disponibilità</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl mb-2">🚨</div>
                      <h5 className="font-semibold text-gray-900">Emergenze</h5>
                      <p className="text-sm text-gray-600">Contatti Guardia Costiera 1530</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}