import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { 
  ArrowLeft,
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send
} from "lucide-react";

export default function ContattaciPage() {
  const [location, setLocation] = useLocation();

  const contactInfo = [
    {
      title: "Chat Live",
      value: "Assistenza immediata",
      description: "Avvia chat con il nostro assistente AI",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Indirizzo",
      value: "Via del Porto 123, 00121 Roma",
      description: "Sede legale",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Orari",
      value: "Lun-Ven: 9:00-18:00",
      description: "Sabato e Domenica chiuso",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contattaci</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Siamo qui per aiutarti. Contattaci per qualsiasi domanda o assistenza
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informazioni di Contatto</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <info.icon className={`h-6 w-6 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-lg text-gray-900 mb-1">{info.value}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Contact */}
            <Card className="mt-6 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergenze in Mare</CardTitle>
                <CardDescription className="text-red-600">
                  Per emergenze durante la navigazione
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Guardia Costiera: 1530</p>
                    <p className="text-sm text-red-600">Attivo 24/7 per emergenze marittime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Invia un Messaggio</CardTitle>
                <CardDescription>
                  Compila il form e ti risponderemo il prima possibile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome *</Label>
                      <Input id="nome" placeholder="Il tuo nome" required />
                    </div>
                    <div>
                      <Label htmlFor="cognome">Cognome *</Label>
                      <Input id="cognome" placeholder="Il tuo cognome" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="la-tua-email@esempio.com" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono">Telefono</Label>
                    <Input id="telefono" type="tel" placeholder="+39 xxx xxx xxxx" />
                  </div>
                  
                  <div>
                    <Label htmlFor="argomento">Argomento *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un argomento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prenotazione">Supporto Prenotazione</SelectItem>
                        <SelectItem value="pagamento">Problemi di Pagamento</SelectItem>
                        <SelectItem value="proprietario">Diventare Proprietario</SelectItem>
                        <SelectItem value="tecnico">Supporto Tecnico</SelectItem>
                        <SelectItem value="fatturazione">Fatturazione</SelectItem>
                        <SelectItem value="altro">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="messaggio">Messaggio *</Label>
                    <Textarea 
                      id="messaggio" 
                      placeholder="Descrivi la tua richiesta o domanda..."
                      rows={6}
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Invia Messaggio
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Dove Siamo</CardTitle>
              <CardDescription>
                La nostra sede a Roma, facilmente raggiungibile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Mappa della sede SeaBoo</p>
                  <p className="text-sm text-gray-500">Via del Porto 123, 00121 Roma</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}