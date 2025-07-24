import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Truck, Shield, Clock, Award } from "lucide-react";

export function PartnersSection() {
  const partners = [
    {
      id: 1,
      name: "Capuano Trasporti",
      website: "https://www.capuanotrasporti.com/",
      logo: "🚛", // Placeholder - user can replace with actual logo
      category: "Trasporti Nautici",
      description: "Trasporti specializzati per imbarcazioni e servizi logistici marittimi",
      services: [
        "Trasporto imbarcazioni",
        "Servizi di alaggio e varo",
        "Logistica portuale",
        "Trasporti specializzati"
      ],
      features: [
        { icon: Truck, text: "Trasporti specializzati" },
        { icon: Shield, text: "Assicurazione completa" },
        { icon: Clock, text: "Servizio 24/7" },
        { icon: Award, text: "Esperienza ventennale" }
      ],
      rating: 4.8,
      reviews: 156,
      verified: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            🤝 Partner Ufficiali
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            I Nostri Partner di Fiducia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collaboriamo con i migliori fornitori di servizi nautici per offrirti un'esperienza completa e professionale
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <Card key={partner.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                {/* Header con Logo e Verificato */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{partner.logo}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {partner.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {partner.category}
                      </Badge>
                    </div>
                  </div>
                  {partner.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      ✓ Verificato
                    </Badge>
                  )}
                </div>

                {/* Descrizione */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {partner.description}
                </p>

                {/* Servizi */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Servizi:</h4>
                  <div className="flex flex-wrap gap-1">
                    {partner.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {partner.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{partner.services.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {partner.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                      <feature.icon className="h-3 w-3 text-blue-500" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Rating e Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(partner.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium">{partner.rating}</span>
                    <span className="text-xs text-gray-500">({partner.reviews} recensioni)</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  onClick={() => window.open(partner.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visita Sito Web
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action per nuovi partner */}
        <div className="mt-12 text-center">
          <Card className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Diventa Partner SeaGO</h3>
              <p className="mb-4 text-blue-100">
                Unisciti alla nostra rete di partner qualificati e fai crescere il tuo business nel settore nautico
              </p>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Candidati Come Partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}