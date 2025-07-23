import { Link, useLocation } from "wouter";
import { 
  Search, 
  Calendar, 
  Ship, 
  HelpCircle, 
  User,
  MapPin 
} from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Search,
      label: "Esplora",
      path: "/",
      active: location === "/"
    },
    {
      icon: Calendar,
      label: "Esperienze", 
      path: "/esperienze",
      active: location === "/esperienze"
    },
    {
      icon: Ship,
      label: "Charter",
      path: "/charter", 
      active: location === "/charter"
    },
    {
      icon: MapPin,
      label: "Ormeggio",
      path: "/ormeggio", 
      active: location === "/ormeggio"
    },
    {
      icon: HelpCircle,
      label: "Aiuto",
      path: "/aiuto",
      active: location === "/aiuto"
    },
    {
      icon: User,
      label: "Profilo",
      path: "/profilo",
      active: location === "/profilo" || location === "/auth" || location === "/customer-dashboard" || location === "/owner-dashboard"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active 
                  ? "text-ocean-blue bg-blue-50" 
                  : "text-gray-600 hover:text-ocean-blue"
              }`}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}