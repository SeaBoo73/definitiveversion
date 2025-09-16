import { AdvancedSearch } from "@/components/advanced-search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Compass, Map, Star } from "lucide-react";
import { Link } from "wouter";

export default function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Search className="h-8 w-8 mr-3 text-blue-600" />
                Ricerca Avanzata
              </h1>
              <p className="text-gray-600 mt-2">
                Trova l'imbarcazione perfetta con filtri dettagliati e personalizzati
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" asChild>
                <Link href="/">
                  Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mappa">
                  <Map className="mr-2 h-4 w-4" />
                  Mappa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Tips */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Compass className="h-5 w-5 mr-2" />
              💡 Suggerimenti per la Ricerca
            </CardTitle>
            <CardDescription className="text-blue-100">
              Ottimizza la tua ricerca per trovare l'imbarcazione ideale
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">🎯 Filtri Specifici</h4>
                <p className="text-sm text-blue-100">
                  Usa i filtri avanzati per tipo di imbarcazione, equipaggiamenti e servizi specifici
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">📅 Date Flessibili</h4>
                <p className="text-sm text-blue-100">
                  Cerca in date alternative per trovare prezzi migliori e maggiore disponibilità
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">⚓ Porti Vicini</h4>
                <p className="text-sm text-blue-100">
                  Considera porti nelle vicinanze per ampliare le opzioni disponibili
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Search Component */}
        <AdvancedSearch />

        {/* Search Categories */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔍 Ricerche Popolari</CardTitle>
            <CardDescription>
              Categorie più richieste dai nostri utenti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">POPOLARE</Badge>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <h4 className="font-medium">Gommoni per Famiglie</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Perfetti per gite familiari, 6-8 persone
                </p>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className="bg-green-100 text-green-800">ECO</Badge>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <h4 className="font-medium">Barche senza Patente</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Navigazione libera fino a 6 miglia
                </p>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className="bg-purple-100 text-purple-800">LUSSO</Badge>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <h4 className="font-medium">Yacht con Skipper</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Esperienza premium con equipaggio
                </p>
              </div>

              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className="bg-orange-100 text-orange-800">AVVENTURA</Badge>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <h4 className="font-medium">Charter Multi-giorno</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Crociere ed esplorazioni marine
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Locations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🏖️ Destinazioni in Evidenza</CardTitle>
            <CardDescription>
              I porti più belli del Lazio per le tue avventure marine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-32 rounded-lg mb-3 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Civitavecchia</h3>
                    <p className="text-sm opacity-90">Porto Principale</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Il porto più grande del Lazio, punto di partenza ideale per crociere verso la Sardegna e le isole.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-green-500 to-green-600 h-32 rounded-lg mb-3 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Gaeta</h3>
                    <p className="text-sm opacity-90">Bellezza Storica</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Borgo marinaro incantevole con acque cristalline e spiagge da sogno.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 h-32 rounded-lg mb-3 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Ponza</h3>
                    <p className="text-sm opacity-90">Isola Paradise</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  L'isola delle vacanze per eccellenza, acque turchesi e calette nascoste.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}