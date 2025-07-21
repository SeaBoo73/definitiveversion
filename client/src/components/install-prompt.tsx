import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Non mostrare se già dismisso o se non supportato
  const isDismissed = localStorage.getItem('installPromptDismissed');
  if (!showPrompt || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-ocean-blue text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-sm">Installa SeaGO</h4>
        <p className="text-xs opacity-90">Aggiungi l'app alla schermata home per un accesso veloce</p>
      </div>
      <div className="flex gap-2 ml-4">
        <Button 
          size="sm" 
          variant="secondary"
          onClick={handleInstall}
          className="bg-white text-ocean-blue hover:bg-gray-100"
        >
          <Download className="h-4 w-4 mr-1" />
          Installa
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={handleDismiss}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}