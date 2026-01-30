import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ship, MapPin, Calendar, Shield, ChevronRight, ChevronLeft } from "lucide-react";
import seabooLogo from "@assets/Logo_SeaBoo_1769779759913.jpg";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Ship,
    title: "Benvenuto su SeaBoo",
    description: "La tua app per noleggiare barche in modo semplice e sicuro. Trova l'imbarcazione perfetta per la tua avventura in mare.",
    color: "bg-blue-500"
  },
  {
    icon: MapPin,
    title: "Scopri Destinazioni",
    description: "Esplora le migliori destinazioni costiere. Da porti turistici a calette nascoste, trova il luogo perfetto per la tua navigazione.",
    color: "bg-teal-500"
  },
  {
    icon: Calendar,
    title: "Prenota Facilmente",
    description: "Seleziona date, scegli la barca e prenota in pochi tap. Gestisci le tue prenotazioni direttamente dall'app.",
    color: "bg-cyan-500"
  },
  {
    icon: Shield,
    title: "Naviga in Sicurezza",
    description: "Tutti i noleggiatori sono verificati. Pagamenti sicuri e assistenza 24/7 per una navigazione senza pensieri.",
    color: "bg-indigo-500"
  }
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrevious = () => {
    if (isAnimating || currentSlide === 0) return;
    setIsAnimating(true);
    setCurrentSlide(prev => prev - 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSkip = () => {
    onComplete();
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-between p-6 safe-area-inset">
        <div className="w-full flex justify-between items-center pt-4">
          <img src={seabooLogo} alt="SeaBoo" className="h-16 rounded-lg" />
          {currentSlide < slides.length - 1 && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Salta
            </Button>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <div 
            className={`w-24 h-24 rounded-full ${slides[currentSlide].color} flex items-center justify-center mb-8 shadow-2xl transition-all duration-300`}
          >
            <CurrentIcon className="w-12 h-12 text-white" />
          </div>

          <div className="text-center transition-opacity duration-300" style={{ opacity: isAnimating ? 0.5 : 1 }}>
            <h1 className="text-3xl font-bold text-white mb-4">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg text-white/90 leading-relaxed px-4">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 pb-8">
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => !isAnimating && setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-14 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Indietro
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={`${currentSlide === 0 ? "w-full" : "flex-1"} h-14 bg-white text-blue-600 hover:bg-white/90 font-semibold text-lg shadow-lg`}
            >
              {currentSlide === slides.length - 1 ? (
                "Inizia"
              ) : (
                <>
                  Avanti
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
