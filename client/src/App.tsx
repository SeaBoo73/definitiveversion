import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import TestPage from "@/pages/test-page";
import AuthPage from "@/pages/auth-page";
import BoatDetails from "@/pages/boat-details";
import Checkout from "@/pages/checkout";
import OwnerDashboard from "@/pages/owner-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/test" component={TestPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/boat/:id" component={BoatDetails} />
      <ProtectedRoute path="/checkout" component={Checkout} />
      <ProtectedRoute path="/owner-dashboard" component={OwnerDashboard} />
      <ProtectedRoute path="/customer-dashboard" component={CustomerDashboard} />
      <ProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
