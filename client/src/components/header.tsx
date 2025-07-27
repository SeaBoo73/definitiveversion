import { useAuth } from "@/hooks/use-auth";
import { NotificationsCenter } from "@/components/notifications-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServicesNavButton } from "./services-nav-button";
import { Link, useLocation } from "wouter";
import { Anchor, Menu, User, Bot, X, Sunset, Sparkles, Ship } from "lucide-react";
import { useState } from "react";
import seagoLogo from "@assets/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753289164694.jpg";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src={seagoLogo} 
                alt="SeaGO Logo" 
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold" style={{ color: '#022237' }}>SeaGO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center space-x-1">
              <Link 
                href="/" 
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Ship className="h-4 w-4" />
                Esplora
              </Link>
              <Link 
                href="/esperienze" 
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/esperienze" || location === "/charter"
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Esperienze
              </Link>
              <Link 
                href="/ormeggio" 
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/ormeggio" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Anchor className="h-4 w-4" />
                Ormeggio
              </Link>
              <Link 
                href="/ia" 
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/ia" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Bot className="h-4 w-4" />
                IA
              </Link>
              <ServicesNavButton />
              <Link 
                href="/aiuto" 
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/aiuto" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Aiuto
              </Link>
              {user?.role === "owner" && (
                <Link 
                  href="/owner-dashboard" 
                  className="text-gray-700 hover:text-deep-navy transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                >
                  Dashboard Sea Host
                </Link>
              )}
              {user?.role === "customer" && (
                <Link 
                  href="/customer-dashboard" 
                  className="text-gray-700 hover:text-deep-navy transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                >
                  Area Clienti
                </Link>
              )}
              {user?.role === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:text-deep-navy transition-colors font-medium px-4 py-2 rounded-md hover:bg-gray-50 text-sm">
                      Admin
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/admin-dashboard" className="w-full cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin-performance" className="w-full cursor-pointer">Performance Center</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analytics" className="w-full cursor-pointer">Analytics</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </nav>

          {/* Right Side - User Menu & Mobile Button */}
          <div className="flex items-center space-x-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user && <NotificationsCenter />}
              {(!user || user.role === "customer") && (
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2">
                  <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
                </Button>
              )}
              
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="border border-gray-300 rounded-full">
                      <Menu className="h-4 w-4 mr-1" />
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {user.firstName?.[0] || user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={user.role === "owner" ? "/owner-dashboard?tab=profile" : "/customer-dashboard"}>Il mio profilo</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={user.role === "owner" ? "/owner-dashboard?tab=bookings" : "/customer-dashboard"}>Le mie prenotazioni</Link>
                    </DropdownMenuItem>
                    {user.role === "owner" && (
                      <DropdownMenuItem asChild>
                        <Link href="/owner-dashboard">Dashboard Sea Host</Link>
                      </DropdownMenuItem>
                    )}
                    {user.role === "customer" && (
                      <DropdownMenuItem asChild>
                        <Link href="/customer-dashboard">Area Clienti</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      Disconnetti
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" asChild className="border border-gray-300 rounded-full">
                  <Link href="/auth" className="flex items-center space-x-1">
                    <Menu className="h-4 w-4" />
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Ship className="h-4 w-4" />
                Esplora
              </Link>
              <Link 
                href="/esperienze" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/esperienze" || location === "/charter"
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4" />
                Esperienze
              </Link>
              <Link 
                href="/ormeggio" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/ormeggio" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Anchor className="h-4 w-4" />
                Ormeggio
              </Link>
              <Link 
                href="/ia" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/ia" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bot className="h-4 w-4" />
                IA
              </Link>
              <Link 
                href="/external-services" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/external-services" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Servizi
              </Link>
              <Link 
                href="/aiuto" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/aiuto" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Aiuto
              </Link>
              
              {/* Mobile User Actions */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                {!user ? (
                  <>
                    <Button asChild className="w-full bg-coral hover:bg-orange-600 text-white font-bold shadow-lg">
                      <Link href="/diventa-noleggiatore" onClick={() => setIsMobileMenuOpen(false)}>
                        Diventa noleggiatore
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        Accedi
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/customer-dashboard" 
                      className="block px-3 py-2 rounded-md font-medium text-sea-gray hover:text-deep-navy hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Il mio profilo
                    </Link>
                    {user.role === "owner" && (
                      <Link 
                        href="/owner-dashboard" 
                        className="block px-3 py-2 rounded-md font-medium text-sea-gray hover:text-deep-navy hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard Sea Host
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Link 
                        href="/customer-dashboard" 
                        className="block px-3 py-2 rounded-md font-medium text-sea-gray hover:text-deep-navy hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Area Clienti
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Button variant="ghost" asChild className="w-full justify-start text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100">
                        <Link href="/diventa-noleggiatore" onClick={() => setIsMobileMenuOpen(false)}>
                          Diventa noleggiatore
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-800"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Disconnetti
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}