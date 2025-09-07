import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Star, Quote, User } from "lucide-react";

export default function RecensioniPage() {
  const reviews = [
    {
      id: 1,
      name: "Marco Rossi",
      location: "Roma",
      rating: 5,
      text: "Esperienza fantastica! La barca era perfetta e il servizio clienti eccellente. Sicuramente tornerò.",
      boat: "Beneteau Oceanis 41",
      date: "Giugno 2024"
    },
    {
      id: 2,
      name: "Sofia Bianchi",
      location: "Milano",
      rating: 5,
      text: "Weekend perfetto alle Cinque Terre. Tutto organizzato nei minimi dettagli, super consigliato!",
      boat: "Jeanneau Sun Odyssey",
      date: "Luglio 2024"
    },
    {
      id: 3,
      name: "Giuseppe Verdi",
      location: "Napoli",
      rating: 5,
      text: "SeaBoo ha reso il nostro anniversario indimenticabile. Servizio impeccabile e barca stupenda.",
      boat: "Bavaria Cruiser 46",
      date: "Agosto 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Recensioni dei Clienti
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri cosa dicono i nostri clienti delle loro esperienze con SeaBoo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-ocean-blue mb-2">4.9</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600">Valutazione media</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-ocean-blue mb-2">1,247</div>
            <p className="text-gray-600">Recensioni totali</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-ocean-blue mb-2">98%</div>
            <p className="text-gray-600">Clienti soddisfatti</p>
          </div>
        </div>

        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <p className="text-gray-600 text-sm">{review.location} • {review.date}</p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {review.text}
              </p>
              <p className="text-ocean-blue font-medium">
                Imbarcazione: {review.boat}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-ocean-blue text-white rounded-xl p-8 text-center mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            Condividi la Tua Esperienza
          </h2>
          <p className="text-lg mb-6">
            Hai noleggiato con SeaBoo? Lascia una recensione e aiuta altri navigatori!
          </p>
          <button className="bg-white text-ocean-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Scrivi una Recensione
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}