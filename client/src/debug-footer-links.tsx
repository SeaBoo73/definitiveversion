import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export function DebugFooterLinks() {
  const [location] = useLocation();
  
  useEffect(() => {
    console.log("Current location:", location);
  }, [location]);

  const handleLinkClick = (path: string) => {
    console.log("Clicked link to:", path);
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50 text-sm">
      <div className="mb-2">Current: {location}</div>
      <div className="space-y-1">
        <Link 
          to="/documenti" 
          className="block text-blue-600 hover:underline"
          onClick={() => handleLinkClick("/documenti")}
        >
          → Documenti
        </Link>
        <Link 
          to="/fatturazione" 
          className="block text-blue-600 hover:underline"
          onClick={() => handleLinkClick("/fatturazione")}
        >
          → Fatturazione
        </Link>
        <Link 
          to="/metodi-pagamento" 
          className="block text-blue-600 hover:underline"
          onClick={() => handleLinkClick("/metodi-pagamento")}
        >
          → Metodi Pagamento
        </Link>
        <Link 
          to="/rimborsi" 
          className="block text-blue-600 hover:underline"
          onClick={() => handleLinkClick("/rimborsi")}
        >
          → Rimborsi
        </Link>
      </div>
    </div>
  );
}