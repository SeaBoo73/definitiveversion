import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Users, 
  Headphones,
  Send
} from "lucide-react";

export default function ContattiPage() {
  const contactMethods = [
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "Chat Live",
      description: "Supporto immediato per domande urgenti",
      details: "Disponibile 24/7",
      action: "Avvia Chat",
      primary: true
    },
    {
      icon: <Phone className="h-8 w-8 text-green-600" />,
      title: "Telefono",
      description: "Chiamaci per assistenza diretta",
      details: "+39 02 1234 5678",
      action: "Chiama Ora"
    },
    {
      icon: <Mail className="h-8 w-8 text-purple-600" />,
      title: "Email",
      description: "Supporto via email con risposta garantita",
      details: "supporto@seago.it",
      action: "Invia Email"
    },
    {
      icon: <Headphones className="h-8 w-8 text-orange-600" />,
      title: "Assistenza Tecnica",
      description: "Per problemi tecnici della piattaforma",
      details: "tech@seago.it",
      action: "Contatta"
    }
  ];

  const departments = [
    {
      name: "Supporto Clienti",
      email: "supporto@seago.it",
      description: "Assistenza generale e prenotazioni"
    },
    {
      name: "Assistenza Proprietari",
      email: "hosts@seago.it", 
      description: "Supporto per proprietari di imbarcazioni"
    },
    {
      name: "Ufficio Commerciale",
      email: "business@seago.it",
      description: "Partnership e opportunità commerciali"
    },
    {
      name: "Ufficio Legale",
      email: "legal@seago.it",
      description: "Questioni legali e conformità"
    },
    {
      name: "Ufficio Stampa",
      email: "press@seago.it",
      description: "Media e comunicazione"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contattaci
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Siamo qui per aiutarti! Scegli il metodo di contatto che preferisci per ricevere assistenza immediata dal nostro team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className={`text-center hover:shadow-lg transition-shadow ${method.primary ? 'border-blue-500 bg-blue-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {method.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="font-medium text-gray-900 mb-4">{method.details}</p>
                <Button 
                  className={method.primary ? 'bg-blue-600 hover:bg-blue-700 w-full' : 'w-full'} 
                  variant={method.primary ? 'default' : 'outline'}
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-6 w-6" />
                Invia un Messaggio
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <Input placeholder="Il tuo nome" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
                    <Input placeholder="Il tuo cognome" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" placeholder="la-tua-email@esempio.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono (opzionale)</label>
                  <Input type="tel" placeholder="+39 123 456 7890" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Seleziona un argomento</option>
                    <option>Supporto per prenotazione</option>
                    <option>Problema con pagamento</option>
                    <option>Assistenza tecnica</option>
                    <option>Diventare proprietario</option>
                    <option>Partnership commerciale</option>
                    <option>Altro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio</label>
                  <Textarea 
                    placeholder="Descrivi la tua richiesta o il problema che stai riscontrando..."
                    rows={5}
                  />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Invia Messaggio
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Company Info & Hours */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Informazioni Azienda
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">SeaGO S.r.l.</h4>
                  <p className="text-gray-600">Via Marina, 123</p>
                  <p className="text-gray-600">20121 Milano (MI), Italia</p>
                </div>
                
                <div>
                  <p className="text-gray-600"><strong>P.IVA:</strong> 12345678901</p>
                  <p className="text-gray-600"><strong>Telefono:</strong> +39 02 1234 5678</p>
                  <p className="text-gray-600"><strong>Email:</strong> info@seago.it</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Orari di Assistenza
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Chat Live</span>
                    <span className="font-medium text-green-600">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Telefono</span>
                    <span className="font-medium">Lun-Ven 9:00-18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Email</span>
                    <span className="font-medium">24/7 (risposta entro 2h)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Assistenza Weekend</span>
                    <span className="font-medium">Sab-Dom 10:00-16:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Emergenze 24/7
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Assistenza di Emergenza</h4>
                  <p className="text-red-700 text-sm mb-3">
                    Per emergenze durante il noleggio (guasti, maltempo, incidenti)
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium text-red-900">📞 +39 800 123 456 (gratuito)</p>
                    <p className="text-red-700 text-sm">Disponibile 24 ore su 24, 7 giorni su 7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle>Dipartimenti Specializzati</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{dept.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                  <a 
                    href={`mailto:${dept.email}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}