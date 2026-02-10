import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  fallbackImage?: string;
  initialIndex?: number;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";

export function ImageCarousel({ images, alt, fallback, className = "h-48", fallbackImage, initialIndex = 0 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const validImages = images?.filter((img) => img) || [];

  if (validImages.length === 0) {
    if (fallback) {
      return <div className={`w-full ${className}`}>{fallback}</div>;
    }
    return (
      <img
        src={fallbackImage || DEFAULT_FALLBACK}
        alt={alt}
        className={`w-full ${className} object-cover`}
      />
    );
  }

  const goTo = (index: number) => {
    if (index < 0) setCurrentIndex(validImages.length - 1);
    else if (index >= validImages.length) setCurrentIndex(0);
    else setCurrentIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipe = 50;
    if (Math.abs(diff) > minSwipe) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleImageError = useCallback((index: number) => {
    setFailedImages(prev => new Set(prev).add(index));
  }, []);

  const currentSrc = failedImages.has(currentIndex) 
    ? (fallbackImage || DEFAULT_FALLBACK) 
    : validImages[currentIndex];

  return (
    <div
      className={`relative w-full ${className} overflow-hidden group`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={currentSrc}
        alt={`${alt} ${currentIndex + 1}`}
        className={`w-full ${className} object-cover transition-opacity duration-200`}
        onError={() => handleImageError(currentIndex)}
      />

      {validImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Foto precedente"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(currentIndex + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Foto successiva"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-white w-4" : "bg-white/60"
                }`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
