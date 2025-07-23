import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Euro, Star } from "lucide-react";
import { Link } from "wouter";

export function TrendingDestinations() {
  const destinations = [
    {
      name: "Ponza",
      region: "Lazio",
      popularity: "🔥 In tendenza",
      priceRange: "€150-400",
      rating: 4.9,
      boats: 12,
      highlight: "Acque cristalline",
      image: "🏝️"
    },
    {
      name: "Civitavecchia", 
      region: "Lazio",
      popularity: "⭐ Popolare",
      priceRange: "€200-600",
      rating: 4.7,
      boats: 25,
      highlight: "Porto principale",
      image: "⚓"
    },
    {
      name: "Gaeta",
      region: "Lazio", 
      popularity: "💎 Premium",
      priceRange: "€180-350",
      rating: 4.8,
      boats: 18,
      highlight: "Montagne e mare",
      image: "🌊"
    },
    {
      name: "Anzio",
      region: "Lazio",
      popularity: "🌟 Emergente", 
      priceRange: "€120-280",
      rating: 4.6,
      boats: 15,
      highlight: "Storia e natura",
      image: "🏛️"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Destinazioni in Tendenza</h2>
          </div>
          <p className="text-lg text-gray-600">Scopri le mete più amate dai nostri utenti nel Lazio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{dest.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{dest.region}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dest.popularity}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prezzo/giorno</span>
                    <span className="font-semibold text-green-600">{dest.priceRange}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valutazione</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Barche</span>
                    <span className="font-semibold text-blue-600">{dest.boats} disponibili</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium mb-3">{dest.highlight}</p>
                  <Button asChild size="sm" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Link href={`/search?location=${dest.name}`}>
                      Esplora {dest.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}