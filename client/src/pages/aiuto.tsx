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
  HelpCircle,
  Book,
  CreditCard,
  Ship,
  FileText
} from "lucide-react";

const faqData = [
  {
    id: 1,
    category: "Prenotazioni",
    question: "Come posso prenotare una barca?",
    answer: "Usa la funzione di ricerca per trovare la barca ideale, seleziona le date desiderate e completa la prenotazione fornendo i dati richiesti e procedendo con il pagamento sicuro."
  },
  {
    id: 2,
    category: "Prenotazioni", 
    question: "Posso modificare la mia prenotazione?",
    answer: "Le modifiche sono possibili fino a 48 ore prima della data di partenza, soggette alla disponibilità e alle politiche del proprietario della barca."
  },
  {
    id: 3,
    category: "Prenotazioni",
    question: "Quali documenti servono per noleggiare?",
    answer: "Serve un documento d'identità valido e, per barche che lo richiedono, la patente nautica appropriata. Alcuni proprietari potrebbero richiedere documenti aggiuntivi."
  },
  {
    id: 4,
    category: "Pagamenti",
    question: "Quali metodi di pagamento accettate?",
    answer: "Accettiamo tutte le principali carte di credito e debito, Apple Pay, Google Pay tramite la nostra integrazione sicura con Stripe."
  },
  {
    id: 5,
    category: "Pagamenti",
    question: "Quando viene addebitato il pagamento?",
    answer: "Il pagamento viene elaborato immediatamente al momento della conferma della prenotazione. Riceverai una conferma via email."
  },
  {
    id: 6,
    category: "Sicurezza",
    question: "Le barche sono assicurate?",
    answer: "Tutte le imbarcazioni sulla piattaforma SeaBoo sono coperte da assicurazione di base. Sono disponibili coperture aggiuntive durante la prenotazione."
  },
  {
    id: 7,
    category: "Cancellazioni",
    question: "Posso cancellare la prenotazione?",
    answer: "Le cancellazioni sono soggette alle politiche del proprietario. Generalmente è possibile cancellare con pieno rimborso fino a 7 giorni prima."
  }
];

const categories = ["Tutte", "Prenotazioni", "Pagamenti", "Sicurezza", "Cancellazioni"];

export default function AiutoPage() {
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
      description: "Assistenza immediata 24/7",
      contact: "Avvia chat",
      icon: MessageCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
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
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro Assistenza</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Siamo qui per aiutarti. Trova le risposte alle domande più frequenti
          </p>
        </div>

        {/* Contact Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contattaci</h2>
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
        <div>
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

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Book className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Guida Prenotazioni</h3>
              <p className="text-sm text-gray-600">Come prenotare passo dopo passo</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Pagamenti Sicuri</h3>
              <p className="text-sm text-gray-600">Informazioni sui metodi di pagamento</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Ship className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Gestione Barche</h3>
              <p className="text-sm text-gray-600">Per proprietari di imbarcazioni</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Documenti</h3>
              <p className="text-sm text-gray-600">Requisiti e documentazione</p>
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