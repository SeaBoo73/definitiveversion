# SeaGO - Boat Rental Platform

## Overview
SeaGO is a comprehensive full-stack web application, functioning as an "Airbnb for boats" with features inspired by Booking.com for date management and Glovo for user experience simplicity. It enables users to search, book, and manage boat rentals across Italy, covering various vessel types including yachts, dinghies, catamarans, jet skis, sailboats, kayaks, charters, and houseboats. The platform aims to simplify maritime rentals, offering an intuitive experience for both customers and boat owners, with integrated payment and mapping functionalities.

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

## Recent Changes (July 2025)

### July 30, 2025 - Navigazione Mobile Riordinata (Ore 12:45)
- **ORDINE NAVIGAZIONE AGGIORNATO per ottimizzare UX:**
  - ✅ Nuovo ordine bottom navigation: Home → Ormeggio → Esperienze → Servizi → Aiuto → Profilo
  - ✅ Layout più logico con Ormeggio come seconda priorità dopo Home
  - ✅ Esperienze posizionate centralmente per maggior visibilità
  - ✅ Aiuto spostato prima del Profilo per accesso rapido all'assistenza
  - ✅ Mantenute tutte le icone e funzionalità esistenti
  - ✅ UX migliorata seguendo principi di information architecture

### July 30, 2025 - Partner Ufficiale Capuano Trasporti Aggiunto (Ore 12:36)
- **NUOVO PARTNER: Capuano Trasporti Integrato nell'App:**
  - ✅ Sezione "Partner Ufficiali SeaGO" aggiunta nel footer della homepage
  - ✅ Logo SVG professionale creato per Capuano Trasporti (blu #1e40af con dettagli dorati)
  - ✅ Link diretto al sito web: https://www.capuanotrasporti.com/
  - ✅ Informazioni aziendali integrate: "Trasporti Eccezionali" dal 2012
  - ✅ Localizzazione: Pozzuoli (NA) come da informazioni sito web
  - ✅ Design card elegante con hover effect e shadow per interattività
  - ✅ Posizionamento strategico tra contenuti footer e social media
  - ✅ Layout responsive mantenuto per mobile-first design