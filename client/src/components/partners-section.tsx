import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import trasportiCapuanoLogo from "@assets/trasporti_capuano_logo_1767885647184.png";

export function PartnersSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            Partner Ufficiali
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            I Nostri Partner
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Collaboriamo con aziende leader del settore per offrirti servizi di qualità superiore.
          </p>
        </div>

        {/* Partner Ufficiale - Trasporti Capuano */}
        <div className="text-center">
          <Card className="inline-block bg-white border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <Badge className="mb-4 bg-green-100 text-green-800">
                Partner Verificato
              </Badge>
              <div className="bg-black rounded-lg p-6 mb-4">
                <img 
                  src={trasportiCapuanoLogo} 
                  alt="Trasporti Capuano - Trasporti Eccezionali" 
                  className="h-24 md:h-32 w-auto mx-auto object-contain"
                  data-testid="img-partner-trasporti-capuano"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trasporti Capuano</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Partner ufficiale per trasporti eccezionali e logistica nautica.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}