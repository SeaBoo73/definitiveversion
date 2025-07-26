import { Link, useLocation } from "wouter";
import { Anchor, Facebook, Instagram, Twitter, Youtube, Globe, DollarSign } from "lucide-react";
import seagoLogo from "@assets/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753289164694.jpg";

export function Footer() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    console.log('🚢 SeaGO Footer Navigation:', path);
    setLocation(path);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src={seagoLogo} 
                alt="SeaGO Logo" 
                className="h-8 w-8 rounded object-cover"
              />
              <h3 className="text-2xl font-bold leading-none -mt-1 text-white">
                SeaGO
              </h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              La piattaforma leader per il noleggio di imbarcazioni in Italia. 
              Scopri il mare come mai prima d'ora.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Prenota una barca</Link></li>
              <li><Link to="/diventa-noleggiatore" className="hover:text-white transition-colors">Diventa Sea Host</Link></li>
              <li><Link to="/assicurazione" className="hover:text-white transition-colors">Assicurazione</Link></li>
              <li><Link to="/recensioni-user" className="hover:text-white transition-colors">Recensioni</Link></li>
            </ul>
          </div>

          {/* Prenotazioni */}
          <div>
            <h4 className="font-semibold mb-4">Prenotazioni</h4>
            <ul className="space-y-2 text-gray-400" style={{pointerEvents: 'auto', zIndex: 10, position: 'relative'}}>
              <li><button onClick={() => handleNavigate('/come-prenotare')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors cursor-pointer block text-left w-full bg-transparent border-0 p-0">Come prenotare una barca?</button></li>
              <li><button onClick={() => handleNavigate('/modifica-prenotazione')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors cursor-pointer block text-left w-full bg-transparent border-0 p-0">Posso modificare la prenotazione?</button></li>
              <li><button onClick={() => handleNavigate('/politiche-cancellazione')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors cursor-pointer block text-left w-full bg-transparent border-0 p-0">Politiche di cancellazione</button></li>
              <li><button onClick={() => handleNavigate('/documenti')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors cursor-pointer block text-left w-full bg-transparent border-0 p-0">Documenti necessari</button></li>
            </ul>
          </div>

          {/* Pagamenti */}
          <div>
            <h4 className="font-semibold mb-4">Pagamenti</h4>
            <ul className="space-y-2 text-gray-400" style={{pointerEvents: 'auto', zIndex: 10, position: 'relative'}}>
              <li><button onClick={() => handleNavigate('/metodi-pagamento')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-400 cursor-pointer block">Metodi di pagamento</button></li>
              <li><button onClick={() => handleNavigate('/sicurezza-pagamenti')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-400 cursor-pointer block">Sicurezza dei pagamenti</button></li>  
              <li><button onClick={() => handleNavigate('/rimborsi')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-400 cursor-pointer block">Richiesta di rimborso</button></li>
              <li><button onClick={() => handleNavigate('/fatturazione')} style={{pointerEvents: 'auto', zIndex: 20}} className="hover:text-white transition-colors text-left w-full bg-transparent border-none p-0 text-gray-400 cursor-pointer block">Fatturazione</button></li>
            </ul>
          </div>

          {/* Per i noleggiatori */}
          <div>
            <h4 className="font-semibold mb-4">Per i noleggiatori</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/diventa-noleggiatore" className="hover:text-white transition-colors">Come inserire la tua barca</Link></li>
              <li><Link to="/gestione-prenotazioni" className="hover:text-white transition-colors">Gestione delle prenotazioni</Link></li>
              <li><Link to="/commissioni-guadagni" className="hover:text-white transition-colors">Commissioni e guadagni</Link></li>
              <li><Link to="/assistenza-proprietari" className="hover:text-white transition-colors">Assistenza proprietari</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Supporto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/aiuto" className="hover:text-white transition-colors">Centro assistenza</Link></li>
              <li><Link to="/contatti" className="hover:text-white transition-colors">Contattaci</Link></li>
              <li><Link to="/condizioni-servizio" className="hover:text-white transition-colors">Termini e condizioni</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SeaGO. Tutti i diritti riservati.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Italiano (IT)</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">€ EUR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


