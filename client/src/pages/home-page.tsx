import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";

import { BoatCard } from "@/components/boat-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Boat } from "@shared/schema";
import { Link, useLocation } from "wouter";
import heroImage from "@assets/HD-wallpaper-sailing-boat-beach-nature-trees_1753081381507.jpg";

import { LiveChatButton } from "@/components/live-chat-button";
import { QuickStatsCard } from "@/components/quick-stats-card";
import { TrendingDestinations } from "@/components/trending-destinations";
import { WeatherWidget } from "@/components/weather-widget";
import { GoogleMapsLazio } from "@/components/google-maps-lazio";
import { CategoryGallery } from "@/components/category-gallery";
import { SEOHead, seoConfigs } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import { QuickRegistration } from "@/components/quick-registration";

export default function HomePage() {
  const { data: boats = [], isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPort, setSelectedPort] = useState<string>("");

  // Gestisci parametri URL per il filtro categorie
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const typeParam = urlParams.get('type');
      setSelectedCategory(typeParam || "");
      // Scroll to top when category changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Controlla al mount
    handleUrlChange();

    // Ascolta custom event per cambio categoria
    const handleCategoryChange = () => {
      handleUrlChange();
    };

    window.addEventListener('categoryChanged', handleCategoryChange);
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('categoryChanged', handleCategoryChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Filtra barche per categoria e porto
  const filteredBoats = boats.filter(boat => {
    if (selectedCategory && boat.type !== selectedCategory) return false;
    if (selectedPort && selectedPort !== "tutti" && boat.port !== selectedPort) return false;
    return true;
  });

  // Debug per verificare i filtri
  console.log('Current state - selectedCategory:', selectedCategory, 'URL:', window.location.search);
  if (selectedCategory) {
    console.log('Filtering by category:', selectedCategory, 'Found boats:', filteredBoats.length);
  }

  const featuredBoats = filteredBoats.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 overflow-x-hidden">
      <SEOHead {...seoConfigs.home} />
      <StructuredData type="homepage" />
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
              Prenota barche, yacht e imbarcazioni uniche in tutta Italia.<br/>
              Vivi il mare come mai prima d'ora.
            </p>
          </div>

          <SearchFilters />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickStatsCard />
        </div>
      </section>

      {/* Category Gallery - SEZIONE ESPLORA PER CATEGORIA */}
      <CategoryGallery />

      {/* Barche Filtrate - mostra quando è selezionata una categoria */}
      {selectedCategory && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Risultati per: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')}
              </h2>
              <p className="text-lg text-gray-600">
                {isLoading ? 'Caricamento...' : `${filteredBoats.length} imbarcazioni trovate`}
              </p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
                <p className="text-gray-500 text-lg mt-4">Caricamento barche...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBoats.map((boat) => (
                  <BoatCard key={boat.id} boat={boat} />
                ))}
              </div>
            )}
            
            {!isLoading && selectedCategory && filteredBoats.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nessuna imbarcazione trovata per questa categoria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory("");
                    window.history.pushState({}, '', '/');
                  }}
                >
                  Mostra tutte le categorie
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contenuto homepage normale - mostra solo se non è selezionata una categoria */}
      {!selectedCategory && (
        <>
          {/* Interactive Map */}
          <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Esplora il Mare di Lazio e Campania</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Scopri le imbarcazioni disponibili nei porti più belli di Lazio e Campania. 
                  14 porti principali da Civitavecchia a Capri con prezzi in tempo reale.
                </p>
              </div>
              
              <GoogleMapsLazio />
            </div>
          </section>

          {/* Ormeggio - Solo Desktop */}
          <section className="py-16 bg-gray-50 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Trova il tuo ormeggio ideale</h2>
                <p className="text-lg text-gray-600">Ormeggi sicuri e servizi completi per la tua imbarcazione</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">⚓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pontili attrezzati</h3>
                  <p className="text-gray-600 mb-4">Servizi completi con acqua, elettricità e assistenza</p>
                  <Button asChild>
                    <Link href="/ormeggio">Esplora pontili</Link>
                  </Button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">🛟</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Boe di ormeggio</h3>
                  <p className="text-gray-600 mb-4">Soluzioni economiche per soste brevi</p>
                  <Button asChild>
                    <Link href="/ormeggio">Trova boe</Link>
                  </Button>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ormeggi sicuri</h3>
                  <p className="text-gray-600 mb-4">Videosorveglianza e assistenza 24/7</p>
                  <Button asChild>
                    <Link href="/ormeggio">Sicurezza H24</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Weather Widget - Solo Desktop */}
          <section className="py-16 bg-white hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Condizioni Meteo e Servizi</h2>
                <p className="text-lg text-gray-600">Informazioni utili per la tua navigazione</p>
              </div>
              <WeatherWidget />
            </div>
          </section>

        </>
      )}

      {/* Affitta la tua barca */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Affitta la tua barca</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Guadagna mettendo a disposizione la tua imbarcazione. Gestisci tutto facilmente dalla tua dashboard personale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            {/* Left side - Quick Action */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-4">Registrazione immediata</h3>
              <p className="text-blue-100 mb-6">
                Clicca qui per procedere direttamente alla registrazione senza compilare i dati.
              </p>
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 hover:text-blue-900 font-bold shadow-lg" asChild>
                <Link href="/auth?tab=register">Diventa noleggiatore</Link>
              </Button>
            </div>
            
            {/* Right side - Quick Registration Form */}
            <div className="flex justify-center">
              <QuickRegistration 
                title="Registrazione rapida"
                description="Compila i dati per iniziare subito"
                buttonText="Continua con questi dati"
                className="bg-white/95 backdrop-blur shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hai bisogno di aiuto? */}
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
                <li><Link href="/faq#prenotazione" className="text-blue-600 hover:text-blue-800">• Come prenotare una barca?</Link></li>
                <li><Link href="/faq#modifica" className="text-blue-600 hover:text-blue-800">• Posso modificare la prenotazione?</Link></li>
                <li><Link href="/faq#cancellazione" className="text-blue-600 hover:text-blue-800">• Politiche di cancellazione</Link></li>
                <li><Link href="/faq#documenti" className="text-blue-600 hover:text-blue-800">• Documenti necessari</Link></li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pagamenti</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/faq#pagamento" className="text-blue-600 hover:text-blue-800">• Metodi di pagamento</Link></li>
                <li><Link href="/faq#sicurezza" className="text-blue-600 hover:text-blue-800">• Sicurezza dei pagamenti</Link></li>
                <li><Link href="/faq#rimborso" className="text-blue-600 hover:text-blue-800">• Richiesta di rimborso</Link></li>
                <li><Link href="/faq#fattura" className="text-blue-600 hover:text-blue-800">• Fatturazione</Link></li>
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
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
              <Link href="/aiuto">Centro assistenza</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <LiveChatButton />
    </div>
  );
}