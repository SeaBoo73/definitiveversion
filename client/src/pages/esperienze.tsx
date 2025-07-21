import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sunset, 
  MapPin, 
  Sailboat, 
  Fish, 
  ChefHat, 
  Wine, 
  UtensilsCrossed, 
  Waves, 
  Camera, 
  GraduationCap, 
  PartyPopper, 
  Heart, 
  Users 
} from "lucide-react";

export function EsperienzePage() {
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
      category: "🍽️ Esperienze Gourmet",
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
      category: "🎣 Attività a Bordo",
      icon: <Waves className="h-6 w-6" />,
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
      category: "🎉 Eventi Speciali",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
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

      {/* Experiences Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                        <Button asChild variant="outline" className="w-full border-coral text-coral hover:bg-coral hover:text-white">
                          <Link href="/search">Scopri di più</Link>
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
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-deep-navy px-8 py-3">
                <Link href="#help">Contattaci</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}