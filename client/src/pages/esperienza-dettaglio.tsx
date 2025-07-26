import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link, useRoute } from "wouter";
import { 
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Star,
  Calendar,
  Euro,
  Phone,
  Mail,
  CheckCircle2
} from "lucide-react";

export default function EsperienzaDettaglio() {
  const [match, params] = useRoute("/esperienza/:tipo");
  const tipo = params?.tipo || "";

  const esperienze = {
    "tramonto": {
      title: "Tramonti in barca",
      description: "Gite al tramonto con aperitivo a bordo",
      badge: "Romantico",
      badgeColor: "bg-pink-100 text-pink-700",
      durata: "3 ore",
      persone: "2-12 persone",
      prezzo: "€89",
      location: "Civitavecchia, Gaeta, Anzio, Napoli, Sorrento, Capri",
      rating: 4.8,
      reviews: 142,
      dettagli: [
        "Aperitivo con prosecco e stuzzichini inclusi",
        "Navigazione verso i punti più suggestivi della costa",
        "Foto ricordo del tramonto",
        "Musica di sottofondo romantica",
        "Skipper esperto incluso"
      ],
      programma: [
        "17:30 - Imbarco e briefing di sicurezza",
        "18:00 - Partenza dal porto",
        "18:30 - Navigazione verso il punto panoramico",
        "19:00 - Aperitivo al tramonto",
        "20:30 - Rientro al porto"
      ],
      incluso: ["Skipper", "Aperitivo", "Stuzzichini", "Bevande analcoliche"],
      nonIncluso: ["Trasporto al porto", "Cena", "Mance"]
    },
    "tour-isole": {
      title: "Tour delle isole nascoste",
      description: "Esplorazioni di calette e baie accessibili solo via mare",
      badge: "Avventura",
      badgeColor: "bg-green-100 text-green-700",
      durata: "8 ore",
      persone: "4-12 persone",
      prezzo: "€159",
      location: "Ponza, Ventotene, Capri, Ischia, Procida, Amalfi",
      rating: 4.9,
      reviews: 89,
      dettagli: [
        "Esplorazione di 3-4 calette nascoste",
        "Soste per bagni e snorkeling",
        "Pranzo tipico a bordo",
        "Attrezzatura snorkeling inclusa",
        "Guida esperta delle isole"
      ],
      programma: [
        "08:30 - Imbarco e colazione di benvenuto",
        "09:00 - Partenza verso le isole",
        "10:30 - Prima sosta: Cala Feola",
        "12:00 - Snorkeling a Punta Rossa",
        "13:30 - Pranzo a bordo",
        "15:00 - Palmarola e le sue grotte",
        "17:00 - Rientro al porto"
      ],
      incluso: ["Skipper", "Pranzo", "Attrezzatura snorkeling", "Carburante"],
      nonIncluso: ["Trasporto al porto", "Bevande alcoliche extra", "Mance"]
    }
  };

  const esperienza = esperienze[tipo as keyof typeof esperienze];

  if (!esperienza) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Esperienza non trovata</h1>
          <Button asChild>
            <Link href="/esperienze">Torna alle esperienze</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Link href="/esperienze">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ← Torna alle esperienze
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Badge className={`${esperienza.badgeColor} border-0 text-sm font-medium`}>
              {esperienza.badge}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{esperienza.rating}</span>
              <span className="text-blue-200">({esperienza.reviews} recensioni)</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{esperienza.title}</h1>
          <p className="text-xl text-blue-100 mb-6">{esperienza.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{esperienza.durata}</div>
              <div className="text-blue-200 text-sm">Durata</div>
            </div>
            <div>
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{esperienza.persone}</div>
              <div className="text-blue-200 text-sm">Partecipanti</div>
            </div>
            <div>
              <MapPin className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{esperienza.location}</div>
              <div className="text-blue-200 text-sm">Partenza</div>
            </div>
            <div>
              <Euro className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">{esperienza.prezzo}</div>
              <div className="text-blue-200 text-sm">A persona</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dettagli */}
            <Card>
              <CardHeader>
                <CardTitle>Cosa include l'esperienza</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {esperienza.dettagli.map((dettaglio, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{dettaglio}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Programma */}
            <Card>
              <CardHeader>
                <CardTitle>Programma dettagliato</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {esperienza.programma.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Incluso/Non Incluso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Incluso nel prezzo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {esperienza.incluso.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Non incluso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {esperienza.nonIncluso.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="h-4 w-4 text-red-600 text-center">×</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  {esperienza.prezzo} <span className="text-base font-normal text-gray-600">/ persona</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full bg-coral hover:bg-orange-600 text-white text-lg py-3">
                  <Link href={`/prenota-esperienza/${tipo}`}>
                    <Calendar className="h-5 w-5 mr-2" />
                    Prenota ora
                  </Link>
                </Button>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>Assistenza telefonica</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Conferma immediata via email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cancellazione gratuita fino a 24h prima</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}