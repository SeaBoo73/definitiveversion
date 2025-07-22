import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LiveChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    // Numero WhatsApp SeaGO (sostituire con numero reale)
    const phoneNumber = "393512345678"; 
    const message = "Ciao! Ho bisogno di assistenza per SeaGO.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };



  const handleEmailSupport = () => {
    window.open('mailto:assistenza@seago.it?subject=Richiesta Assistenza SeaGO', '_self');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Button - Fixed position */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Options Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                Assistenza Live
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Scegli come preferisci essere contattato:
              </p>
              
              {/* WhatsApp */}
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat WhatsApp
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>



              {/* Email */}
              <Button
                onClick={handleEmailSupport}
                variant="outline"
                className="w-full justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Email Assistenza
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>

              {/* Chiudi */}
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="w-full mt-4"
              >
                Chiudi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}