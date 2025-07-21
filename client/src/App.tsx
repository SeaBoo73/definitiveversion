import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/clean" component={CleanApp} />
      <Route path="/" component={CleanApp} />
      <Route path="/home" component={HomePage} />
      <Route path="/simple-test" component={SimpleTest} />
      <Route path="/minimal" component={MinimalApp} />
      <Route path="/search" component={SearchResults} />
      <Route path="/esperienze" component={EsperienzePage} />
      <Route path="/charter" component={CharterPage} />
      <Route path="/aiuto" component={AiutoPage} />
      <Route path="/profilo" component={ProfiloPage} />
      <Route path="/test" component={TestPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/boats/:id" component={BoatDetails} />
      <Route path="/boats/:id/book" component={BoatBooking} />
      <ProtectedRoute path="/owner-dashboard" component={OwnerDashboard} />
      <ProtectedRoute path="/customer-dashboard" component={CustomerDashboard} />
      <ProtectedRoute path="/checkout/:bookingId" component={Checkout} />
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
          {/* <InstallPrompt /> */}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
