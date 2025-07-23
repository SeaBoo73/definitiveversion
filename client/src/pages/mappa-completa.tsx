import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { GoogleMapsEmbed } from "@/components/google-maps-embed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Anchor, Filter } from "lucide-react";

export default function MappaCompletaPage() {
  const porti = [
    { nome: "Civitavecchia", barche: 25, tipo: "Porto principale" },
    { nome: "Gaeta", barche: 18, tipo: "Marina turistica" },
    { nome: "Anzio", barche: 15, tipo: "Porto storico" },
    { nome: "Terracina", barche: 12, tipo: "Marina moderna" },
    { nome: "Ponza", barche: 8, tipo: "Isola" },
    { nome: "Formia", barche: 6, tipo: "Porto peschereccio" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mappa Completa delle Imbarcazioni
          </h1>
          <p className="text-gray-600">
            Esplora tutte le imbarcazioni disponibili nei porti del Lazio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con filtri */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtri</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full" variant="outline">
                    Tutti i porti
                  </Button>
                  <Button className="w-full" variant="outline">
                    Solo yacht
                  </Button>
                  <Button className="w-full" variant="outline">
                    Senza patente
                  </Button>
                  <Button className="w-full" variant="outline">
                    Con skipper
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista porti */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Porti Principali</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {porti.map((porto, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{porto.nome}</p>
                        <p className="text-sm text-gray-600">{porto.tipo}</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Anchor className="h-3 w-3" />
                          <span>{porto.barche}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mappa */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden">
                  <GoogleMapsEmbed />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}