import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Anchor, Plus, Star, Euro } from "lucide-react";

export default function InserisciBarcaPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Anchor className="h-16 w-16 text-coral mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Inserisci la tua imbarcazione
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Condividi la tua passione per il mare e inizia a guadagnare con la tua imbarcazione
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Facile da inserire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Bastano pochi minuti per creare l'annuncio della tua imbarcazione
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              <CardTitle>Massima visibilità</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                La tua barca sarà vista da migliaia di appassionati di mare
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Euro className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Guadagni garantiti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Guadagna fino a €2.500 al mese affittando la tua imbarcazione
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-coral hover:bg-orange-600 text-white font-bold px-8 py-4 text-lg" asChild>
            <Link href="/diventa-noleggiatore">
              Inizia ora - È gratis!
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Nessun costo di attivazione • Commissione solo a prenotazione confermata
          </p>
        </div>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}