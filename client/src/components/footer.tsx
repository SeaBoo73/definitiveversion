import { Link } from "wouter";
import { Anchor, Facebook, Instagram, Twitter, Youtube, Globe, DollarSign } from "lucide-react";
import seagoLogo from "../assets/seago-logo.svg";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src={seagoLogo} 
                alt="SeaGO" 
                className="h-8 w-8 mr-3 rounded-lg"
              />
              <h3 className="text-2xl font-bold text-ocean-blue">
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
              <li><Link href="/" className="hover:text-white transition-colors">Prenota una barca</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Diventa host</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Assicurazione</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recensioni</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Supporto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/aiuto" className="hover:text-white transition-colors">Centro assistenza</Link></li>
              <li><Link href="/contatti" className="hover:text-white transition-colors">Contattaci</Link></li>
              <li><Link href="/condizioni-servizio" className="hover:text-white transition-colors">Termini e condizioni</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
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
