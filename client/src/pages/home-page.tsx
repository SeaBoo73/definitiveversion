import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";
import { AppDownloadBanner } from "@/components/app-download-banner";
import { Anchor } from "lucide-react";

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
      <AppDownloadBanner />
      <Header />
      
      {/* Hero Section - Design con sfondo blu oceano e palme */}
      <section className="relative min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        {/* Background con palme e oceano */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.7
          }}
        />
        
        {/* Overlay gradiente per migliore leggibilità */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/80 via-blue-700/90 to-blue-900/95"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header con logo integrato nella hero */}
          <div className="flex items-center justify-center pt-8 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Anchor className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">SeaBoo</span>
            </div>
          </div>
          
          {/* Contenuto principale centrato */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Naviga verso<br/>l'avventura
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Prenota barche, yacht e imbarcazioni<br/>
                uniche in tutta Italia.<br/>
                Vivi il mare come mai prima d'ora.
              </p>
              
              {/* Form di ricerca integrato */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-left text-gray-700 font-semibold mb-2">Dove</label>
                    <input 
                      type="text" 
                      placeholder="Cerca tra 48 porti italiani..." 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-left text-gray-700 font-semibold mb-2">Dal</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-gray-700 font-semibold mb-2">Al</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg transition-colors">
                    Cerca Imbarcazioni
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                  <Anchor className="h-8 w-8 text-ocean-blue" />
                  Trova il tuo ormeggio ideale
                </h2>
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

      <Footer />
      <LiveChatButton />
    </div>
  );
}