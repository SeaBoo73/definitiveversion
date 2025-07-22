import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/search-filters";
import { AppDownloadBanner } from "@/components/app-download-banner";
import { BoatCategories } from "@/components/boat-categories";
import { LazioPorts } from "@/components/lazio-ports";
import { GoogleMap } from "@/components/google-map-clean";
import { BoatCard } from "@/components/boat-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Boat } from "@shared/schema";
import { Link } from "wouter";
import heroImage from "@assets/HD-wallpaper-sailing-boat-beach-nature-trees_1753081381507.jpg";
import { MobileNavigation } from "@/components/mobile-navigation";
import { LiveChatButton } from "@/components/live-chat-button";

export default function HomePage() {
  console.log("HomePage component rendering...");
  
  const { data: boats = [], isLoading, error } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });

  console.log("Boats data:", boats?.length || 0, "Loading:", isLoading, "Error:", error);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPort, setSelectedPort] = useState<string>("");

  // Filtra barche per categoria e porto con error handling
  let filteredBoats = [];
  let featuredBoats = [];
  
  try {
    filteredBoats = boats.filter(boat => {
      if (!boat) return false;
      if (selectedCategory && boat.type !== selectedCategory) return false;
      if (selectedPort && selectedPort !== "tutti" && boat.port !== selectedPort) return false;
      return true;
    });
    
    featuredBoats = filteredBoats.slice(0, 8);
    console.log("Filtered boats:", filteredBoats.length, "Featured:", featuredBoats.length);
  } catch (filterError) {
    console.error("Error filtering boats:", filterError);
    filteredBoats = [];
    featuredBoats = [];
  }

  console.log("About to render homepage JSX...");

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

      {/* MAPPA INTERATTIVA DEL LAZIO - IMPLEMENTAZIONE DIRETTA SENZA COMPONENTI ESTERNI */}
      <div style={{
        padding: '64px 20px',
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        minHeight: '600px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              🗺️ Mappa Interattiva del Lazio
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Esplora i porti principali del Lazio e trova le imbarcazioni disponibili con coordinate GPS precise
            </p>
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '40px',
            marginBottom: '32px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                background: '#dbeafe',
                border: '2px solid #3b82f6',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  Porto di Civitavecchia
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    📍 42.0942°N, 11.7939°E
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    ⚓ Porto principale del Lazio
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    🚢 Collegamenti internazionali
                  </p>
                </div>
                <div style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  4 barche disponibili
                </div>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.125rem' }}>
                  €280 - €1200/giorno
                </p>
              </div>

              <div style={{
                background: '#dcfce7',
                border: '2px solid #16a34a',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  Porto di Gaeta
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    📍 41.2058°N, 13.5696°E
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    ⚓ Località turistica rinomata
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    🏖️ Spiagge cristalline
                  </p>
                </div>
                <div style={{
                  background: '#16a34a',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  2 barche disponibili
                </div>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.125rem' }}>
                  €280 - €850/giorno
                </p>
              </div>

              <div style={{
                background: '#fed7aa',
                border: '2px solid #ea580c',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
                  Porto di Ponza
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    📍 40.8992°N, 12.9619°E
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    🏝️ Isola paradisiaca
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '4px 0' }}>
                    🐟 Snorkeling e immersioni
                  </p>
                </div>
                <div style={{
                  background: '#ea580c',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  2 barche disponibili
                </div>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.125rem' }}>
                  €550 - €950/giorno
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              🗺️ Coordinate GPS Precise
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Tutti i porti sono georeferenziati con coordinate GPS precise per la navigazione
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              textAlign: 'left'
            }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>6 Porti Principali</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tutti i porti del Lazio</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>15 Barche Totali</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Disponibili ora</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', color: '#1f2937' }}>Range €200-€1200</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Prezzi al giorno</p>
              </div>
            </div>
          </div>
        </div>
      </div>



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
            <Button size="lg" className="bg-white text-ocean-blue hover:bg-gray-100" asChild>
              <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
            </Button>
            <Button size="lg" className="bg-white text-ocean-blue hover:bg-gray-100 font-semibold shadow-lg border-2 border-white" asChild>
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
