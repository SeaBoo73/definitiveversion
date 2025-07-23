import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Euro, 
  X, 
  TrendingUp,
  Anchor,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export function OwnerCTAFloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Mostra il button dopo 10 secondi di navigazione e solo se non è un owner
    const timer = setTimeout(() => {
      if (!user || user.role !== 'owner') {
        const dismissed = localStorage.getItem('owner-cta-dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('owner-cta-dismissed', 'true');
  };

  if (!isVisible || isDismissed || (user && user.role === 'owner')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-xl p-4 relative animate-bounce-once">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-white text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Euro className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-lg">Guadagna con la tua barca!</div>
            <div className="text-green-100 text-sm">Fino a €15.000+ all'anno</div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Guadagno medio
            </span>
            <Badge className="bg-white/20 text-white">€350/giorno</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Anchor className="h-4 w-4" />
              Ormeggio incluso
            </span>
            <Badge className="bg-white/20 text-white">5 porti</Badge>
          </div>
        </div>
        
        <Button 
          asChild 
          className="w-full bg-white text-green-600 hover:bg-green-50 font-bold"
        >
          <Link href="/diventa-noleggiatore">
            <div className="flex items-center justify-center gap-2">
              <span>Inizia Ora</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </Button>
        
        <div className="text-xs text-green-100 text-center mt-2">
          Registrazione gratuita • Solo 15% commissione
        </div>
      </div>
    </div>
  );
}