import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import HomePage from "@/pages/home-page";
import TestPage from "@/pages/test-page";
import AuthPage from "@/pages/auth-page";
import OwnerDashboard from "@/pages/owner-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/test" component={TestPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/owner-dashboard" component={OwnerDashboard} />
      <ProtectedRoute path="/customer-dashboard" component={CustomerDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
