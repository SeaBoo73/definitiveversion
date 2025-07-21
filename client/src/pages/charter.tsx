import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Sailboat, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Star,
  Anchor,
  Compass
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";

export function CharterPage() {
  const charterServices = [
    {
      id: "vela-settimanale",
      title: "Vela settimanale con skipper",
      description: "Crociere di una settimana con skipper professionali per esplorare le coste più belle d'Italia",
      icon: <Sailboat className="h-8 w-8" />,
      duration: "7 giorni",
      capacity: "2-8 persone",
      includes: ["Skipper professionista", "Carburante incluso", "Assicurazione", "Pulizie finali"],
      highlights: ["Costa Amalfitana", "Arcipelago Toscano", "Sardegna", "Sicilia"],
      price: "Da €2.500/settimana",
      badge: "Più richiesto",
      color: "bg-ocean-blue",
      searchLink: "/search?boatTypes=sailboat&skipperRequired=true"
    },
    {
      id: "weekend-catamarano",
      title: "Weekend in catamarano",
      description: "Fughe di fine settimana su catamarani spaziosi per gruppi e famiglie",
      icon: <Users className="h-8 w-8" />,
      duration: "2-3 giorni",
      capacity: "4-12 persone",
      includes: ["Imbarcazione completa", "Attrezzature snorkeling", "Frigorifero", "Doccia esterna"],
      highlights: ["Isole Pontine", "Giglio e Giannutri", "Arcipelago della Maddalena", "Egadi"],
      price: "Da €1.200/weekend",
      badge: "Famiglie",
      color: "bg-seafoam",
      searchLink: "/search?boatTypes=catamaran"
    },
    {
      id: "noleggio-privato",
      title: "Noleggio giornaliero privato",
      description: "Imbarcazioni private per giornate esclusive con servizi personalizzati",
      icon: <Star className="h-8 w-8" />,
      duration: "8-12 ore",
      capacity: "2-10 persone",
      includes: ["Skipper dedicato", "Aperitivo a bordo", "Attrezzature acquatiche", "Carburante"],
      highlights: ["Cinque Terre", "Portofino", "Amalfi", "Taormina"],
      price: "Da €800/giorno",
      badge: "Lusso",
      color: "bg-coral",
      searchLink: "/search"
    },
    {
      id: "itinerari-consigliati",
      title: "Itinerari consigliati",
      description: "Percorsi studiati per scoprire le destinazioni più affascinanti del Mediterraneo",
      icon: <Compass className="h-8 w-8" />,
      duration: "Personalizzabile",
      capacity: "Varia",
      includes: ["Pianificazione completa", "Consigli locali", "Punti di interesse", "Assistenza 24h"],
      highlights: ["Rotte personalizzate", "Porti sicuri", "Baie nascoste", "Ristoranti tipici"],
      price: "Su richiesta",
      badge: "Personalizzato",
      color: "bg-deep-navy",
      searchLink: "/esperienze"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pb-20 md:pb-0">
      <Header />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-deep-navy to-ocean-blue">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Servizi Charter Professionali
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              Scopri le nostre soluzioni charter per esperienze nautiche indimenticabili. 
              Dalla vela tradizionale ai catamarani di lusso, ogni viaggio è su misura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3 text-lg">
                <Link href="#servizi">Esplora i servizi</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-deep-navy px-8 py-3 text-lg">
                <Link href="#contatti">Richiedi preventivo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Charter Services */}
      <section id="servizi" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-deep-navy mb-4">I Nostri Servizi Charter</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Soluzioni professionali per ogni tipo di esperienza in mare
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {charterServices.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center justify-center w-16 h-16 ${service.color} text-white rounded-lg mb-4`}>
                      {service.icon}
                    </div>
                    <Badge className="bg-coral text-white">{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl text-deep-navy group-hover:text-coral transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Service Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-coral" />
                      <span className="text-gray-600">{service.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-coral" />
                      <span className="text-gray-600">{service.capacity}</span>
                    </div>
                  </div>

                  {/* Includes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Incluso nel servizio:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {service.includes.map((item, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-coral rounded-full"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Destinazioni principali:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.map((highlight, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-lg font-bold text-deep-navy">
                      {service.price}
                    </div>
                    <Button asChild className="bg-coral hover:bg-orange-600 text-white">
                      <Link href={service.searchLink}>Scopri disponibilità</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Charter */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-deep-navy mb-4">Perché Scegliere i Nostri Charter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-coral text-white rounded-full mb-6">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-deep-navy mb-4">Skipper Certificati</h3>
              <p className="text-gray-600">
                Tutti i nostri skipper sono professionisti certificati con anni di esperienza nel Mediterraneo
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-blue text-white rounded-full mb-6">
                <Anchor className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-deep-navy mb-4">Flotta Moderna</h3>
              <p className="text-gray-600">
                Imbarcazioni sempre in perfette condizioni, revisionate e dotate di tutte le attrezzature di sicurezza
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafoam text-white rounded-full mb-6">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-deep-navy mb-4">Conoscenza Locale</h3>
              <p className="text-gray-600">
                Ti portiamo nei luoghi più belli e meno conosciuti, lontano dalle rotte turistiche tradizionali
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="py-16 bg-gradient-to-r from-deep-navy to-ocean-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Richiedi un Preventivo Personalizzato
            </h2>
            <p className="text-xl text-ocean-light mb-8 max-w-2xl mx-auto">
              Ogni charter è unico. Contattaci per creare l'esperienza perfetta per te e il tuo gruppo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white px-8 py-3">
                <Link href="/search">Esplora le imbarcazioni</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-deep-navy px-8 py-3">
                <Link href="#help">Contatta il team charter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <MobileNavigation />
    </div>
  );
}