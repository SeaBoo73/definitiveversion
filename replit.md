# SeaBoo - Boat Rental Platform

## Overview
SeaBoo is a comprehensive full-stack web application, functioning as an "Airbnb for boats" with features inspired by Booking.com for date management and Glovo for user experience simplicity. It enables users to search, book, and manage boat rentals across Italy, covering various vessel types including yachts, dinghies, catamarans, jet skis, sailboats, kayaks, charters, and houseboats. The platform aims to simplify maritime rentals, offering an intuitive experience for both customers and boat owners, with integrated payment and mapping functionalities.

## User Preferences
Preferred communication style: Simple, everyday language.
Mobile app development: React Native for native mobile experience.
**IMPORTANTE:** Salvare sempre tutte le versioni e aggiornamenti - mai perdere il lavoro svolto.
Version control: Sistema di backup automatico attivato per preservare ogni modifica.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation
- **UI/UX Decisions**: Mobile-first design, clean and modern aesthetic, consistent branding with a specific color palette (ocean blue, coral), professional typography, and a preference for symmetrical, emoji-free layouts. Design elements include gradient effects, distinct badges, and interactive cards.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based authentication
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful endpoints with JSON responses
- **File Structure**: Monorepo with shared schema validation

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit
- **Connection**: Connection pooling with @neondatabase/serverless

### Key Components
- **Authentication System**: Multi-role support (customer, owner, admin) with secure password hashing and role-based access control.
- **Booking System**: Real-time availability, date range selection, status management, and automatic email notifications.
- **Payment Integration**: Secure Stripe integration supporting credit cards, Apple Pay, and Google Pay, with a 15% platform commission and automatic receipt generation.
- **Search & Filtering**: Interactive map with boat markers, multi-criteria filtering (type, location, dates, capacity, skipper, fuel), and real-time search results.
- **User Management**: Dual registration (customers and boat owners), profile management, and distinct dashboard interfaces.
- **Form Design**: Professionally redesigned forms for boat addition and experience management with color-coded sections, intuitive fields, and validation.
- **Review System**: Comprehensive rating and review system with detailed feedback categories and authenticity verification.
- **Analytics & Reporting**: Owner dashboard with detailed statistics on bookings, revenue, and boat performance.
- **Emergency System**: Integrated maritime emergency protocols with Guardia Costiera contact (1530), real-time boat geolocation, and technical assistance.
- **External Services Integration**: Real-time marine weather data, nautical fuel prices, and port services information.
- **SEO & PWA**: Comprehensive SEO optimizations including meta tags, Schema.org, sitemap, and PWA capabilities for installable web app experience.
- **AI Chat Assistant**: Integrated OpenAI GPT-4o for intelligent maritime assistance.

## External Dependencies

- **Stripe**: Payment processing and financial transactions.
- **SendGrid**: Email delivery service.
- **Neon**: Serverless PostgreSQL hosting.
- **Google Maps**: Interactive maps for boat locations and port information.
- **Open-Meteo**: Marine weather data and forecasting services.
- **OpenAI**: AI-powered chat assistance for maritime services.
- **@neondatabase/serverless**: PostgreSQL database connection.
- **drizzle-orm**: Type-safe database ORM.
- **@tanstack/react-query**: Server state management.
- **@radix-ui/react-***: Accessible UI components.
- **@stripe/stripe-js**: Payment processing.
- **passport**: Authentication middleware.
- **express-session**: Session management.
- **vite**: Build tool and development server.
- **typescript**: Type safety.
- **tailwindcss**: Utility-first CSS framework.
- **react-hook-form**: Form state management.
- **zod**: Schema validation.
- **date-fns**: Date manipulation utilities.

## Recent Changes (August 2025)

### August 7, 2025 - Rebranding Completo da SeaBoo a SeaBoo + Logo Aggiornato (Ore 5:50)
- **REBRANDING COMPLETO IMPLEMENTATO:**
  - ✅ Aggiornamento completo di tutti i riferimenti testuali da "SeaBoo" a "SeaBoo" in frontend, backend e mobile
  - ✅ **LOGO PROFESSIONALE:** Nuovo logo SeaBoo con vela turchese su sfondo navy implementato in tutti i componenti
  - ✅ **APP MOBILE NATIVA:** Tutti i file TypeScript/React Native aggiornati con nuovo branding
  - ✅ **CONFIGURAZIONI APP:** mobile/app.json e mobile/SeaBooNative/app.json aggiornati con bundle ID e naming SeaBoo
  - ✅ **EMAIL E SUPPORTO:** Aggiornati tutti gli indirizzi da support@seago.it a support@seaboo.it
  - ✅ **URL E DOMINI:** Aggiornati link privacy policy, terms of service da seago.it a seaboo.it
  - ✅ **CANALI NOTIFICA:** Aggiornato notification service da seago_general a seaboo_general
  - ✅ **READY FOR APP STORE:** VoltBuilder e Capacitor configurati, app completamente rebrandata per submission iOS

## Recent Changes (August 2025)

