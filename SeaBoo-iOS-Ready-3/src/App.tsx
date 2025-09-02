import { Router, Route, Link, useLocation } from 'wouter'
import { Home, Anchor, Compass, Settings, HelpCircle, User } from 'lucide-react'

// Main App Component
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/ormeggio" component={OrmeggioPage} />
        <Route path="/esperienze" component={EsperienzePage} />
        <Route path="/servizi" component={ServiziPage} />
        <Route path="/aiuto" component={AiutoPage} />
        <Route path="/profilo" component={ProfiloPage} />
        <BottomNavigation />
      </Router>
    </div>
  )
}

// Homepage Component
function HomePage() {
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white px-6 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">SeaBoo</h1>
          <p className="text-lg opacity-90 mb-8">Naviga verso l'avventura</p>
          
          {/* Search Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Destinazione</label>
              <input 
                type="text" 
                placeholder="Dove vuoi navigare?"
                className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-300"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data inizio</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Data fine</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Cerca Barche
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perché scegliere SeaBoo?</h2>
        <div className="grid grid-cols-1 gap-6">
          <FeatureCard 
            icon="🚤"
            title="Ampia selezione"
            description="Yacht, barche a vela, catamarani e molto altro"
          />
          <FeatureCard 
            icon="🏆"
            title="Qualità garantita"
            description="Tutte le imbarcazioni sono verificate e assicurate"
          />
          <FeatureCard 
            icon="💳"
            title="Pagamenti sicuri"
            description="Transazioni protette e assistenza 24/7"
          />
        </div>
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

// Page Components
function OrmeggioPage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Ormeggio</h1>
      <p className="text-gray-600">Trova il porto perfetto per la tua imbarcazione.</p>
    </div>
  )
}

function EsperienzePage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Esperienze</h1>
      <p className="text-gray-600">Scopri esperienze uniche in mare.</p>
    </div>
  )
}

function ServiziPage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Servizi</h1>
      <p className="text-gray-600">Servizi aggiuntivi per la tua navigazione.</p>
    </div>
  )
}

function AiutoPage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Aiuto</h1>
      <p className="text-gray-600">Centro assistenza e supporto clienti.</p>
    </div>
  )
}

function ProfiloPage() {
  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-6">Profilo</h1>
      <p className="text-gray-600">Gestisci il tuo account SeaBoo.</p>
    </div>
  )
}

// Bottom Navigation Component
function BottomNavigation() {
  const [location] = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ormeggio', icon: Anchor, label: 'Ormeggio' },
    { path: '/esperienze', icon: Compass, label: 'Esperienze' },
    { path: '/servizi', icon: Settings, label: 'Servizi' },
    { path: '/aiuto', icon: HelpCircle, label: 'Aiuto' },
    { path: '/profilo', icon: User, label: 'Profilo' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location === item.path
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default App