import { Link } from "wouter";
import { Anchor, Facebook, Instagram, Twitter, Youtube, Globe, DollarSign } from "lucide-react";
import seagoLogo from "@assets/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753289164694.jpg";

export function Footer() {
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
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/come-prenotare" className="hover:text-white transition-colors">Come prenotare una barca?</Link></li>
              <li><Link to="/modifica-prenotazione" className="hover:text-white transition-colors">Posso modificare la prenotazione?</Link></li>
              <li><Link to="/politiche-cancellazione" className="hover:text-white transition-colors">Politiche di cancellazione</Link></li>
              <li><Link to="/documenti" className="hover:text-white transition-colors">Documenti necessari</Link></li>
            </ul>
          </div>

          {/* Pagamenti */}
          <div>
            <h4 className="font-semibold mb-4">Pagamenti</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/metodi-pagamento" className="hover:text-white transition-colors">Metodi di pagamento</Link></li>
              <li><Link to="/sicurezza-pagamenti" className="hover:text-white transition-colors">Sicurezza dei pagamenti</Link></li>
              <li><Link to="/rimborsi" className="hover:text-white transition-colors">Richiesta di rimborso</Link></li>
              <li><Link to="/fatturazione" className="hover:text-white transition-colors">Fatturazione</Link></li>
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


