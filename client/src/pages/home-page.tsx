import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";
import { AppDownloadBanner } from "@/components/app-download-banner";
import { BoatCategories } from "@/components/boat-categories";
import { LazioPorts } from "@/components/lazio-ports";
import { InteractiveMap } from "@/components/interactive-map";
import { BoatCard } from "@/components/boat-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Boat } from "@shared/schema";
import { Link } from "wouter";
import heroImage from "@assets/HD-wallpaper-sailing-boat-beach-nature-trees_1753081381507.jpg";

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
    <div className="min-h-screen bg-gray-50">
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

      {/* Lazio Ports */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazioPorts 
            onPortSelect={setSelectedPort}
            selectedPort={selectedPort}
          />
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mappa interattiva</h2>
            <p className="text-lg text-gray-600">Esplora i porti del Lazio e trova imbarcazioni disponibili</p>
          </div>

          <InteractiveMap 
            boats={filteredBoats}
            onPortSelect={setSelectedPort}
          />
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
          ) : filteredBoats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredBoats.map((boat) => (
                <BoatCard key={boat.id} boat={boat} />
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

      {/* Charter Section */}
      <section id="charter" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Servizi Charter</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Scopri le nostre soluzioni charter professionali per esperienze indimenticabili
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-blue text-white rounded-full text-2xl font-bold mb-6">
                ⛵
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vela settimanale con skipper</h3>
              <p className="text-gray-600 mb-4">
                Crociere di una settimana con skipper professionali per esplorare le coste più belle d'Italia
              </p>
              <Button className="w-full bg-ocean-blue hover:bg-blue-600 text-white" asChild>
                <Link href="/search?boatTypes=sailboat&skipperRequired=true">Scopri</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafoam text-white rounded-full text-2xl font-bold mb-6">
                🏖️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekend in catamarano</h3>
              <p className="text-gray-600 mb-4">
                Fughe di fine settimana su catamarani spaziosi per gruppi e famiglie
              </p>
              <Button className="w-full bg-seafoam hover:bg-teal-600 text-white" asChild>
                <Link href="/search?boatTypes=catamaran">Scopri</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-coral text-white rounded-full text-2xl font-bold mb-6">
                🚤
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Noleggio giornaliero privato</h3>
              <p className="text-gray-600 mb-4">
                Imbarcazioni private per giornate esclusive con servizi personalizzati
              </p>
              <Button className="w-full bg-coral hover:bg-orange-600 text-white" asChild>
                <Link href="/search">Scopri</Link>
              </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-deep-navy text-white rounded-full text-2xl font-bold mb-6">
                🗺️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Itinerari consigliati</h3>
              <p className="text-gray-600 mb-4">
                Percorsi studiati per scoprire le destinazioni più affascinanti del Mediterraneo
              </p>
              <Button className="w-full bg-deep-navy hover:bg-blue-900 text-white" asChild>
                <Link href="/esperienze">Scopri</Link>
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Hai bisogno di un servizio personalizzato?</p>
            <Button size="lg" className="bg-ocean-blue hover:bg-blue-600 text-white px-8 py-3">
              Contattaci per un preventivo
            </Button>
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
            <Button size="lg" className="bg-white text-ocean-blue hover:bg-gray-100" asChild>
              <Link href="/auth?type=owner">Diventa noleggiatore</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ocean-blue">
              Scopri di più
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
                <li>• Come prenotare un'imbarcazione</li>
                <li>• Politiche di cancellazione</li>
                <li>• Modificare una prenotazione</li>
                <li>• Documenti necessari</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pagamenti</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Metodi di pagamento accettati</li>
                <li>• Sicurezza dei pagamenti</li>
                <li>• Rimborsi e restituzioni</li>
                <li>• Fatturazione</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Per i noleggiatori</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Come inserire la tua barca</li>
                <li>• Gestione delle prenotazioni</li>
                <li>• Commissioni e guadagni</li>
                <li>• Assistenza proprietari</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Non trovi quello che cerchi?</p>
            <Button className="bg-ocean-blue hover:bg-blue-600 mr-4">
              Contatta il supporto
            </Button>
            <Button variant="outline">
              Centro assistenza
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
