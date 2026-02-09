import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { 
  Search, 
  User,
  MapPin,
  Sparkles,
  Compass,
  Home,
  CalendarDays,
  LayoutDashboard,
  MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOwnerMode } from "@/hooks/use-owner-mode";

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

const customerNavItems = (location: string) => [
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
    icon: Sparkles,
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
    active: location === "/profilo" || location === "/auth" || location === "/customer-dashboard" || location === "/ia" || location === "/aiuto"
  }
];

const ownerNavItems = (location: string) => [
  {
    icon: Home,
    label: "Home",
    path: "/owner-home",
    active: location === "/owner-home"
  },
  {
    icon: CalendarDays,
    label: "Calendario",
    path: "/owner-calendar",
    active: location === "/owner-calendar"
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/owner-dashboard",
    active: location === "/owner-dashboard"
  },
  {
    icon: MessageCircle,
    label: "Messaggi",
    path: "/owner-messages",
    active: location === "/owner-messages"
  },
  {
    icon: User,
    label: "Profilo",
    path: "/profilo",
    active: location === "/profilo"
  }
];

export function MobileNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { isOwnerMode } = useOwnerMode();

  useEffect(() => {
    scrollToTop();
  }, [location]);

  const showOwnerNav = isOwnerMode && user?.role === 'owner';
  const navItems = showOwnerNav ? ownerNavItems(location) : customerNavItems(location);
  const activeColor = showOwnerNav ? "text-coral bg-orange-50" : "text-ocean-blue bg-blue-50";
  const hoverColor = showOwnerNav ? "hover:text-coral" : "hover:text-ocean-blue";

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t ${showOwnerNav ? 'border-orange-200' : 'border-gray-200'} z-[100] md:hidden`} style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}>
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div 
                onClick={scrollToTop}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-colors min-w-0 ${
                  item.active 
                    ? activeColor
                    : `text-gray-600 ${hoverColor}`
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
