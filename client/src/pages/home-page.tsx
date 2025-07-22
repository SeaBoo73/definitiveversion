import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";
import { AppDownloadBanner } from "@/components/app-download-banner";
import { BoatCategories } from "@/components/boat-categories";
import { LazioPorts } from "@/components/lazio-ports";
import { BoatCard } from "@/components/boat-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Boat } from "@shared/schema";
import { Link } from "wouter";
import heroImage from "@assets/HD-wallpaper-sailing-boat-beach-nature-trees_1753081381507.jpg";
import { MobileNavigation } from "@/components/mobile-navigation";
import { LiveChatButton } from "@/components/live-chat-button";
import { GoogleMapsFinal } from "@/components/google-maps-final";

export default function HomePage() {
  const { data: boats = [], isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPort, setSelectedPort] = useState<string>("");

  // Filtra barche per categoria e porto
  const filteredBoats = boats.filter(boat => {
    if (selectedCategory && boat.type !== selectedCategory) return false;
    if (selectedPort && selectedPort !== "tutti" && boat.port !== selectedPort) return false;
    return true;
  });

  const featuredBoats = filteredBoats.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <AppDownloadBanner />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-blue to-deep-navy text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Naviga verso l'avventura
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium">
              Prenota barche, yacht e imbarcazioni uniche in tutta Italia. 
              Vivi il mare come mai prima d'ora.
            </p>
          </div>

          <SearchFilters />
        </div>
      </section>

      {/* Boat Categories with Real Images */}
      <BoatCategories 
        onCategorySelect={setSelectedCategory} 
        selectedCategory={selectedCategory}
      />

      {/* SEZIONE MAPPA INTERATTIVA INTEGRATA NELLA HOMEPAGE */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🗺️ Mappa Interattiva del Lazio</h2>
            <p className="text-lg text-gray-600">Esplora i porti principali con coordinate GPS precise</p>
            <div className="mt-4">
              <p className="text-sm text-blue-600 font-medium">✨ Adesso visibile direttamente sulla homepage!</p>
            </div>
          </div>

          {/* Google Maps Navigabile Mondiale */}
          <div className="mb-8">
            <GoogleMapsFinal />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Porto di Civitavecchia</h3>
                <p className="text-sm text-gray-600 mb-1">📍 42.0942°N, 11.7939°E</p>
                <p className="text-sm text-gray-600 mb-2">⚓ Porto principale del Lazio</p>
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-3">4 barche disponibili</span>
                <p className="text-green-600 font-medium">€280 - €1200/giorno</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Porto di Gaeta</h3>
                <p className="text-sm text-gray-600 mb-1">📍 41.2058°N, 13.5696°E</p>
                <p className="text-sm text-gray-600 mb-2">⚓ Località turistica rinomata</p>
                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-3">2 barche disponibili</span>
                <p className="text-green-600 font-medium">€280 - €850/giorno</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Porto di Ponza</h3>
                <p className="text-sm text-gray-600 mb-1">📍 40.8992°N, 12.9619°E</p>
                <p className="text-sm text-gray-600 mb-2">🏝️ Isola paradisiaca</p>
                <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-sm mb-3">2 barche disponibili</span>
                <p className="text-green-600 font-medium">€550 - €950/giorno</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Porto di Terracina</h3>
                <p className="text-sm text-gray-600 mb-1">📍 41.2857°N, 13.2443°E</p>
                <p className="text-sm text-gray-600 mb-2">🏛️ Costa laziale storica</p>
                <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm mb-3">2 barche disponibili</span>
                <p className="text-green-600 font-medium">€320 - €580/giorno</p>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Marina di Anzio</h3>
                <p className="text-sm text-gray-600 mb-1">📍 41.4471°N, 12.6221°E</p>
                <p className="text-sm text-gray-600 mb-2">🏖️ Porto turistico moderno</p>
                <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm mb-3">3 barche disponibili</span>
                <p className="text-green-600 font-medium">€200 - €750/giorno</p>
              </div>
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-2">Porto di Formia</h3>
                <p className="text-sm text-gray-600 mb-1">📍 41.2565°N, 13.6058°E</p>
                <p className="text-sm text-gray-600 mb-2">🌊 Golfo di Gaeta</p>
                <span className="inline-block bg-pink-600 text-white px-3 py-1 rounded-full text-sm mb-3">2 barche disponibili</span>
                <p className="text-green-600 font-medium">€300 - €600/giorno</p>
              </div>
            </div>

            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <h4 className="font-bold text-gray-900 mb-4">📊 Statistiche Mappa del Lazio</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">6</p>
                    <p className="text-sm text-gray-600">Porti Principali</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">15</p>
                    <p className="text-sm text-gray-600">Barche Totali</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">€200-€1200</p>
                    <p className="text-sm text-gray-600">Range Prezzi/Giorno</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Boats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Imbarcazioni in evidenza</h2>
              <p className="text-lg text-gray-600">Le migliori proposte selezionate per te</p>
            </div>
            <Button variant="ghost" className="hidden md:block" asChild>
              <Link href="/?show=all">
                Vedi tutte →
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBoats && filteredBoats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBoats.map((boat) => (
                <BoatCard key={boat?.id || Math.random()} boat={boat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nessuna imbarcazione disponibile al momento.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button className="md:hidden bg-ocean-blue hover:bg-blue-600" asChild>
              <Link href="/?show=all">
                Vedi tutte le imbarcazioni
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Come funziona SeaGO</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Prenota la tua imbarcazione ideale in 3 semplici passaggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-blue text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cerca la tua imbarcazione</h3>
              <p className="text-gray-600">
                Trova l'imbarcazione perfetta usando la nostra mappa interattiva e i filtri avanzati per tipo, prezzo e ubicazione
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafoam text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Prenota</h3>
              <p className="text-gray-600">
                Seleziona le date, paga online in totale sicurezza e ricevi conferma istantanea della tua prenotazione
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-coral text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Naviga</h3>
              <p className="text-gray-600">
                Ritira la tua imbarcazione nel porto concordato e goditi un'esperienza indimenticabile in mare
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Host CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-blue to-deep-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Affitta la tua barca</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Guadagna mettendo a disposizione la tua imbarcazione. Gestisci tutto facilmente dalla tua dashboard personale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-900 font-bold shadow-lg" asChild>
              <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
            </Button>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-900 font-bold shadow-lg border-2 border-white" asChild>
              <Link href="/diventa-noleggiatore">Scopri di più</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section id="help" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hai bisogno di aiuto?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Siamo qui per aiutarti. Trova le risposte alle domande più frequenti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prenotazioni</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/come-prenotare" className="text-blue-600 hover:text-blue-800">• Come prenotare un'imbarcazione</Link></li>
                <li><Link href="/politiche-cancellazione" className="text-blue-600 hover:text-blue-800">• Politiche di cancellazione</Link></li>
                <li><Link href="/modifica-prenotazione" className="text-blue-600 hover:text-blue-800">• Modificare una prenotazione</Link></li>
                <li><Link href="/documenti" className="text-blue-600 hover:text-blue-800">• Documenti necessari</Link></li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pagamenti</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/pagamenti" className="text-blue-600 hover:text-blue-800">• Metodi di pagamento accettati</Link></li>
                <li><Link href="/sicurezza-pagamenti" className="text-blue-600 hover:text-blue-800">• Sicurezza dei pagamenti</Link></li>
                <li><Link href="/rimborsi" className="text-blue-600 hover:text-blue-800">• Rimborsi e restituzioni</Link></li>
                <li><Link href="/fatturazione" className="text-blue-600 hover:text-blue-800">• Fatturazione</Link></li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Per i noleggiatori</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/inserisci-barca" className="text-blue-600 hover:text-blue-800">• Come inserire la tua barca</Link></li>
                <li><Link href="/gestione-prenotazioni" className="text-blue-600 hover:text-blue-800">• Gestione delle prenotazioni</Link></li>
                <li><Link href="/commissioni" className="text-blue-600 hover:text-blue-800">• Commissioni e guadagni</Link></li>
                <li><Link href="/assistenza-proprietari" className="text-blue-600 hover:text-blue-800">• Assistenza proprietari</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Non trovi quello che cerchi?</p>
            <Button className="bg-ocean-blue hover:bg-blue-600 mr-4" asChild>
              <Link href="/contatti">Contatta il supporto</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/aiuto">Centro assistenza</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNavigation />
      <LiveChatButton />
    </div>
  );
}
