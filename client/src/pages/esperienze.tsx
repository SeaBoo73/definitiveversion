import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PortSelector } from "@/components/port-selector";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Sunset, 
  MapPin, 
  Sailboat, 
  Fish, 
  ChefHat, 
  Wine, 
  UtensilsCrossed, 
  Camera, 
  GraduationCap, 
  PartyPopper, 
  Heart, 
  Users,
  Ship,
  Crown,
  Calendar,
  Search
} from "lucide-react";
import seabooLogo from "@assets/ChatGPT Image 7 ago 2025, 07_13_19_1754544753003.png";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { SEOHead, seoConfigs } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function EsperienzePage() {
  const [porto, setPorto] = useState("");
  const [dataDal, setDataDal] = useState("");
  const [dataAl, setDataAl] = useState("");
  const [numeroPersone, setNumeroPersone] = useState("");
  const [tipoEsperienza, setTipoEsperienza] = useState("");

  const experiences = [
    {
      category: "Tour ed Escursioni Tematiche",
      icon: <Sunset className="h-6 w-6" />,
      items: [
        {
          title: "Tramonti in barca",
          description: "Gite al tramonto con aperitivo a bordo",
          icon: <Sunset className="h-5 w-5" />,
          badge: "Romantico"
        },
        {
          title: "Tour delle isole nascoste",
          description: "Esplorazioni di calette e baie accessibili solo via mare",
          icon: <MapPin className="h-5 w-5" />,
          badge: "Avventura"
        },
        {
          title: "Giornate in barca a vela",
          description: "Esperienze giornaliere o weekend su vela",
          icon: <Sailboat className="h-5 w-5" />,
          badge: "Relax"
        },
        {
          title: "Noleggio con pescatore locale",
          description: "Escursioni autentiche con chi vive il mare ogni giorno",
          icon: <Fish className="h-5 w-5" />,
          badge: "Autentico"
        }
      ]
    },
    {
      category: "Esperienze Gourmet",
      icon: <ChefHat className="h-6 w-6" />,
      items: [
        {
          title: "Cena romantica a bordo",
          description: "Con chef privato per una serata indimenticabile",
          icon: <Heart className="h-5 w-5" />,
          badge: "Lusso"
        },
        {
          title: "Aperitivo in rada",
          description: "Bollicine e finger food ancorati in una baia tranquilla",
          icon: <Wine className="h-5 w-5" />,
          badge: "Aperitivo"
        },
        {
          title: "Degustazione prodotti tipici",
          description: "Prodotti locali legati alla costa o alle isole visitate",
          icon: <UtensilsCrossed className="h-5 w-5" />,
          badge: "Tipico"
        }
      ]
    },
    {
      category: "Attività a Bordo",
      icon: <img src={seabooLogo} alt="SeaBoo" className="h-6 w-6 object-contain" />,
      items: [
        {
          title: "Snorkeling e immersioni",
          description: "Pacchetti attrezzati con guida esperta",
          icon: <Camera className="h-5 w-5" />,
          badge: "Sport"
        },
        {
          title: "Pesca sportiva o tradizionale",
          description: "Esperienza di pesca con attrezzatura inclusa",
          icon: <Fish className="h-5 w-5" />,
          badge: "Pesca"
        },
        {
          title: "Lezioni di vela",
          description: "Navigazione per principianti con istruttore qualificato",
          icon: <GraduationCap className="h-5 w-5" />,
          badge: "Formativo"
        }
      ]
    },
    {
      category: "Charter e Noleggi Premium",
      icon: <Ship className="h-6 w-6" />,
      items: [
        {
          title: "Charter con skipper",
          description: "Noleggi con skipper professionale per navigare in sicurezza",
          icon: <Users className="h-5 w-5" />,
          badge: "Skipper"
        },
        {
          title: "Charter bareboat",
          description: "Noleggio senza equipaggio per marinai esperti",
          icon: <Ship className="h-5 w-5" />,
          badge: "Indipendente"
        },
        {
          title: "Charter di lusso",
          description: "Yacht premium con equipaggio e servizi esclusivi",
          icon: <Crown className="h-5 w-5" />,
          badge: "Lusso"
        },
        {
          title: "Charter multi-giorno",
          description: "Crociere da 3-7 giorni nelle isole del Lazio",
          icon: <Calendar className="h-5 w-5" />,
          badge: "Crociera"
        }
      ]
    },
    {
      category: "Eventi Speciali",
      icon: <PartyPopper className="h-6 w-6" />,
      items: [
        {
          title: "Feste private",
          description: "Addii al celibato/nubilato, compleanni, anniversari",
          icon: <PartyPopper className="h-5 w-5" />,
          badge: "Festa"
        },
        {
          title: "Matrimoni e proposte",
          description: "Matrimoni e proposte di matrimonio in barca",
          icon: <Heart className="h-5 w-5" />,
          badge: "Romantico"
        },
        {
          title: "Team building aziendali",
          description: "Attività a bordo per rafforzare il team",
          icon: <Users className="h-5 w-5" />,
          badge: "Business"
        }
      ]
    }
  ];

  const badgeColors = {
    "Romantico": "bg-pink-100 text-pink-700",
    "Avventura": "bg-orange-100 text-orange-700",
    "Relax": "bg-blue-100 text-blue-700",
    "Autentico": "bg-green-100 text-green-700",
    "Lusso": "bg-purple-100 text-purple-700",
    "Aperitivo": "bg-amber-100 text-amber-700",
    "Tipico": "bg-emerald-100 text-emerald-700",
    "Sport": "bg-cyan-100 text-cyan-700",
    "Pesca": "bg-teal-100 text-teal-700",
    "Formativo": "bg-indigo-100 text-indigo-700",
    "Festa": "bg-rose-100 text-rose-700",
    "Business": "bg-slate-100 text-slate-700"
  };

  const getExperienceSlug = (title: string) => {
    const mapping: Record<string, string> = {
      "Tramonti in barca": "tramonto",
      "Tour delle isole nascoste": "tour-isole",
      "Giornate in barca a vela": "vela",
      "Degustazioni di prodotti tipici": "degustazione",
      "Pesca sportiva": "pesca-sportiva",
      "Cene romantiche in barca": "cena-romantica",
      "Aperitivi al tramonto": "aperitivo-tramonto",
      "Snorkeling e immersioni": "snorkeling",
      "Charter con skipper esperto": "charter-skipper",
      "Charter bareboat": "charter-bareboat",
      "Yacht di lusso": "yacht-lusso",
      "Charter multi-giorno": "charter-multigiorno",
      "Feste private": "feste-private",
      "Matrimoni e proposte": "matrimoni-proposte",
      "Team building aziendali": "team-building"
    };
    return mapping[title] || "tramonto";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 md:pb-0">
      <SEOHead {...seoConfigs.esperienze} />
      <StructuredData type="esperienze" />
      <Header />
      <Breadcrumbs />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-deep-navy to-ocean-blue">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Esperienze Uniche in Mare
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              Scopri un mondo di avventure, relax e gusto a bordo delle nostre imbarcazioni. 
              Ogni esperienza è pensata per creare ricordi indimenticabili.
            </p>
            <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3 text-lg">
              <Link href="/search">Trova la tua esperienza</Link>
            </Button>
          </div>
        </div>
      </div>

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
                {/* Porto */}
                <div className="space-y-2">
                  <Label htmlFor="porto" className="text-sm font-medium">Porto</Label>
                  <PortSelector
                    value={porto}
                    onChange={setPorto}
                    placeholder="Tutti i porti"
                  />
                </div>

                {/* Dal */}
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

                {/* Al */}
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

                {/* Numero persone */}
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

                {/* Tipo esperienza */}
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

                {/* Search Button */}
                <Button className="w-full bg-coral hover:bg-orange-600 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Cerca esperienze
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Experiences Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-12">
              {experiences.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-coral rounded-lg text-white">
                      {category.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-deep-navy">
                      {category.category}
                    </h2>
                  </div>

                  {/* Experience Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center justify-center w-10 h-10 bg-ocean-light rounded-lg text-deep-navy">
                                {item.icon}
                              </div>
                              <CardTitle className="text-lg text-deep-navy group-hover:text-coral transition-colors">
                                {item.title}
                              </CardTitle>
                            </div>
                            <Badge className={`${badgeColors[item.badge as keyof typeof badgeColors]} border-0`}>
                              {item.badge}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sea-gray text-base leading-relaxed">
                            {item.description}
                          </CardDescription>
                          <div className="mt-4">
                            <Button asChild variant="outline" className="w-full border-coral text-red-600 hover:bg-coral hover:text-white font-semibold">
                              <Link href={`/esperienza/${getExperienceSlug(item.title)}`}>Scopri di più</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-deep-navy to-ocean-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto per la tua prossima avventura?
            </h2>
            <p className="text-xl text-ocean-light mb-8 max-w-2xl mx-auto">
              Ogni esperienza può essere personalizzata secondo le tue esigenze. 
              Contattaci per creare l'esperienza perfetta per te.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3">
                <Link href="/search">Esplora le imbarcazioni</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white bg-white text-deep-navy hover:bg-gray-100 hover:text-deep-navy px-8 py-3">
                <Link href="#help">Contattaci</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}