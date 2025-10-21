import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";

export function InstallPrompt() {
  // Non mostrare mai il prompt dato che siamo già nell'app
  return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-ocean-blue text-white p-6 rounded-t-xl text-center">
          <div className="mb-3">
            <img 
              src="/attached_assets/WhatsApp Image 2025-08-19 at 12.38.33_1757233141259.jpeg" 
              alt="SeaBoo Logo" 
              className="h-16 w-16 mx-auto rounded-lg object-cover bg-white p-1"
            />
          </div>
          <h2 className="text-xl font-bold mb-2">Scarica l'App SeaBoo</h2>
          <p className="text-sm opacity-90">
            Barche, ormeggi e servizi marittimi sempre con te
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Prenota barche e ormeggi ovunque</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Notifiche in tempo reale</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Funziona anche offline</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Chat diretta con i proprietari</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span>Gestione prenotazioni semplificata</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleInstall}
              className="w-full bg-ocean-blue hover:bg-blue-600 text-white h-12"
            >
              <Download className="h-5 w-5 mr-2" />
              Installa App
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleDismiss}
              className="w-full h-12"
            >
              Continua sul sito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}