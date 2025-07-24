import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";
import { AppDownloadBanner } from "@/components/app-download-banner";
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
              
              <div className="text-center mt-8">
                <Button size="lg" variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  <Link href="/mappa-completa">Visualizza Mappa Completa</Link>
                </Button>
              </div>
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

          {/* Destinazioni di Tendenza */}
          <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Destinazioni di Tendenza</h2>
                <p className="text-lg text-gray-600">Le località più richieste dai nostri navigatori</p>
              </div>
              <TrendingDestinations />
            </div>
          </section>

          {/* Imbarcazioni in evidenza */}
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
        </>
      )}

      {/* Come funziona SeaGO */}
      <section id="how-it-works" className="py-16 bg-blue-50">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cerca</h3>
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

      {/* Affitta la tua barca */}
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
            <Button className="bg-ocean-blue hover:bg-blue-600 text-white" asChild>
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