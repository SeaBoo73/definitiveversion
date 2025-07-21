import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, CreditCard, AlertTriangle, Scale } from "lucide-react";

export default function CondizioniServizioPage() {
  const sections = [
    {
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      title: "1. Definizioni e Ambito di Applicazione",
      content: [
        "SeaGO è una piattaforma digitale che mette in contatto proprietari di imbarcazioni con utenti interessati al noleggio.",
        "I presenti Termini si applicano a tutti gli utenti della piattaforma SeaGO.",
        "L'utilizzo della piattaforma implica l'accettazione integrale dei presenti Termini.",
        "SeaGO agisce esclusivamente come intermediario tra proprietari e noleggiatori."
      ]
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "2. Registrazione e Account Utente",
      content: [
        "Per utilizzare SeaGO è necessario creare un account fornendo informazioni veritiere e aggiornate.",
        "Ogni utente è responsabile della sicurezza delle proprie credenziali di accesso.",
        "È vietato creare account multipli o condividere le credenziali con terzi.",
        "SeaGO si riserva il diritto di sospendere account che violano i Termini di Servizio."
      ]
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "3. Obblighi degli Utenti",
      content: [
        "Fornire informazioni accurate e aggiornate durante la registrazione e le prenotazioni.",
        "Rispettare le normative marittime e di sicurezza vigenti.",
        "Utilizzare le imbarcazioni con cura e responsabilità.",
        "Segnalare immediatamente eventuali danni o problemi tecnici.",
        "Rispettare gli orari di check-in e check-out concordati."
      ]
    },
    {
      icon: <CreditCard className="h-6 w-6 text-orange-600" />,
      title: "4. Prenotazioni e Pagamenti",
      content: [
        "Tutti i pagamenti devono essere effettuati tramite i sistemi di pagamento autorizzati di SeaGO.",
        "Il prezzo finale include commissioni di servizio e tasse applicabili.",
        "Le prenotazioni sono confermate solo dopo il pagamento completo.",
        "Cancellazioni e rimborsi sono regolati dalle politiche specifiche di ogni annuncio.",
        "SeaGO non è responsabile per pagamenti effettuati al di fuori della piattaforma."
      ]
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      title: "5. Responsabilità e Assicurazioni",
      content: [
        "I noleggiatori sono responsabili per eventuali danni causati all'imbarcazione durante il noleggio.",
        "È obbligatorio verificare la copertura assicurativa prima del noleggio.",
        "SeaGO raccomanda la stipula di un'assicurazione di viaggio aggiuntiva.",
        "Ogni imbarcazione deve essere coperta da assicurazione valida fornita dal proprietario.",
        "SeaGO agisce come intermediario e non assume responsabilità dirette per danni o incidenti."
      ]
    },
    {
      icon: <Scale className="h-6 w-6 text-indigo-600" />,
      title: "6. Risoluzione Controversie",
      content: [
        "SeaGO offre un servizio di mediazione per risolvere controversie tra utenti.",
        "Le dispute dovranno essere segnalate entro 48 ore dall'evento.",
        "In caso di mancata risoluzione, si applica la giurisdizione italiana.",
        "Il foro competente è quello del tribunale di Milano.",
        "SeaGO si riserva il diritto di sospendere utenti coinvolti in controversie gravi."
      ]
    }
  ];

  const importantRules = [
    {
      title: "Età Minima",
      description: "I noleggiatori devono essere maggiorenni e in possesso di documento di identità valido."
    },
    {
      title: "Patenti Nautiche",
      description: "Per imbarcazioni che richiedono patente, è necessario presentare la licenza valida al check-in."
    },
    {
      title: "Numero Massimo Ospiti",
      description: "È vietato superare il numero massimo di persone consentite a bordo."
    },
    {
      title: "Uso Commerciale",
      description: "Le imbarcazioni non possono essere utilizzate per scopi commerciali senza autorizzazione."
    },
    {
      title: "Sostanze Illegali",
      description: "È rigorosamente vietato l'uso di sostanze illegali a bordo delle imbarcazioni."
    },
    {
      title: "Rispetto dell'Ambiente",
      description: "Gli utenti devono rispettare l'ambiente marino e le aree marine protette."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Condizioni di Servizio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Termini e condizioni per l'utilizzo della piattaforma SeaGO. 
            Leggi attentamente prima di utilizzare i nostri servizi.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            <strong>Ultimo aggiornamento:</strong> Luglio 2025
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Rules */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Regole Importanti
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {importantRules.map((rule, index) => (
                <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">{rule.title}</h4>
                  <p className="text-sm text-red-700">{rule.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informazioni Legali</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">SeaGO S.r.l.</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Sede Legale:</strong> Via Marina, 123 - 20121 Milano (MI)</p>
                  <p><strong>P.IVA:</strong> 12345678901</p>
                  <p><strong>Codice Fiscale:</strong> 12345678901</p>
                  <p><strong>REA:</strong> MI-1234567</p>
                  <p><strong>Capitale Sociale:</strong> €50.000,00 i.v.</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Contatti Legali</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email Legale:</strong> legal@seago.it</p>
                  <p><strong>PEC:</strong> seago@pec.seago.it</p>
                  <p><strong>Telefono:</strong> +39 02 1234 5678</p>
                  <p><strong>Fax:</strong> +39 02 1234 5679</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Modifiche ai Termini di Servizio</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                SeaGO si riserva il diritto di modificare i presenti Termini di Servizio in qualsiasi momento. 
                Le modifiche entreranno in vigore dalla data di pubblicazione sulla piattaforma.
              </p>
              
              <p className="text-gray-700">
                Gli utenti saranno notificati via email delle modifiche sostanziali e avranno 30 giorni 
                per accettare i nuovi termini o interrompere l'utilizzo del servizio.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Nota:</strong> L'uso continuato della piattaforma dopo la pubblicazione 
                  di modifiche costituisce accettazione dei nuovi Termini di Servizio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}