import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PortSelector } from "@/components/port-selector";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { 
  Sunset, 
  MapPin, 
  Sailboat, 
  Fish, 
  ChefHat, 
  Wine, 
  Heart, 
  Ship,
  Search,
  Clock,
  Users,
  Euro,
  Loader2
} from "lucide-react";
import type { Experience } from "@shared/schema";
import { ImageCarousel } from "@/components/image-carousel";
import heroBackground from "@assets/ultra-realistic_wide_banner_photo_upper_half-_real_hot_air_balloons_flying_in_a_clear_sky_with_natu_bulwsrzxfrv4rr4z3f37_3_1764073467671.png";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { SEOHead, seoConfigs } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

const categoryLabels: Record<string, string> = {
  sunset: "Tramonto",
  fishing: "Pesca sportiva",
  diving: "Immersioni",
  aperitivo: "Aperitivo",
  tour: "Tour",
  sport: "Sport",
  romantic: "Romantico",
};

export function EsperienzePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [porto, setPorto] = useState("");
  const [dataDal, setDataDal] = useState("");
  const [dataAl, setDataAl] = useState("");
  const [numeroPersone, setNumeroPersone] = useState("");
  const [tipoEsperienza, setTipoEsperienza] = useState("");

  const { data: dbExperiences = [], isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
  });

  const filteredExperiences = dbExperiences.filter(exp => {
    if (porto && !exp.location?.toLowerCase().includes(porto.toLowerCase())) return false;
    if (tipoEsperienza && tipoEsperienza !== "tutti" && exp.category !== tipoEsperienza) return false;
    return true;
  });

  const handleSearch = () => {
    if (filteredExperiences.length === 0) {
      toast({
        title: "Nessuna esperienza trovata",
        description: "Prova a modificare i filtri di ricerca",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 md:pb-0">
      <SEOHead {...seoConfigs.esperienze} />
      <StructuredData type="esperienze" />
      <Header />
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative text-white py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-900/90 backdrop-blur-md rounded-3xl px-4 md:px-8 py-6 md:py-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Esperienze Uniche in Mare
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-md mx-auto mb-6">
                Scopri avventure, relax e gusto a bordo<br/>
                delle nostre imbarcazioni. Vivi il mare come mai prima!
              </p>
              <Button onClick={handleSearch} size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3 text-lg">
                Trova la tua esperienza
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Search className="h-5 w-5 mr-2" />
                  Affina la ricerca
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="porto" className="text-sm font-medium">Porto</Label>
                  <PortSelector
                    value={porto}
                    onChange={setPorto}
                    placeholder="Cerca tra 48 porti di Lazio e Campania..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dal" className="text-sm font-medium">Dal</Label>
                  <Input
                    id="dal"
                    type="date"
                    value={dataDal}
                    onChange={(e) => setDataDal(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="al" className="text-sm font-medium">Al</Label>
                  <Input
                    id="al"
                    type="date"
                    value={dataAl}
                    onChange={(e) => setDataAl(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persone" className="text-sm font-medium">Numero persone</Label>
                  <Select value={numeroPersone} onValueChange={setNumeroPersone}>
                    <SelectTrigger>
                      <SelectValue placeholder="2 ospiti" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 persona</SelectItem>
                      <SelectItem value="2">2 persone</SelectItem>
                      <SelectItem value="3">3 persone</SelectItem>
                      <SelectItem value="4">4 persone</SelectItem>
                      <SelectItem value="5">5 persone</SelectItem>
                      <SelectItem value="6">6 persone</SelectItem>
                      <SelectItem value="8">8 persone</SelectItem>
                      <SelectItem value="10">10 persone</SelectItem>
                      <SelectItem value="12">12+ persone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium">Tipo esperienza</Label>
                  <Select value={tipoEsperienza} onValueChange={setTipoEsperienza}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutti">Tutti i tipi</SelectItem>
                      <SelectItem value="tramonto">Tramonti in barca</SelectItem>
                      <SelectItem value="tour-isole">Tour delle isole</SelectItem>
                      <SelectItem value="vela">Giornate in barca a vela</SelectItem>
                      <SelectItem value="pesca">Pesca sportiva</SelectItem>
                      <SelectItem value="cena">Cena romantica</SelectItem>
                      <SelectItem value="aperitivo">Aperitivo in rada</SelectItem>
                      <SelectItem value="degustazione">Degustazione prodotti tipici</SelectItem>
                      <SelectItem value="snorkeling">Snorkeling e immersioni</SelectItem>
                      <SelectItem value="charter-skipper">Charter con skipper</SelectItem>
                      <SelectItem value="charter-bareboat">Charter bareboat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} className="w-full bg-coral hover:bg-orange-600 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Cerca esperienze
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div>
              <h3 className="text-2xl font-bold text-deep-navy mb-6 text-center">
                Esperienze disponibili
              </h3>
              {experiencesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredExperiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredExperiences.map((exp) => (
                    <Card key={exp.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <ImageCarousel
                          images={exp.images || []}
                          alt={exp.name}
                          className="h-48"
                          fallback={
                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center">
                              <Sunset className="h-12 w-12 text-orange-400" />
                            </div>
                          }
                        />
                        <Badge className="absolute top-3 left-3 bg-blue-600 text-white z-20">
                          {categoryLabels[exp.category] || exp.category}
                        </Badge>
                        {user && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite('experience', exp.id);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-20"
                          >
                            <Heart className={`h-4 w-4 ${isFavorite('experience', exp.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h4 className="font-bold text-lg text-gray-900 mb-2">{exp.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exp.description}</p>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{exp.duration}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Max {exp.maxParticipants}</span>
                          </div>
                        </div>
                        {exp.includes && exp.includes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {exp.includes.slice(0, 3).map((item, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-xl font-bold text-green-600">
                            €{exp.pricePerPerson}<span className="text-sm font-normal text-gray-500">/persona</span>
                          </div>
                          <Button className="bg-coral hover:bg-orange-600" asChild>
                            <Link href={`/esperienza/${exp.id}`}>
                              Prenota
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sunset className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Nessuna esperienza disponibile</h4>
                  <p className="text-gray-600">Le esperienze saranno disponibili presto. Torna a trovarci!</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}
