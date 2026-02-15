import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield } from "lucide-react";

const COOKIE_CONSENT_KEY = "seaboo_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ 
      accepted: true, 
      analytics: true, 
      marketing: true, 
      date: new Date().toISOString() 
    }));
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ 
      accepted: true, 
      analytics: false, 
      marketing: false, 
      date: new Date().toISOString() 
    }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-6 h-6 text-ocean-blue flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 text-base mb-1">La tua privacy è importante</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilizziamo cookie tecnici necessari per il funzionamento del sito e cookie analitici per migliorare la tua esperienza. 
              Puoi scegliere di accettare tutti i cookie o solo quelli necessari. 
              Per maggiori informazioni consulta la nostra{" "}
              <Link href="/privacy-policy" className="text-ocean-blue hover:underline font-medium">
                Privacy Policy
              </Link>
              {" "}e la{" "}
              <Link href="/cookie-policy" className="text-ocean-blue hover:underline font-medium">
                Cookie Policy
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleAcceptNecessary}
            className="text-sm border-gray-300"
          >
            Solo necessari
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="text-sm bg-ocean-blue hover:bg-blue-700 text-white"
          >
            Accetta tutti
          </Button>
        </div>
      </div>
    </div>
  );
}
