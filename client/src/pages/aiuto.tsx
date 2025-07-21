import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  HelpCircle,
  FileText,
  Shield,
  CreditCard
} from "lucide-react";

export default function AiutoPage() {
  const faqItems = [
    {
      question: "Come faccio a prenotare una barca?",
      answer: "Puoi prenotare una barca cercando la destinazione desiderata, selezionando le date e scegliendo l'imbarcazione che preferisci. Dopo aver inserito i dettagli della prenotazione, procedi al pagamento sicuro."
    },
    {
      question: "Posso cancellare la mia prenotazione?",
      answer: "Sì, puoi cancellare la prenotazione fino a 24 ore prima della data di inizio. Le cancellazioni sono soggette ai termini e condizioni del proprietario della barca."
    },
    {
      question: "È necessaria la patente nautica?",
      answer: "Dipende dal tipo di imbarcazione. Le barche senza patente possono essere noleggiate senza licenza, mentre yacht e imbarcazioni più grandi richiedono una patente nautica valida."
    },
    {
      question: "Cosa include il prezzo del noleggio?",
      answer: "Il prezzo base include l'uso dell'imbarcazione per il periodo selezionato. Carburante, skipper e servizi extra potrebbero avere costi aggiuntivi specificati nell'annuncio."
    },
    {
      question: "Come funziona l'assicurazione?",
      answer: "Tutte le imbarcazioni sono coperte da assicurazione di base. Ti consigliamo di verificare la tua copertura assicurativa personale e considerare un'assicurazione di viaggio aggiuntiva."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Centro Assistenza SeaGO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Qui trovi tutto quello che ti serve per navigare al meglio con SeaGO. 
            Se non trovi la risposta che cerchi, contattaci!
          </p>
        </div>

        {/* Contatti Rapidi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 text-ocean-blue mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Chat Live</h3>
              <p className="text-sm text-gray-600 mb-4">Risposta immediata</p>
              <Button size="sm" className="bg-ocean-blue hover:bg-ocean-blue/90">
                Avvia Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 text-ocean-blue mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Telefono</h3>
              <p className="text-sm text-gray-600 mb-4">Lun-Ven 9:00-18:00</p>
              <Button size="sm" variant="outline">
                +39 02 1234 5678
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 text-ocean-blue mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-gray-600 mb-4">Risposta entro 2 ore</p>
              <Button size="sm" variant="outline">
                supporto@seago.it
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sezioni di Aiuto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-ocean-blue" />
                Come Funziona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Guida alla prenotazione</li>
                <li>• Tipi di imbarcazioni</li>
                <li>• Check-in e check-out</li>
                <li>• Consigli per la navigazione</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-ocean-blue" />
                Pagamenti e Fatturazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Metodi di pagamento</li>
                <li>• Politica di cancellazione</li>
                <li>• Rimborsi</li>
                <li>• Fatturazione</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-ocean-blue" />
                Sicurezza e Assicurazione
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Copertura assicurativa</li>
                <li>• Norme di sicurezza</li>
                <li>• Documenti richiesti</li>
                <li>• Procedure di emergenza</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-ocean-blue" />
                Termini e Condizioni
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Termini di servizio</li>
                <li>• Privacy policy</li>
                <li>• Cookie policy</li>
                <li>• Diritti del consumatore</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Domande Frequenti</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Orari di Assistenza */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center">
              <Clock className="h-5 w-5 text-ocean-blue mr-2" />
              <div>
                <p className="font-semibold">Orari di Assistenza</p>
                <p className="text-sm text-gray-600">
                  Lunedì - Venerdì: 9:00 - 18:00 | Sabato: 9:00 - 14:00 | Domenica: Chiuso
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