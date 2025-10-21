import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AIAssistant } from "@/components/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, Brain, Lightbulb } from "lucide-react";

export function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Assistente IA SeaBoo</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Il tuo esperto nautici personale. Ottieni raccomandazioni intelligenti, 
            analisi prezzi, consigli meteo e pianificazione itinerari con l'IA avanzata.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">Raccomandazioni</h3>
              <p className="text-sm text-muted-foreground">
                Trova la barca perfetta per te
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Brain className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium">Analisi Prezzi</h3>
              <p className="text-sm text-muted-foreground">
                Verifica se il prezzo è giusto
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Lightbulb className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-medium">Consigli Meteo</h3>
              <p className="text-sm text-muted-foreground">
                Condizioni perfette per navigare
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <Bot className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-medium">Pianifica Itinerario</h3>
              <p className="text-sm text-muted-foreground">
                Crea il viaggio dei tuoi sogni
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant Component */}
        <AIAssistant />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Come Funziona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Scegli una Funzione</p>
                  <p className="text-sm text-muted-foreground">Seleziona raccomandazioni, prezzi, meteo o itinerari</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Descrivi le Tue Esigenze</p>
                  <p className="text-sm text-muted-foreground">Spiega cosa stai cercando in linguaggio naturale</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Ricevi Consigli Esperti</p>
                  <p className="text-sm text-muted-foreground">L'IA analizza i dati e ti fornisce raccomandazioni personalizzate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Esempi di Domande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium text-sm">🚤 Raccomandazioni:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Cerco uno yacht per 8 persone a Napoli, budget €500/giorno"
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">💰 Prezzi:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Il prezzo di €300/giorno per questo gommone è giusto?"
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">🌊 Meteo:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Che tempo farà a Palermo dal 15 al 20 agosto?"
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">🗺️ Itinerari:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Pianifica 7 giorni in Sardegna con yacht di lusso"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}