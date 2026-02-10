import { useAuth } from "@/hooks/use-auth";
import { NotificationsCenter } from "@/components/notifications-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ServicesNavButton } from "./services-nav-button";
import { useMooringFavorites } from "@/hooks/use-favorites";
import { Link, useLocation } from "wouter";
import { Anchor, Menu, User, Bot, X, Sunset, Sparkles, Ship, Heart, MapPin, Trash2, Home, CalendarDays, LayoutDashboard, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useOwnerMode } from "@/hooks/use-owner-mode";
import seabooLogo from "@assets/WhatsApp Image 2025-08-19 at 12.38.33_1759682721865.jpeg";

const MOORING_NAMES: Record<string, { title: string; port: string; price: number }> = {
  'mooring-1': { title: 'Porto di Civitavecchia - Pontile Premium', port: 'Civitavecchia', price: 700 },
  'mooring-2': { title: 'Marina di Gaeta - Boa Campo Boe', port: 'Gaeta', price: 150 },
  'mooring-3': { title: 'Porto di Anzio - Pontile Standard', port: 'Anzio', price: 450 },
  'mooring-4': { title: 'Terracina - Boa Economica', port: 'Terracina', price: 120 },
  'mooring-5': { title: 'Formia - Pontile Medio', port: 'Formia', price: 350 },
  'mooring-6': { title: 'Nettuno - Boa Premium', port: 'Nettuno', price: 200 },
};

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favorites, toggleFavorite } = useMooringFavorites();
  const { isOwnerMode } = useOwnerMode();
  const showOwnerNav = isOwnerMode && user?.role === 'owner';

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, [role="button"]')) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className="bg-white shadow-sm sticky top-0 z-50 pt-[max(env(safe-area-inset-top),24px)]"
      onClick={handleScrollToTop}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src={seabooLogo} 
                alt="SeaBoo Logo" 
                className="h-10 w-10 object-contain rounded-lg"
              />
              <span className="text-xl font-bold" style={{ color: '#022237' }}>SeaBoo</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {showOwnerNav ? (
              <div className="flex items-center space-x-1">
                <Link 
                  href="/owner-home" 
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    location === "/owner-home" 
                      ? "text-coral border-b-2 border-coral" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <Link 
                  href="/owner-calendar" 
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    location === "/owner-calendar" 
                      ? "text-coral border-b-2 border-coral" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" />
                  Calendario
                </Link>
                <Link 
                  href="/owner-dashboard" 
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    location === "/owner-dashboard" 
                      ? "text-coral border-b-2 border-coral" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/owner-messages" 
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    location === "/owner-messages" 
                      ? "text-coral border-b-2 border-coral" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  Messaggi
                </Link>
                <Link 
                  href="/profilo" 
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                    location === "/profilo" 
                      ? "text-coral border-b-2 border-coral" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profilo
                </Link>
              </div>
            ) : (
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
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      location === "/owner-dashboard" 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Dashboard Sea Host
                  </Link>
                )}
                {user?.role === "customer" && (
                  <Button variant="ghost" asChild className="px-2 py-1 text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100">
                    <Link href="/diventa-noleggiatore">
                      Diventa noleggiatore
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </nav>

          {/* Right Side - Auth & Notifications */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Favorites Popover - hidden on small mobile */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative" data-testid="button-favorites">
                  <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">I tuoi preferiti</h3>
                  <p className="text-sm text-gray-500">{favorites.length} ormeggi salvati</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {favorites.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Heart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nessun ormeggio salvato</p>
                      <p className="text-xs mt-1">Clicca il cuore su un ormeggio per salvarlo</p>
                    </div>
                  ) : (
                    favorites.map((fav) => {
                      const mooringInfo = MOORING_NAMES[fav.id] || { 
                        title: fav.title || 'Ormeggio', 
                        port: 'Porto', 
                        price: 0 
                      };
                      return (
                        <div key={fav.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Anchor className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/ormeggio/${fav.id}`} 
                              className="font-medium text-gray-900 hover:text-blue-600 text-sm line-clamp-1"
                            >
                              {mooringInfo.title}
                            </Link>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <MapPin className="h-3 w-3 mr-1" />
                              {mooringInfo.port}
                            </div>
                            {mooringInfo.price > 0 && (
                              <div className="text-xs font-medium text-blue-600 mt-0.5">
                                €{mooringInfo.price}/notte
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500 p-1"
                            onClick={() => toggleFavorite(fav.id)}
                            data-testid={`button-remove-favorite-${fav.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
                {favorites.length > 0 && (
                  <div className="p-3 border-t bg-gray-50">
                    <Link href="/ormeggio">
                      <Button variant="outline" size="sm" className="w-full">
                        Cerca altri ormeggi
                      </Button>
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {user && <NotificationsCenter />}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.profileImage && (
                        <AvatarImage 
                          src={user.profileImage} 
                          alt={user.firstName || user.username || "Profilo"} 
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user.firstName?.[0] || user.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/profilo" 
                      className="flex items-center gap-2 w-full"
                    >
                      <User className="h-4 w-4" />
                      Il mio profilo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href={user.role === "owner" ? "/owner-dashboard?tab=bookings" : "/customer-dashboard"} 
                      className="flex items-center gap-2 w-full"
                    >
                      <Sunset className="h-4 w-4" />
                      Le mie prenotazioni
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Disconnetti
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth">Accedi</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth">Registrati</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  Esplora
                </div>
              </Link>
              
              <Link 
                href="/ormeggio" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/ormeggio" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Anchor className="h-4 w-4" />
                  Ormeggio
                </div>
              </Link>
              
              <Link 
                href="/esperienze" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/esperienze" || location === "/charter"
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Esperienze
                </div>
              </Link>
              
              <Link 
                href="/ia" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/ia" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  IA
                </div>
              </Link>
              
              <Link 
                href="/external-services" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/external-services" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Servizi
              </Link>
              
              <Link 
                href="/aiuto" 
                className={`block px-3 py-2 rounded-md font-medium ${
                  location === "/aiuto" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Aiuto
              </Link>
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="mt-4 pt-4 border-t space-y-2">
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
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t space-y-2">
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Accedi
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Registrati
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}