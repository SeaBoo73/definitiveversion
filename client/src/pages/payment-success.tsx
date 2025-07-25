import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { CheckCircle, ArrowLeft } from "lucide-react";


export default function PaymentSuccess() {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-deep-navy mb-6">
            Pagamento Completato con Successo!
          </h1>
          
          <p className="text-lg text-sea-gray mb-8 max-w-2xl mx-auto">
            Grazie per aver scelto SeaGO! La tua prenotazione è stata confermata. 
            Riceverai a breve una email di conferma con tutti i dettagli.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-deep-navy mb-6">Prossimi Passi</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-coral rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email di conferma</h3>
                  <p className="text-gray-600">Riceverai tutti i dettagli della prenotazione via email</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-coral rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contatto con il proprietario</h3>
                  <p className="text-gray-600">Il proprietario ti contatterà per organizzare la consegna</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-coral rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Preparazione documenti</h3>
                  <p className="text-gray-600">Assicurati di avere patente nautica e documento d'identità</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-coral rounded-full flex items-center justify-center text-white text-sm font-bold mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Goditi la navigazione!</h3>
                  <p className="text-gray-600">Ritira l'imbarcazione e vivi un'esperienza indimenticabile</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-coral hover:bg-orange-600 text-white">
              <Link href="/dashboard">Vai alle mie prenotazioni</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-coral text-coral hover:bg-coral hover:text-white">
              <Link href="/">Torna alla homepage</Link>
            </Button>
          </div>
          
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-deep-navy mb-2">Hai bisogno di aiuto?</h3>
            <p className="text-sea-gray mb-4">
              Il nostro team di supporto è disponibile 24/7 per assisterti
            </p>
            <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              <Link href="/aiuto">Contatta il supporto</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}