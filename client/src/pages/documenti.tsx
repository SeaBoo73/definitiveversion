import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CreditCard, Shield, AlertTriangle, CheckCircle, User, Anchor, Car } from "lucide-react";

export default function DocumentiPage() {
  const documentTypes = [
    {
      category: "Documenti obbligatori",
      required: true,
      icon: <FileText className="h-6 w-6 text-red-600" />,
      documents: [
        {
          name: "Documento di identità valido",
          description: "Carta d'identità, passaporto o patente di guida",
          required: true,
          notes: "Deve essere in corso di validità e non scaduto"
        },
        {
          name: "Codice fiscale",
          description: "Tessera sanitaria o certificato di attribuzione",
          required: true,
          notes: "Necessario per la registrazione del contratto"
        }
      ]
    },
    {
      category: "Per imbarcazioni senza patente",
      required: false,
      icon: <Anchor className="h-6 w-6 text-green-600" />,
      documents: [
        {
          name: "Nessuna patente richiesta",
          description: "Imbarcazioni fino a 40 CV senza patente nautica",
          required: false,
          notes: "Età minima 18 anni. Briefing di sicurezza obbligatorio"
        },
        {
          name: "Esperienza di navigazione",
          description: "Dichiarazione di esperienza (consigliata)",
          required: false,
          notes: "Utile per dimostrare competenze nautiche di base"
        }
      ]
    },
    {
      category: "Patenti nautiche",
      required: false,
      icon: <Car className="h-6 w-6 text-blue-600" />,
      documents: [
        {
          name: "Patente nautica entro 12 miglia",
          description: "Per imbarcazioni oltre 40 CV o 10 metri",
          required: false,
          notes: "Obbligatoria per motori oltre 40 CV"
        },
        {
          name: "Patente nautica senza limiti",
          description: "Per navigazione oltre 12 miglia dalla costa",
          required: false,
          notes: "Richiesta per charter e yacht di lusso"
        },
        {
          name: "Certificato VHF",
          description: "Certificato di operatore radio VHF",
          required: false,
          notes: "Obbligatorio per imbarcazioni con radio VHF"
        }
      ]
    },
    {
      category: "Documenti di pagamento",
      required: true,
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      documents: [
        {
          name: "Carta di credito valida",
          description: "Visa, Mastercard, American Express",
          required: true,
          notes: "Per il pagamento e la cauzione di sicurezza"
        },
        {
          name: "Autorizzazione prelievo cauzione",
          description: "Consenso per il blocco della cauzione",
          required: true,
          notes: "Importo variabile da €500 a €2000 a seconda dell'imbarcazione"
        }
      ]
    },
    {
      category: "Assicurazione e garanzie",
      required: false,
      icon: <Shield className="h-6 w-6 text-orange-600" />,
      documents: [
        {
          name: "Assicurazione di viaggio",
          description: "Copertura per annullamenti e emergenze",
          required: false,
          notes: "Consigliata per proteggere la prenotazione"
        },
        {
          name: "Certificato medico",
          description: "Per noleggi lunghi o persone con condizioni mediche",
          required: false,
          notes: "Richiesto solo in casi specifici o per charter professionali"
        }
      ]
    }
  ];

  const boatTypes = [
    {
      type: "Gommoni senza patente",
      maxPower: "40 CV",
      licenseRequired: "Nessuna",
      ageRequired: "18 anni",
      briefing: "Obbligatorio",
      documents: ["Documento identità", "Codice fiscale"]
    },
    {
      type: "Barche a motore",
      maxPower: "Oltre 40 CV",
      licenseRequired: "Patente nautica",
      ageRequired: "18 anni",
      briefing: "Obbligatorio",
      documents: ["Documento identità", "Patente nautica", "Codice fiscale"]
    },
    {
      type: "Barche a vela",
      maxPower: "Motore ausiliario",
      licenseRequired: "Patente nautica",
      ageRequired: "18 anni",
      briefing: "Obbligatorio",
      documents: ["Documento identità", "Patente nautica", "Esperienza vela"]
    },
    {
      type: "Yacht e Charter",
      maxPower: "Illimitata",
      licenseRequired: "Patente senza limiti",
      ageRequired: "21 anni",
      briefing: "Completo",
      documents: ["Documento identità", "Patente senza limiti", "Certificato VHF", "Referenze"]
    }
  ];

  const specialRequirements = [
    {
      situation: "Noleggio con skipper",
      requirements: [
        "Documento di identità",
        "Nessuna patente richiesta",
        "Briefing di sicurezza"
      ],
      notes: "Lo skipper professionista ha tutte le certificazioni necessarie"
    },
    {
      situation: "Gruppi e famiglie",
      requirements: [
        "Lista passeggeri completa",
        "Documenti per tutti i maggiorenni",
        "Autorizzazione genitori per minorenni"
      ],
      notes: "Ogni persona a bordo deve essere registrata"
    },
    {
      situation: "Stranieri UE",
      requirements: [
        "Passaporto o carta d'identità UE",
        "Patente nautica del paese di origine",
        "Traduzione certificata (se richiesta)"
      ],
      notes: "Validità automatica per patenti UE"
    },
    {
      situation: "Stranieri extra-UE",
      requirements: [
        "Passaporto valido",
        "Visto turistico (se necessario)",
        "Patente nautica internazionale o traduzione"
      ],
      notes: "Controllo validità patente case-by-case"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documenti Necessari
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guida completa ai documenti richiesti per il noleggio di imbarcazioni. 
            Prepara tutto in anticipo per un check-in rapido e senza problemi.
          </p>
        </div>

        {/* Alert importante */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Porta sempre i documenti originali. Copie non sono accettate per il check-in. 
            Verifica i requisiti specifici dell'imbarcazione prima della partenza.
          </AlertDescription>
        </Alert>

        {/* Tabs per navigazione */}
        <Tabs defaultValue="documents" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documenti richiesti</TabsTrigger>
            <TabsTrigger value="boat-types">Per tipo di barca</TabsTrigger>
            <TabsTrigger value="special">Casi speciali</TabsTrigger>
          </TabsList>

          {/* Tab: Documenti */}
          <TabsContent value="documents" className="space-y-6">
            {documentTypes.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {category.icon}
                      {category.category}
                    </CardTitle>
                    <Badge variant={category.required ? "destructive" : "secondary"}>
                      {category.required ? "Obbligatorio" : "Opzionale"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {category.documents.map((doc, docIndex) => (
                      <div key={docIndex} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                          {doc.required ? (
                            <Badge variant="destructive" className="text-xs">Obbligatorio</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Opzionale</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{doc.description}</p>
                        {doc.notes && (
                          <div className="bg-blue-50 text-blue-800 text-sm p-2 rounded">
                            <strong>Nota:</strong> {doc.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab: Per tipo di barca */}
          <TabsContent value="boat-types" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boatTypes.map((boat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{boat.type}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Potenza max:</span>
                          <div className="font-semibold">{boat.maxPower}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Patente:</span>
                          <div className="font-semibold">{boat.licenseRequired}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Età minima:</span>
                          <div className="font-semibold">{boat.ageRequired}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Briefing:</span>
                          <div className="font-semibold">{boat.briefing}</div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <h5 className="font-semibold text-gray-900 mb-2">Documenti richiesti:</h5>
                        <ul className="space-y-1">
                          {boat.documents.map((doc, docIndex) => (
                            <li key={docIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Casi speciali */}
          <TabsContent value="special" className="space-y-6">
            {specialRequirements.map((special, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {special.situation}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Requisiti specifici:</h5>
                      <ul className="space-y-2">
                        {special.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded">
                      <strong>Attenzione:</strong> {special.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Checklist finale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Checklist prima della partenza
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">24 ore prima</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Verifica validità documenti</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Controlla previsioni meteo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Conferma orario check-in</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Prepara lista passeggeri</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Al check-in</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Presenta documenti originali</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Firma contratto di noleggio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Partecipa al briefing di sicurezza</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 rounded"></div>
                    <span>Ispeziona l'imbarcazione</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}