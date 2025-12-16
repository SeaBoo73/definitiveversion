import { Link, useLocation } from "wouter";
import { useEffect, useCallback } from "react";
import { 
  Search, 
  Settings, 
  User,
  MapPin,
  Compass,
  Sparkles
} from "lucide-react";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.scrollTop = 0;
  const scrollableElements = document.querySelectorAll('[class*="overflow"]');
  scrollableElements.forEach(el => {
    if (el instanceof HTMLElement && el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
};

export function MobileNavigation() {
  const [location] = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location]);

  const navItems = [
    {
      icon: Search,
      label: "Esplora",
      path: "/",
      active: location === "/"
    },
    {
      icon: MapPin,
      label: "Ormeggio",
      path: "/ormeggio", 
      active: location === "/ormeggio"
    },
    {
      icon: Sparkles, // FORCE UPDATE
      label: "Esperienze", 
      path: "/esperienze",
      active: location === "/esperienze" || location === "/charter"
    },
    {
      icon: Compass,
      label: "Servizi",
      path: "/external-services",
      active: location === "/external-services" || location === "/emergency-system"
    },
    {
      icon: User,
      label: "Profilo",
      path: "/profilo",
      active: location === "/profilo" || location === "/auth" || location === "/customer-dashboard" || location === "/owner-dashboard" || location === "/ia" || location === "/aiuto"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] md:hidden">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div 
                onClick={scrollToTop}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 ${
                  item.active 
                    ? "text-ocean-blue bg-blue-50" 
                    : "text-gray-600 hover:text-ocean-blue"
                }`}
              >
                <Icon className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}