import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PerformanceOptimizer } from "@/components/performance-optimizer";
import { AdvancedReviewsSystem } from "@/components/advanced-reviews-system";
import { SmartBookingAssistant } from "@/components/smart-booking-assistant";
import { MobileOptimizations } from "@/components/mobile-optimizations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Zap, 
  MessageSquare, 
  Star, 
  Bot,
  BarChart3,
  Shield,
  Smartphone
} from "lucide-react";

export default function AdminPerformancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Centro di Controllo Avanzato</h1>
              <p className="text-gray-600">Gestione completa performance, recensioni e assistente IA</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✅ Sistema Operativo
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              🚀 Performance Ottimizzate
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              🤖 IA Integrata
            </Badge>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              📱 Mobile Ready
            </Badge>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 gap-2 bg-white p-2 rounded-lg">
            <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-blue-100">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2 data-[state=active]:bg-green-100">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-yellow-100">
              <Star className="h-4 w-4" />
              Recensioni
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2 data-[state=active]:bg-purple-100">
              <Bot className="h-4 w-4" />
              Assistente IA
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-green-100">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Monitoraggio Performance Real-time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceOptimizer />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Tab */}
          <TabsContent value="mobile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Ottimizzazioni Mobile e PWA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MobileOptimizations />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
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

          {/* AI Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SmartBookingAssistant />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    Configurazione IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Stato Servizi IA</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">OpenAI GPT-4</span>
                        <Badge className="bg-green-100 text-green-800">✅ Attivo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Raccomandazioni Barche</span>
                        <Badge className="bg-green-100 text-green-800">✅ Operativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Analisi Prezzi</span>
                        <Badge className="bg-green-100 text-green-800">✅ Operativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Consigli Meteo</span>
                        <Badge className="bg-green-100 text-green-800">✅ Operativo</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Statistiche Utilizzo</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Conversazioni oggi</p>
                        <p className="text-xl font-bold text-blue-600">47</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Raccomandazioni generate</p>
                        <p className="text-xl font-bold text-blue-600">156</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasso conversione</p>
                        <p className="text-xl font-bold text-green-600">68%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Soddisfazione utenti</p>
                        <p className="text-xl font-bold text-yellow-600">4.8/5</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Prestazioni Web",
                  value: "95/100",
                  trend: "+3%",
                  icon: Zap,
                  color: "text-green-600 bg-green-50"
                },
                {
                  title: "Sicurezza",
                  value: "A+",
                  trend: "Stabile",
                  icon: Shield,
                  color: "text-blue-600 bg-blue-50"
                },
                {
                  title: "Mobile Score",
                  value: "98/100",
                  trend: "+5%",
                  icon: Smartphone,
                  color: "text-purple-600 bg-purple-50"
                },
                {
                  title: "User Experience",
                  value: "4.9/5",
                  trend: "+0.2",
                  icon: MessageSquare,
                  color: "text-yellow-600 bg-yellow-50"
                }
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-full ${metric.color} mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-sm text-green-600 mt-1">{metric.trend}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">App SeaBoo</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
                    <p className="text-sm text-gray-600">Operativa e ottimizzata</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Utenti Soddisfatti</h4>
                    <p className="text-3xl font-bold text-green-600 mb-2">96%</p>
                    <p className="text-sm text-gray-600">Rating recensioni positive</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Crescita</h4>
                    <p className="text-3xl font-bold text-purple-600 mb-2">+24%</p>
                    <p className="text-sm text-gray-600">Prenotazioni questo mese</p>
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