### August 5, 2025 - Separazione Completa Clienti/Proprietari per Apple Store (Ore 7:47)
- **SISTEMA PAGAMENTI DIFFERENZIATO PER RUOLI:**
  - ✅ **CLIENTI (Pagano servizi):** Metodi pagamento digitali (Stripe)
    - Carte di credito/debito (Visa, Mastercard, American Express)
    - Apple Pay con Touch ID/Face ID per iOS
    - Google Pay per Android
    - PayPal per transazioni sicure
    - Pagina dedicata mobile-first `/metodi-pagamento-mobile`
  - ✅ **PROPRIETARI (Ricevono pagamenti):** Dati bancari per bonifici
    - IBAN per ricevere pagamenti dai noleggi
    - Nome banca e titolare conto
    - Codice fiscale obbligatorio
    - Partita IVA opzionale per aziende
    - Indirizzo completo per fatturazione
    - Pagina dedicata `/profilo/dati-bancari`
  - ✅ **API sicure implementate:**
    - Endpoint PATCH `/api/users/:id/banking` per dati bancari proprietari
    - Validazione campi con autorizzazione rigorosa
    - Crittografia SSL/TLS per tutti i dati sensibili

- **FORM REGISTRAZIONE AGGIORNATI:**
  - ✅ Proprietari: sezione dati bancari IBAN durante registrazione
  - ✅ Clienti: info metodi pagamento disponibili (carte, digital wallet)
  - ✅ Separazione chiara tra chi paga e chi riceve pagamenti
  - ✅ UX ottimizzata per compliance Apple Store

### July 30, 2025 - Navigazione Mobile Riordinata (Ore 12:45)
- **ORDINE NAVIGAZIONE AGGIORNATO per ottimizzare UX:**
  - ✅ Nuovo ordine bottom navigation: Home → Ormeggio → Esperienze → Servizi → Aiuto → Profilo
  - ✅ Layout più logico con Ormeggio come seconda priorità dopo Home
  - ✅ Esperienze posizionate centralmente per maggior visibilità
  - ✅ Aiuto spostato prima del Profilo per accesso rapido all'assistenza
  - ✅ Mantenute tutte le icone e funzionalità esistenti
  - ✅ UX migliorata seguendo principi di information architecture

### August 13, 2025 - App Store Deployment Setup Completato (Ore 10:35)
- **READY FOR APP STORE SUBMISSION:**
  - ✅ Capacitor iOS build completato con successo
  - ✅ App ID configurato: com.seaboo.mobile
  - ✅ Info.plist aggiornato con nome "SeaBoo"
  - ✅ Logo SeaBoo integrato in Assets.xcassets
  - ✅ Homepage "Naviga verso l'avventura" confermata funzionante
  - ✅ STORE_DEPLOYMENT_GUIDE.md creato con procedura completa
  - ✅ APP_STORE_READINESS_CHECK.md con checklist finale
  - ✅ Tutti i file build iOS generati correttamente
  - ✅ App pronta per Apple Developer Account e submission

### August 15, 2025 - Evidenziazione Pulsanti e Sistemazione Banner (Ore 10:07)
- **MODIFICHE UI IMPLEMENTATE:**
  - ✅ **PULSANTI EVIDENZIATI:** "Con Skipper" con gradiente blu #0C9FE2, "Esperienze o charter" con gradiente arancione #f97316
  - ✅ **EFFETTI HOVER:** Transizioni smooth e shadow dinamiche per tutti i pulsanti
  - ✅ **PULSANTE CERCA:** Gradiente arancione migliorato con border-radius 12px e font-weight 700
  - ✅ **TIPOGRAFIA BANNER:** "Trova il tuo ormeggio ideale" con font Playfair Display, colore white su sfondo blu
  - ✅ **FONT GOOGLE:** Inter per body, Playfair Display per titoli e header
  - ✅ **MANTENNUTI:** Colore Pantone #0C9FE2 per branding e header consistente

### August 10, 2025 - Homepage "Naviga verso l'avventura" Ripristinata (Ore 6:10)
- **VERSIONE CORRETTA IMPLEMENTATA:**
  - ✅ Homepage aggiornata con design hero full-screen sfondo blu oceano
  - ✅ Titolo principale "Naviga verso l'avventura" con line break perfetto
  - ✅ Form di ricerca completo con tutti i campi (Dove, Date, Ospiti, Tipo imbarcazione)
  - ✅ Pulsanti "Con Skipper" e "Esperienze o charter" integrati
  - ✅ Pulsante "Cerca" arancione con icona lente
  - ✅ Logo SeaBoo integrato nel header della hero section
  - ✅ Banner ormeggi aggiornato: "Trova il tuo ormeggio ideale" con colore Pantone #0C9FE2
  - ✅ Versione mobile-preview.html precedente archiviata per non essere più mostrata
  - ✅ Versione nativa app mobile confermata funzionante e identica al design richiesto

### July 30, 2025 - Partner Ufficiale Capuano Trasporti Aggiunto (Ore 12:36)
- **NUOVO PARTNER: Capuano Trasporti Integrato nell'App:**
  - ✅ Sezione "Partner Ufficiali SeaBoo" aggiunta nel footer della homepage
  - ✅ Logo SVG professionale creato per Capuano Trasporti (blu #1e40af con dettagli dorati)
  - ✅ Link diretto al sito web: https://www.capuanotrasporti.com/
  - ✅ Informazioni aziendali integrate: "Trasporti Eccezionali" dal 2012
  - ✅ Localizzazione: Pozzuoli (NA) come da informazioni sito web
  - ✅ Design card elegante con hover effect e shadow per interattività
  - ✅ Posizionamento strategico tra contenuti footer e social media
  - ✅ Layout responsive mantenuto per mobile-first design