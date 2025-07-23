import { useAuth } from "@/hooks/use-auth";
import { NotificationsCenter } from "@/components/notifications-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServicesNavButton } from "./services-nav-button";
import { Link, useLocation } from "wouter";
import { Anchor, Menu, User, Bot, X } from "lucide-react";
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 min-w-fit">
            <div className="flex items-center gap-3">
              <img 
                src={seagoLogo} 
                alt="SeaGO Logo" 
                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-xl lg:text-2xl font-bold whitespace-nowrap" style={{ color: '#022237' }}>SeaGO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center max-w-4xl">
            <Link 
              href="/" 
              className={`transition-colors font-medium px-2 py-1 rounded-md ${
                location === "/" 
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              Esplora
            </Link>
            <Link 
              href="/esperienze" 
              className={`transition-colors font-medium px-2 py-1 rounded-md ${
                location === "/esperienze"
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              Esperienze
            </Link>
            <Link 
              href="/charter" 
              className={`transition-colors font-medium px-2 py-1 rounded-md ${
                location === "/charter"
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              Charter
            </Link>
            <Link 
              href="/ormeggio" 
              className={`transition-colors font-medium px-2 py-1 rounded-md ${
                location === "/ormeggio" 
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              Ormeggio
            </Link>
            <Link 
              href="/ia" 
              className={`transition-colors font-medium px-2 py-1 rounded-md flex items-center gap-1 ${
                location === "/ia" 
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              <Bot className="h-4 w-4" />
              IA
            </Link>
            <ServicesNavButton />
            <Link 
              href="/aiuto" 
              className={`transition-colors font-medium px-2 py-1 rounded-md ${
                location === "/aiuto" 
                  ? "text-deep-navy bg-gray-100 font-semibold" 
                  : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
              }`}
            >
              Aiuto
            </Link>
            {user?.role === "owner" && (
              <Link 
                href="/owner-dashboard" 
                className="text-sea-gray hover:text-deep-navy transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-50"
              >
                Dashboard Host
              </Link>
            )}
            {user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sea-gray hover:text-deep-navy transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-50">
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
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="lg:hidden flex items-center justify-center h-10 w-10 p-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            {user && <NotificationsCenter />}
            {!user && (
              <Button asChild className="bg-coral hover:bg-orange-600 text-white font-bold shadow-lg text-sm px-4 py-2">
                <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
              </Button>
            )}
            {user?.role === "customer" && (
              <Button variant="ghost" asChild className="text-blue-700 hover:text-blue-900 font-semibold text-sm px-3 py-2">
                <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-full py-1 px-3 hover:shadow-md transition-shadow cursor-pointer">
                    <Menu className="h-4 w-4 text-gray-600" />
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.firstName?.[0] || user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/customer-dashboard">Il mio profilo</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/customer-dashboard">Le mie prenotazioni</Link>
                  </DropdownMenuItem>
                  {user.role === "owner" && (
                    <DropdownMenuItem asChild>
                      <Link href="/owner-dashboard">Dashboard Host</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    Disconnetti
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 border border-gray-300 rounded-full py-1 px-3 hover:shadow-md transition-shadow cursor-pointer">
                <Link href="/auth" className="flex items-center space-x-2">
                  <Menu className="h-4 w-4 text-gray-600" />
                  <User className="h-4 w-4 text-gray-600" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Esplora
              </Link>
              <Link 
                href="/esperienze" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/esperienze"
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Esperienze
              </Link>
              <Link 
                href="/charter" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/charter"
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Charter
              </Link>
              <Link 
                href="/ormeggio" 
                className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                  location === "/ormeggio" 
                    ? "text-deep-navy bg-gray-100 font-semibold" 
                    : "text-sea-gray hover:text-deep-navy hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
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
                        Dashboard Host
                      </Link>
                    )}
                    {user.role === "customer" && (
                      <Button variant="ghost" asChild className="w-full justify-start text-blue-700 hover:text-blue-900">
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
