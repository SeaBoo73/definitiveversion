import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PortSelector } from "@/components/port-selector";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Sunset, 
  MapPin, 
  Sailboat, 
  Fish, 
  ChefHat, 
  Wine, 
  Heart, 
  Ship,
  Search
} from "lucide-react";
import heroBackground from "@assets/ultra-realistic_wide_banner_photo_upper_half-_real_hot_air_balloons_flying_in_a_clear_sky_with_natu_bulwsrzxfrv4rr4z3f37_3_1764073467671.png";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { SEOHead, seoConfigs } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function EsperienzePage() {
  const { toast } = useToast();
  const [porto, setPorto] = useState("");
  const [dataDal, setDataDal] = useState("");
  const [dataAl, setDataAl] = useState("");
  const [numeroPersone, setNumeroPersone] = useState("");
  const [tipoEsperienza, setTipoEsperienza] = useState("");

  const handleSearch = () => {
    toast({
      title: "Esperienze in arrivo!",
      description: "Le esperienze saranno disponibili a breve. Nel frattempo, esplora le nostre barche.",
    });
  };

  const experienceTypes = [
    { icon: <Sunset className="h-8 w-8" />, title: "Tramonti in barca", description: "Gite al tramonto con aperitivo" },
    { icon: <MapPin className="h-8 w-8" />, title: "Tour delle isole", description: "Esplora calette nascoste" },
    { icon: <Sailboat className="h-8 w-8" />, title: "Giornate in vela", description: "Navigazione rilassante" },
    { icon: <Fish className="h-8 w-8" />, title: "Pesca sportiva", description: "Con pescatore locale" },
    { icon: <ChefHat className="h-8 w-8" />, title: "Cena a bordo", description: "Chef privato a bordo" },
    { icon: <Wine className="h-8 w-8" />, title: "Aperitivo in rada", description: "Bollicine al tramonto" },
    { icon: <Heart className="h-8 w-8" />, title: "Eventi romantici", description: "Proposte e anniversari" },
    { icon: <Ship className="h-8 w-8" />, title: "Charter premium", description: "Yacht con equipaggio" },
  ];

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
              <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3 text-lg">
                <Link href="/search">Trova la tua esperienza</Link>
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
                    placeholder="Tutti i porti"
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
            {/* Experience Types Preview */}
            <div>
              <h3 className="text-2xl font-bold text-deep-navy mb-6 text-center">
                Tipologie di esperienze
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {experienceTypes.map((type, index) => (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="py-6">
                      <div className="flex justify-center mb-3 text-blue-500">
                        {type.icon}
                      </div>
                      <h4 className="font-semibold text-deep-navy text-sm mb-1">
                        {type.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {type.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}
