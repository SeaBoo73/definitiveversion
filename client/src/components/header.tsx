import { useAuth } from "@/hooks/use-auth";
import { NotificationsCenter } from "@/components/notifications-center";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { Anchor, Menu, User, Bot } from "lucide-react";
import seagoLogo from "../assets/seago-logo.svg";

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
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img 
              src={seagoLogo} 
              alt="SeaGO" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-deep-navy leading-none -mt-1">SeaGO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
              Esplora
            </Link>
            <Link href="/esperienze" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
              Esperienze
            </Link>
            <Link href="/charter" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
              Charter
            </Link>
            <Link href="/ia" className="text-sea-gray hover:text-deep-navy transition-colors font-medium flex items-center gap-1">
              <Bot className="h-4 w-4" />
              IA
            </Link>
            {user?.role === "owner" && (
              <Link href="/owner-dashboard" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
                Dashboard Host
              </Link>
            )}
            {user?.role === "admin" && (
              <Link href="/admin-dashboard" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
                Admin
              </Link>
            )}
            <Link href="/aiuto" className="text-sea-gray hover:text-deep-navy transition-colors font-medium">
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
