import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, UserCheck, Lock, Globe } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "1. Informazioni Generali",
      content: [
        "SeaGO S.r.l. (di seguito 'SeaGO') rispetta la privacy degli utenti e si impegna a proteggere i dati personali in conformità al GDPR.",
        "La presente Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo le informazioni personali degli utenti.",
        "Utilizzando SeaGO, l'utente acconsente al trattamento dei dati secondo quanto descritto in questa policy.",
        "SeaGO agisce come Titolare del Trattamento per i dati raccolti attraverso la piattaforma."
      ]
    },
    {
      icon: <Database className="h-6 w-6 text-green-600" />,
      title: "2. Dati Raccolti",
      content: [
        "Dati di registrazione: nome, cognome, email, numero di telefono, data di nascita",
        "Dati di utilizzo: cronologia delle prenotazioni, preferenze di navigazione, log di accesso",
        "Dati di pagamento: informazioni necessarie per processare i pagamenti (tramite Stripe)",
        "Dati di geolocalizzazione: posizione per mostrare imbarcazioni nelle vicinanze (solo con consenso)",
        "Cookies e tecnologie simili per migliorare l'esperienza utente"
      ]
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-600" />,
      title: "3. Finalità del Trattamento",
      content: [
        "Fornire i servizi di intermediazione per il noleggio di imbarcazioni",
        "Gestire prenotazioni, pagamenti e comunicazioni tra utenti",
        "Migliorare la qualità del servizio e personalizzare l'esperienza utente",
        "Adempiere agli obblighi legali e fiscali",
        "Prevenire frodi e garantire la sicurezza della piattaforma"
      ]
    },
    {
      icon: <UserCheck className="h-6 w-6 text-orange-600" />,
      title: "4. Base Giuridica e Consenso",
      content: [
        "Esecuzione del contratto: per fornire i servizi richiesti dall'utente",
        "Interesse legittimo: per migliorare i servizi e prevenire frodi",
        "Consenso esplicito: per marketing e comunicazioni promozionali",
        "Obbligo legale: per adempimenti fiscali e normativi",
        "L'utente può revocare il consenso in qualsiasi momento dalle impostazioni dell'account"
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-red-600" />,
      title: "5. Protezione e Sicurezza",
      content: [
        "Utilizziamo crittografia SSL/TLS per proteggere le comunicazioni",
        "I dati sono archiviati su server sicuri con backup regolari",
        "Accesso limitato ai dati solo al personale autorizzato",
        "Monitoraggio continuo per rilevare accessi non autorizzati",
        "Formazione regolare del personale sui protocolli di sicurezza"
      ]
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-600" />,
      title: "6. Condivisione con Terzi",
      content: [
        "Stripe per il processamento sicuro dei pagamenti",
        "Fornitori di servizi cloud per l'hosting e backup dati",
        "Autorità competenti quando richiesto dalla legge",
        "Partner commerciali solo con consenso esplicito dell'utente",
        "Non vendiamo mai i dati personali a terze parti per scopi commerciali"
      ]
    }
  ];

  const userRights = [
    "Accesso: richiedere una copia dei tuoi dati personali",
    "Rettifica: correggere dati inesatti o incompleti",
    "Cancellazione: richiedere la rimozione dei tuoi dati ('diritto all'oblio')",
    "Portabilità: ricevere i tuoi dati in formato strutturato",
    "Limitazione: limitare il trattamento in determinate circostanze",
    "Opposizione: opporsi al trattamento per marketing diretto"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MobileNavigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Protezione e trasparenza sui tuoi dati personali
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ultimo aggiornamento: Luglio 2025
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Diritti dell'utente */}
          <Card className="shadow-md bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg text-blue-900">
                <UserCheck className="h-6 w-6 text-blue-600" />
                I Tuoi Diritti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                In conformità al GDPR, hai i seguenti diritti sui tuoi dati:
              </p>
              <ul className="space-y-2">
                {userRights.map((right, index) => (
                  <li key={index} className="text-blue-700 leading-relaxed">
                    • {right}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Contatti */}
          <Card className="shadow-md bg-gray-100">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">
                Contatti per la Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                Per esercitare i tuoi diritti o per qualsiasi domanda sulla privacy:
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <p className="font-semibold text-gray-900">Data Protection Officer (DPO)</p>
                <p className="text-gray-700">Email: privacy@seago.it</p>
                <p className="text-gray-700">Telefono: +39 02 1234 5678</p>
                <p className="text-gray-700">
                  Indirizzo: Via del Mare 123, 20100 Milano (MI), Italia
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Risponderemo alla tua richiesta entro 30 giorni dalla ricezione.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}