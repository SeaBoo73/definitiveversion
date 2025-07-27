import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translations object
const translations = {
  it: {
    // Navigation
    'nav.explore': 'Esplora',
    'nav.experiences': 'Esperienze',
    'nav.docking': 'Ormeggio',
    'nav.services': 'Servizi',
    'nav.help': 'Aiuto',
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    'nav.dashboard': 'Dashboard',
    'nav.become_owner': 'Diventa noleggiatore',
    'nav.customer_area': 'Area Clienti',
    'nav.sea_host_dashboard': 'Dashboard Sea Host',
    'nav.profile': 'Il mio profilo',
    'nav.bookings': 'Le mie prenotazioni',
    'nav.logout': 'Logout',

    // Homepage
    'homepage.hero_title': 'Trova la tua imbarcazione perfetta',
    'homepage.hero_subtitle': 'Naviga i mari italiani con barche selezionate e verificate',
    'homepage.search_placeholder': 'Dove vuoi navigare?',
    'homepage.search_button': 'Cerca imbarcazioni',
    'homepage.how_it_works': 'Come funziona',
    'homepage.step1_title': 'Cerca e scegli',
    'homepage.step1_desc': 'Trova la barca perfetta per la tua avventura',
    'homepage.step2_title': 'Prenota online',
    'homepage.step2_desc': 'Pagamento sicuro e conferma immediata',
    'homepage.step3_title': 'Naviga e goditi',
    'homepage.step3_desc': 'Vivi un\'esperienza indimenticabile in mare',

    // Boat categories
    'categories.gommoni': 'Gommoni',
    'categories.yacht': 'Yacht',
    'categories.barche_vela': 'Barche a vela',
    'categories.catamarani': 'Catamarani',
    'categories.moto_acqua': 'Moto d\'acqua',
    'categories.charter': 'Charter',
    'categories.houseboat': 'Houseboat',
    'categories.gulet': 'Gulet',
    'categories.kayak': 'Kayak',
    'categories.motorboat': 'Barche a motore',
    'categories.barche_senza_patente': 'Barche senza patente',

    // Common terms
    'common.from': 'da',
    'common.per_day': 'al giorno',
    'common.book_now': 'Prenota ora',
    'common.view_details': 'Vedi dettagli',
    'common.loading': 'Caricamento...',
    'common.price': 'Prezzo',
    'common.capacity': 'Capacità',
    'common.length': 'Lunghezza',
    'common.year': 'Anno',
    'common.port': 'Porto',
    'common.skipper': 'Skipper',
    'common.fuel': 'Carburante',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.sort': 'Ordina',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.edit': 'Modifica',
    'common.delete': 'Elimina',
    'common.add': 'Aggiungi',

    // Footer
    'footer.language': 'Italiano (IT)',
    'footer.currency': '€ EUR',
    'footer.about': 'Chi siamo',
    'footer.contact': 'Contatti',
    'footer.terms': 'Termini di servizio',
    'footer.privacy': 'Privacy',
    'footer.help': 'Centro aiuto',
    'footer.support': 'Supporto',

    // Weather
    'weather.title': 'Condizioni Marine',
    'weather.temperature': 'Temperatura',
    'weather.wind': 'Vento',
    'weather.waves': 'Onde',
    'weather.conditions': 'Condizioni',

    // Dashboard
    'dashboard.my_boats': 'Le mie imbarcazioni',
    'dashboard.add_boat': 'Aggiungi imbarcazione',
    'dashboard.my_bookings': 'Le mie prenotazioni',
    'dashboard.earnings': 'Guadagni totali',
    'dashboard.rating': 'Valutazione media',
    'dashboard.statistics': 'Statistiche',
  },
  en: {
    // Navigation  
    'nav.explore': 'Explore',
    'nav.experiences': 'Experiences',
    'nav.docking': 'Docking',
    'nav.services': 'Services',
    'nav.help': 'Help',
    'nav.login': 'Login',
    'nav.register': 'Sign up',
    'nav.dashboard': 'Dashboard',
    'nav.become_owner': 'Become an owner',
    'nav.customer_area': 'Customer Area',
    'nav.sea_host_dashboard': 'Sea Host Dashboard',
    'nav.profile': 'My profile',
    'nav.bookings': 'My bookings',
    'nav.logout': 'Logout',

    // Homepage
    'homepage.hero_title': 'Find your perfect boat',
    'homepage.hero_subtitle': 'Navigate Italian seas with selected and verified boats',
    'homepage.search_placeholder': 'Where do you want to sail?',
    'homepage.search_button': 'Search boats',
    'homepage.how_it_works': 'How it works',
    'homepage.step1_title': 'Search and choose',
    'homepage.step1_desc': 'Find the perfect boat for your adventure',
    'homepage.step2_title': 'Book online',
    'homepage.step2_desc': 'Secure payment and instant confirmation',
    'homepage.step3_title': 'Sail and enjoy',
    'homepage.step3_desc': 'Live an unforgettable experience at sea',

    // Boat categories
    'categories.gommoni': 'Dinghies',
    'categories.yacht': 'Yachts',
    'categories.barche_vela': 'Sailboats',
    'categories.catamarani': 'Catamarans',
    'categories.moto_acqua': 'Jet skis',
    'categories.charter': 'Charter',
    'categories.houseboat': 'Houseboats',
    'categories.gulet': 'Gulets',
    'categories.kayak': 'Kayaks',
    'categories.motorboat': 'Motor boats',
    'categories.barche_senza_patente': 'License-free boats',

    // Common terms
    'common.from': 'from',
    'common.per_day': 'per day',
    'common.book_now': 'Book now',
    'common.view_details': 'View details',
    'common.loading': 'Loading...',
    'common.price': 'Price',
    'common.capacity': 'Capacity',
    'common.length': 'Length',
    'common.year': 'Year',
    'common.port': 'Port',
    'common.skipper': 'Skipper',
    'common.fuel': 'Fuel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',

    // Footer
    'footer.language': 'English (EN)',
    'footer.currency': '€ EUR',
    'footer.about': 'About us',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms of service',
    'footer.privacy': 'Privacy',
    'footer.help': 'Help center',
    'footer.support': 'Support',

    // Weather
    'weather.title': 'Marine Conditions',
    'weather.temperature': 'Temperature',
    'weather.wind': 'Wind',
    'weather.waves': 'Waves',
    'weather.conditions': 'Conditions',

    // Dashboard
    'dashboard.my_boats': 'My boats',
    'dashboard.add_boat': 'Add boat',
    'dashboard.my_bookings': 'My bookings',
    'dashboard.earnings': 'Total earnings',
    'dashboard.rating': 'Average rating',
    'dashboard.statistics': 'Statistics',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get language from localStorage, default to Italian
    const saved = localStorage.getItem('seago-language');
    return (saved as Language) || 'it';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('seago-language', lang);
    // Update document language
    document.documentElement.lang = lang;
  };

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[language];
    let translation = langTranslations[key as keyof typeof langTranslations] || key;
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  };

  // Set initial document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};