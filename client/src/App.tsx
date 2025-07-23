import { Switch, Route } from "wouter";
import { lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import { SimpleTest } from "./simple-test";
import { MinimalApp } from "./minimal-app";
import { ErrorBoundary } from "./error-boundary";
import { CleanApp } from "./clean-app";
import "./hide-overlay";
import TestPage from "@/pages/test-page";
import AuthPage from "@/pages/auth-page";
import OwnerDashboard from "@/pages/owner-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import BoatDetails from "@/pages/boat-details";
import BoatBooking from "@/pages/boat-booking";
import Checkout from "@/pages/checkout";
import { SearchResults } from "@/pages/search-results";
import { EsperienzePage } from "@/pages/esperienze";
import { CharterPage } from "@/pages/charter";
import NotFound from "@/pages/not-found";
// import { InstallPrompt } from "@/components/install-prompt";
import AiutoPage from "@/pages/aiuto";
import ProfiloPage from "@/pages/profilo";
import { AIAssistantPage } from "@/pages/ai-assistant-page";
import { TestBookingPage } from "@/pages/test-booking-page";
import { TestMapPage } from "./test-map-page";
import MappaPage from "@/pages/mappa-page";
import SimpleMappa from "@/pages/simple-mappa";
import ComePrenotarePage from "@/pages/come-prenotare";
import PoliticheCancellazionePage from "@/pages/politiche-cancellazione";
import RimborsiPage from "@/pages/rimborsi";
import CondizioniServizioPage from "@/pages/condizioni-servizio";
import ContattiPage from "@/pages/contatti";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import PaymentSuccess from "@/pages/payment-success";
import DiventaNoleggiatorePage from "@/pages/diventa-noleggiatore";
import ModificaPrenotazionePage from "@/pages/modifica-prenotazione";
import DocumentiPage from "@/pages/documenti";
import AssicurazionePage from "@/pages/assicurazione";
import RecensioniPage from "@/pages/recensioni";
import MetodiPagamentoPage from "@/pages/metodi-pagamento";
import SicurezzaPagamentiPage from "@/pages/sicurezza-pagamenti";
import FatturazionePage from "@/pages/fatturazione";
import CommissioniGuadagniPage from "@/pages/commissioni-guadagni";
import GestionePrenotazioniPage from "@/pages/gestione-prenotazioni";
import AssistenzaProprietariPage from "@/pages/assistenza-proprietari";
import { InstallPrompt } from "@/components/install-prompt";
import AnalyticsPage from "@/pages/analytics-page";
import EmergencyPage from "@/pages/emergency-page";
import EmergencySystem from "@/pages/emergency-system";
import ExternalServices from "@/pages/external-services";
import AdvancedSearchPage from "@/pages/advanced-search-page";
import { ReviewsPage } from "@/pages/reviews-page";
import AvailabilityManagement from "@/pages/availability-management";
import MessagingPage from "@/pages/messaging";
import DocumentManagement from "@/pages/document-management";
import OrmeggioPage from "@/pages/ormeggio-page";
import OrmeggioBookingPage from "@/pages/ormeggio-booking";
import AdminPerformancePage from "@/pages/admin-performance";

function Router() {
  return (
    <Switch>
      <Route path="/clean" component={CleanApp} />
      <Route path="/" component={HomePage} />
      <Route path="/simple-test" component={SimpleTest} />
      <Route path="/minimal" component={MinimalApp} />
      <Route path="/search" component={SearchResults} />
      <Route path="/esperienze" component={EsperienzePage} />
      <Route path="/charter" component={CharterPage} />
      <Route path="/aiuto" component={AiutoPage} />
      <Route path="/ia" component={AIAssistantPage} />
      <Route path="/profilo" component={ProfiloPage} />
      <Route path="/test" component={TestPage} />
      <Route path="/test-booking">
        <TestBookingPage />
      </Route>
      <Route path="/test-map" component={TestMapPage} />
      <Route path="/mappa" component={MappaPage} />
      <Route path="/simple-mappa" component={SimpleMappa} />
      <Route path="/come-prenotare" component={ComePrenotarePage} />
      <Route path="/politiche-cancellazione" component={PoliticheCancellazionePage} />
      <Route path="/rimborsi" component={RimborsiPage} />
      <Route path="/condizioni-servizio" component={CondizioniServizioPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/contatti" component={ContattiPage} />
      <Route path="/diventa-noleggiatore" component={DiventaNoleggiatorePage} />
      <Route path="/modifica-prenotazione" component={ModificaPrenotazionePage} />
      <Route path="/documenti" component={DocumentiPage} />
      <Route path="/assicurazione" component={AssicurazionePage} />
      <Route path="/recensioni-user" component={ReviewsPage} />
      <Route path="/metodi-pagamento" component={MetodiPagamentoPage} />
      <Route path="/sicurezza-pagamenti" component={SicurezzaPagamentiPage} />
      <Route path="/fatturazione" component={FatturazionePage} />
      <Route path="/commissioni-guadagni" component={CommissioniGuadagniPage} />
      <Route path="/gestione-prenotazioni" component={GestionePrenotazioniPage} />
      <Route path="/assistenza-proprietari" component={AssistenzaProprietariPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/analytics-dashboard" component={lazy(() => import('./pages/analytics-dashboard'))} />
      <Route path="/admin-performance" component={AdminPerformancePage} />
      <Route path="/emergency" component={EmergencyPage} />
      <Route path="/emergency-system" component={EmergencySystem} />
      <Route path="/external-services" component={ExternalServices} />
      <Route path="/ormeggio" component={OrmeggioBookingPage} />
      <Route path="/ricerca-avanzata" component={AdvancedSearchPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/boats/:id" component={BoatDetails} />
      <Route path="/boats/:id/book" component={BoatBooking} />
      <Route path="/boats/:boatId/availability" component={AvailabilityManagement} />
      <ProtectedRoute path="/messaging" component={MessagingPage} />
      <ProtectedRoute path="/document-management" component={DocumentManagement} />
      <ProtectedRoute path="/owner-dashboard" component={OwnerDashboard} />
      <ProtectedRoute path="/customer-dashboard" component={CustomerDashboard} />
      <ProtectedRoute path="/checkout/:bookingId" component={Checkout} />
      <ProtectedRoute path="/payment-success" component={PaymentSuccess} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <Router />

        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
