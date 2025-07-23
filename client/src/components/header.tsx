import { useAuth } from "@/hooks/use-auth";
import { NotificationsCenter } from "@/components/notifications-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServicesNavButton } from "./services-nav-button";
import { Link, useLocation } from "wouter";
import { Anchor, Menu, User, Bot } from "lucide-react";
import seagoLogo from "@assets/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753289164694.jpg";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src={seagoLogo} 
                alt="SeaGO Logo" 
                className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
              />
              <span className="text-2xl font-bold whitespace-nowrap" style={{ color: '#022237' }}>SeaGO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`transition-colors font-medium ${
                location === "/" 
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              Esplora
            </Link>
            <Link 
              href="/esperienze" 
              className={`transition-colors font-medium ${
                location === "/esperienze"
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              Esperienze
            </Link>
            <Link 
              href="/charter" 
              className={`transition-colors font-medium ${
                location === "/charter"
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              Charter
            </Link>
            <Link 
              href="/ormeggio" 
              className={`transition-colors font-medium ${
                location === "/ormeggio" 
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              Ormeggio
            </Link>
            <Link 
              href="/ia" 
              className={`transition-colors font-medium flex items-center gap-1 ${
                location === "/ia" 
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              <Bot className="h-4 w-4" />
              IA
            </Link>
            {user?.role === "owner" && (
              <Link href="/owner-dashboard" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
                Dashboard Host
              </Link>
            )}
            {user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
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
            <ServicesNavButton />
            <Link 
              href="/aiuto" 
              className={`transition-colors font-medium ${
                location === "/aiuto" 
                  ? "text-deep-navy border-b-2 border-deep-navy pb-1" 
                  : "text-sea-gray hover:text-deep-navy"
              }`}
            >
              Aiuto
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && <NotificationsCenter />}
            {!user && (
              <Button asChild className="hidden md:block bg-coral hover:bg-orange-600 text-white font-bold shadow-lg">
                <Link href="/diventa-noleggiatore">Diventa noleggiatore</Link>
              </Button>
            )}
            {user?.role === "customer" && (
              <Button variant="ghost" asChild className="hidden md:block text-blue-700 hover:text-blue-900 font-semibold">
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
      </div>
    </header>
  );
}
