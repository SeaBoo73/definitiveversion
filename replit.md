# SeaBoo - Boat Rental Platform

## Overview
SeaBoo is a comprehensive full-stack web application designed as an "Airbnb for boats," incorporating features inspired by Booking.com for date management and Glovo for user experience simplicity. It facilitates the search, booking, and management of boat rentals across Italy, covering various vessel types including yachts, dinghies, catamarans, jet skis, sailboats, kayaks, charters, and houseboats. The platform aims to streamline maritime rentals, offering an intuitive experience for both customers and boat owners, with integrated payment and mapping functionalities. The business vision includes simplifying maritime travel, expanding market reach in Italy, and becoming the leading platform for boat rentals.

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
- **UI/UX Decisions**: Mobile-first design, clean and modern aesthetic, consistent branding with a specific color palette (ocean blue, coral), professional typography (Inter for body, Playfair Display for titles), and a preference for symmetrical, emoji-free layouts. Design elements include gradient effects, distinct badges, interactive cards, dynamic button states (active/inactive with distinct visual cues), and redesigned forms for improved user experience. The homepage features a full-screen hero design with a clear search form.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based authentication, supporting multi-role access (customer, owner, admin).
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful endpoints with JSON responses
- **File Structure**: Monorepo with shared schema validation

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit
- **Connection**: Connection pooling with @neondatabase/serverless

### Key Components
- **Authentication System**: Secure password hashing and role-based access control.
- **Booking System**: Real-time availability, date range selection, status management, and automatic email notifications.
- **Payment Integration**: Secure Stripe integration supporting various payment methods with a 15% platform commission and automatic receipt generation. Differentiated payment handling for customers (digital methods) and owners (bank transfers via IBAN).
- **Search & Filtering**: Interactive map with boat markers, multi-criteria filtering (type, location, dates, capacity, skipper, fuel), and real-time search results.
- **User Management**: Dual registration (customers and boat owners), profile management, and distinct dashboard interfaces.
- **Review System**: Comprehensive rating and review system with detailed feedback categories and authenticity verification.
- **Analytics & Reporting**: Owner dashboard with detailed statistics on bookings, revenue, and boat performance.
- **Emergency System**: Integrated maritime emergency protocols with Guardia Costiera contact (1530), real-time boat geolocation, and technical assistance.
- **External Services Integration**: Real-time marine weather data, nautical fuel prices, and port services information.
- **SEO & PWA**: Comprehensive SEO optimizations including meta tags, Schema.org, sitemap, and PWA capabilities.
- **AI Chat Assistant**: Integrated OpenAI GPT-4o for intelligent maritime assistance.
- **Mobile Navigation**: Reordered bottom navigation for optimal UX (Home → Ormeggio → Esperienze → Servizi → Aiuto → Profilo).

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