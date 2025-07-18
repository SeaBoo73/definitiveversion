# SeaGO - Boat Rental Platform

## Overview

SeaGO is a comprehensive boat rental platform built as a full-stack web application. It functions as an "Airbnb for boats" with features similar to Booking.com for date management and Glovo for user experience simplicity. The platform allows users to search, book, and manage boat rentals across Italy, supporting various vessel types including yachts, dinghies, catamarans, jet skis, sailboats, kayaks, charters, and houseboats.

**Current Status (July 2025):**
- ✅ Core platform fully functional with responsive mobile design
- ✅ User authentication system with multi-role support (customer, owner, admin)
- ✅ Boat search and filtering with interactive map
- ✅ Owner dashboard for boat management
- ✅ Customer dashboard for booking management
- ✅ Complete homepage with "Come funziona" and "Aiuto" sections
- ✅ Mobile-optimized web app accessible via browser
- 🔄 Stripe payment integration (to be completed)
- 🔄 React Native mobile app (in development)

## User Preferences

Preferred communication style: Simple, everyday language.
Mobile app development: React Native for native mobile experience.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful endpoints with JSON responses
- **File Structure**: Monorepo with shared schema validation

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- Multi-role authentication (customer, owner, admin)
- Password hashing with Node.js crypto (scrypt)
- Session-based authentication with secure cookie settings
- Role-based access control for different user types

### Booking System
- Real-time availability checking
- Date range selection with calendar UI
- Booking status management (pending, confirmed, cancelled, completed)
- Automatic email notifications for bookings

### Payment Integration
- Stripe integration for secure payments
- Support for credit cards, Apple Pay, and Google Pay
- 15% commission structure for platform revenue
- Automatic receipt generation

### Search & Filtering
- Interactive map with boat markers
- Multi-criteria filtering (type, location, dates, capacity, skipper, fuel)
- Real-time search results
- Category-based browsing

### User Management
- Dual registration system (customers and boat owners)
- Profile management with verification status
- Dashboard interfaces for different user roles
- Admin panel for platform management

## Data Flow

### User Registration & Authentication
1. User submits registration form with role selection
2. Password is hashed and stored securely
3. Session is created upon successful login
4. User permissions are checked for protected routes

### Boat Search & Booking
1. User applies search filters on homepage
2. Backend queries boats with availability checking
3. User selects boat and views detailed information
4. Booking dates are validated against existing bookings
5. Payment is processed through Stripe
6. Booking confirmation is sent to both parties

### Payment Processing
1. Stripe payment intent is created server-side
2. Client completes payment using Stripe Elements
3. Payment confirmation triggers booking status update
4. Platform commission is automatically calculated
5. Receipts are generated for all parties

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components
- **@stripe/stripe-js**: Payment processing
- **passport**: Authentication middleware
- **express-session**: Session management

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and developer experience
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **date-fns**: Date manipulation utilities

### Third-Party Services
- **Stripe**: Payment processing and financial transactions
- **SendGrid**: Email delivery service
- **Neon**: Serverless PostgreSQL hosting

## Deployment Strategy

### Build Process
- Client builds to `dist/public` directory
- Server builds with esbuild to `dist/index.js`
- Static assets are served from build directory

### Environment Configuration
- Database URL for PostgreSQL connection
- Stripe API keys for payment processing
- Session secret for secure authentication
- SendGrid API key for email notifications

### Production Considerations
- Session store configured for PostgreSQL
- Security headers and HTTPS enforcement
- Database connection pooling
- Error handling and logging
- Performance monitoring with query optimization

### Development Setup
- Hot module replacement with Vite
- TypeScript compilation checking
- Database schema synchronization
- Development-specific debugging tools

The application follows modern web development best practices with a focus on type safety, performance, and user experience. The architecture supports scalability through its modular design and efficient database queries, while maintaining security through proper authentication and authorization mechanisms.

## Recent Changes (July 2025)

### July 18, 2025
- **User Feedback:** "App is perfect, only missing payments and some other things"
- **Completed Features:**
  - Full mobile responsiveness with excellent user experience
  - Complete authentication system with test users
  - Functional boat search, filtering, and booking system
  - Owner dashboard for boat management
  - Customer dashboard for booking management
  - Homepage sections: "Come funziona" and "Aiuto"
  - "Diventa noleggiatore" button restored to header
- **Next Priority:** Stripe payment integration and additional features
- **Mobile App:** React Native development started alongside web app