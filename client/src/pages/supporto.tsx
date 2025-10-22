import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { AiChat } from "@/components/ai-chat";
import { 
  ArrowLeft,
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  LifeBuoy,
  Book,
  CreditCard,
  Ship,
  FileText,
  AlertTriangle,
  ExternalLink
} from "lucide-react";

const faqData = [
  {
    id: 1,
    category: "App",
    question: "Come utilizzare l'app SeaBoo?",
    answer: "Stai già utilizzando l'app SeaBoo! Puoi prenotare barche, gestire i tuoi ormeggi e accedere a tutti i servizi marittimi direttamente dall'interfaccia che stai vedendo."
  },
  {
    id: 2,
    category: "App", 
    question: "L'app è gratuita?",
    answer: "Sì, l'app SeaBoo è completamente gratuita da scaricare. Paghi solo quando effettui una prenotazione attraverso la piattaforma."
  },
  {
    id: 3,
    category: "Supporto Tecnico",
    question: "Ho problemi con l'app, cosa faccio?",
    answer: "Utilizza la chat di assistenza integrata nell'app per ricevere supporto immediato. Il nostro assistente AI è disponibile 24/7 per aiutarti con qualsiasi problema."
  },
  {
    id: 4,
    category: "Account",
    question: "Come creo un account?",
    answer: "Puoi registrarti facilmente con email e password, oppure utilizzare l'accesso rapido con Apple ID o Google. La registrazione è gratuita e immediata."
  },
  {
    id: 5,
    category: "Prenotazioni",
    question: "Posso prenotare direttamente dall'app?",
    answer: "Assolutamente sì! L'app permette di cercare, confrontare e prenotare barche in pochi tap. Tutte le funzionalità del sito web sono disponibili anche su mobile."
  },
  {
    id: 6,
    category: "Pagamenti",
    question: "I pagamenti sono sicuri nell'app?",
    answer: "Sì, utilizziamo Stripe per processare tutti i pagamenti in modo sicuro. Supportiamo Apple Pay, Google Pay e tutte le principali carte di credito."
  },
  {
    id: 7,
    category: "Sicurezza",
    question: "I miei dati sono protetti?",
    answer: "La sicurezza è la nostra priorità. Tutti i dati sono crittografati e conservati secondo gli standard GDPR. Non condividiamo mai le tue informazioni con terze parti."
  },
  {
    id: 8,
    category: "Supporto Tecnico",
    question: "L'app non funziona correttamente",
    answer: "Prima prova a chiudere e riaprire l'app, poi verifica di avere l'ultima versione installata. Se il problema persiste, contatta il supporto con i dettagli del dispositivo."
  }
];

const categories = ["Tutte", "App", "Account", "Prenotazioni", "Pagamenti", "Sicurezza", "Supporto Tecnico"];

export default function SupportoPage() {
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Tutte");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === "Tutte" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleChatClick = () => {
    setShowAiChat(true);
  };

  const contactOptions = [
    {
      title: "Chat Live",
      description: "Assistenza immediata",
      contact: "Avvia chat",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Emergenze Mare",
      description: "24/7 per emergenze marittime",
      contact: "Guardia Costiera: 1530",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const supportLinks = [
    {
      title: "Termini di Servizio",
      description: "Condizioni d'uso della piattaforma",
      link: "/condizioni-servizio",
      icon: FileText
    },
    {
      title: "Privacy Policy",
      description: "Come proteggiamo i tuoi dati",
      link: "/privacy-policy",
      icon: FileText
    },
    {
      title: "Politiche di Cancellazione",
      description: "Termini per modifiche e rimborsi",
      link: "/politiche-cancellazione",
      icon: FileText
    },
    {
      title: "Come Prenotare",
      description: "Guida passo-passo",
      link: "/come-prenotare",
      icon: Book
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
          <LifeBuoy className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Supporto SeaBoo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Centro assistenza ufficiale per l'app e la piattaforma SeaBoo
          </p>
        </div>

        {/* Contact Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contatta il Supporto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={option.title === "Chat Live" ? handleChatClick : undefined}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <option.icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{option.contact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Domande Frequenti</h2>
          
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Cerca nelle FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {faq.category}
                        </Badge>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nessuna FAQ trovata per la ricerca corrente.</p>
            </div>
          )}
        </div>

        {/* Support Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Risorse Utili</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportLinks.map((link, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(link.link)}
              >
                <CardContent className="p-6 text-center">
                  <link.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 flex items-center justify-center">
                    {link.title}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Support */}
        <div>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Supporto Tecnico App</CardTitle>
              <CardDescription className="text-blue-700">
                Per problemi specifici con l'applicazione mobile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Prima di contattarci:</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Verifica di avere l'ultima versione dell'app</li>
                    <li>Riavvia l'applicazione</li>
                    <li>Controlla la connessione internet</li>
                    <li>Prova a disconnettere e riconnettere l'account</li>
                  </ul>
                </div>
                <div>
                  <p className="text-blue-800">
                    <strong>Per segnalazioni tecniche:</strong> Includi sempre modello del dispositivo, 
                    versione iOS/Android e descrizione dettagliata del problema.
                  </p>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleChatClick}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Avvia Chat Supporto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      
      {/* AI Chat Component */}
      <AiChat 
        isOpen={showAiChat} 
        onClose={() => setShowAiChat(false)} 
      />
    </div>
  );
}