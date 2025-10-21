import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Users, MapPin, Star } from "lucide-react";
import { Boat } from "@shared/schema";
import { MobileNavigation } from "@/components/mobile-navigation";

// Import all category images
import gommoneImage from "@assets/gommone senza patente_1752875806367.webp";
import jetskiImage from "@assets/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg";
import barcheSenzaPatenteImage from "@assets/OIP (1)_1752921317486.webp";
import catamaranoImage from "@assets/catamarano ludovica_1752876117442.jpg";
import charterImage from "@assets/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg";
import sailboatImage from "@assets/barca a vela ludovica_1752876195081.jpg";
import houseboatImage from "@assets/OIP_1752919948843.webp";
import motorboatImage from "@assets/R (1)_1752920495156.jpg";
import caiaccoImage from "@assets/caiacco_1753599016775.jpg";

const categoryMapping = [
  {
    id: "gommone",
    name: "Gommoni",
    description: "Imbarcazioni pneumatiche versatili e sicure",
    image: gommoneImage,
  },
  {
    id: "barche-senza-patente",
    name: "Barche senza patente",
    description: "Facili da guidare, perfette per principianti",
    image: barcheSenzaPatenteImage,
  },
  {
    id: "yacht",
    name: "Yacht",
    description: "Lusso e comfort per una navigazione esclusiva",
    image: motorboatImage,
  },
  {
    id: "sailboat",
    name: "Barche a vela",
    description: "L'esperienza autentica della navigazione",
    image: sailboatImage,
  },
  {
    id: "jetski",
    name: "Moto d'acqua", 
    description: "Adrenalina e velocità sull'acqua",
    image: jetskiImage,
  },
  {
    id: "catamarano",
    name: "Catamarani",
    description: "Spazio e stabilità per gruppi numerosi",
    image: catamaranoImage,
  },
  {
    id: "charter",
    name: "Charter",
    description: "Esperienza completa con skipper professionista",
    image: charterImage,
  },
  {
    id: "houseboat",
    name: "Houseboat",
    description: "La tua casa galleggiante per vacanze uniche",
    image: houseboatImage,
  },
  {
    id: "motorboat",
    name: "Barche a motore",
    description: "Velocità e comfort per esplorare la costa", 
    image: motorboatImage,
  },
  {
    id: "kayak",
    name: "Caiacco",
    description: "Tradizione e autenticità per esplorare coste e calette",
    image: caiaccoImage,
  },
];

export default function CategoriesPage() {
  const [location, setLocation] = useLocation();
  const { data: boats = [], isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  // Scroll to top when component mounts or location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  // Calculate real counts for each category
  const getCategoryCount = (categoryId: string) => {
    return boats.filter(boat => boat.type === categoryId).length;
  };

  // Create categories with dynamic counters
  const categories = categoryMapping.map(cat => ({
    ...cat,
    count: getCategoryCount(cat.id)
  }));

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/search?boatTypes=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-blue to-deep-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mr-4"
              onClick={() => setLocation('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Home
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Esplora tutte le categorie
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Scopri la nostra collezione completa di imbarcazioni. 
              Trova quella perfetta per la tua prossima avventura in mare.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {categories.length} Categorie Disponibili
            </h2>
            <p className="text-lg text-gray-600">
              Ogni categoria offre imbarcazioni uniche per esperienze diverse
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  
                  {/* Category Count Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-gray-800 font-bold px-3 py-1">
                      {category.count} {category.count === 1 ? 'barca' : 'barche'}
                    </Badge>
                  </div>

                  {/* Category Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Lazio
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        2-12 persone
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-ocean-blue to-deep-navy hover:from-deep-navy hover:to-ocean-blue transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Esplora {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Non trovi quello che cerchi?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Utilizza la nostra ricerca avanzata per trovare l'imbarcazione perfetta 
                in base alle tue esigenze specifiche.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-ocean-blue to-deep-navy">
                  <Link href="/ricerca-avanzata">
                    <Search className="h-5 w-5 mr-2" />
                    Ricerca Avanzata
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contatti">
                    Contattaci per Aiuto
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNavigation />
    </div>
  );
}