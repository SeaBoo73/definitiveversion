import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

export function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Smartphone className="h-5 w-5 text-blue-100" />
          <span className="text-sm font-medium">
            👉 Scarica l'app SeaBoo per un'esperienza migliore
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs px-2 py-1 h-auto"
            onClick={() => {
              // Simula download da App Store
              window.open('https://apps.apple.com/app/expo-go/id982107779', '_blank');
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            App Store
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs px-2 py-1 h-auto"
            onClick={() => {
              // Simula download da Google Play
              window.open('https://play.google.com/store/apps/details?id=host.exp.exponent', '_blank');
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            Google Play
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 text-xs px-2 py-1 h-auto"
          >
            Continua nel browser
          </Button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 p-1 hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Chiudi banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}