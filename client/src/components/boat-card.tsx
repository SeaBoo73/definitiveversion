import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Users, MapPin, Clock, AlertCircle } from "lucide-react";
import { Boat } from "@shared/schema";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { ImageCarousel } from "@/components/image-carousel";

interface BoatCardProps {
  boat: Boat;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";

const sanitizeImages = (images: string[]): string[] => {
  return images.map(img => {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith('data:image/')) return img;
    if (img.includes('seagorentalboat.com')) return FALLBACK_IMAGE;
    return img;
  });
};

export function BoatCard({ boat }: BoatCardProps) {
  const { user } = useAuth();
  const { isFavorite: checkFavorite, toggleFavorite, isToggling } = useFavorites();
  const isFav = user ? checkFavorite('boat', boat.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleFavorite('boat', boat.id);
    }
  };

  const getBadgeColor = () => {
    switch (boat.type) {
      case "yacht":
        return "bg-coral text-white";
      case "catamarano":
        return "bg-deep-navy text-white";
      case "gommone":
        return "bg-yellow-500 text-white";
      default:
        return "bg-seafoam text-white";
    }
  };

  const getTypeLabel = () => {
    const labels: { [key: string]: string } = {
      gommone: "Gommone",
      yacht: "Yacht",
      catamarano: "Catamarano",
      jetski: "Moto d'acqua",
      sailboat: "Barca a vela",
      kayak: "Kayak",
      charter: "Charter",
      houseboat: "Houseboat",
      "barche-senza-patente": "Barche senza patente",
      "motorboat": "Barche a motore",
      "gulet": "Gulet"
    };
    return labels[boat.type] || boat.type;
  };

  return (
    <Link href={`/boats/${boat.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative">
          <ImageCarousel
            images={sanitizeImages(boat.images || [])}
            alt={boat.name}
            fallbackImage={FALLBACK_IMAGE}
            className="h-32"
            initialIndex={boat.coverImage || 0}
          />
          <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${getBadgeColor()} z-20`}>
            {getTypeLabel()}
          </div>
          {user && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 w-7 h-7 p-0 bg-white rounded-full hover:scale-110 transition-transform z-20"
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`h-3.5 w-3.5 ${isFav ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
              />
            </Button>
          )}
        </div>
        
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-sm text-gray-900 truncate">{boat.name}</h3>
            {boat.reviewCount && boat.reviewCount > 0 ? (
              <div className="flex items-center ml-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600 ml-0.5">{boat.rating ? Number(boat.rating).toFixed(1) : "—"}</span>
              </div>
            ) : null}
          </div>
          
          <div className="flex items-center text-gray-600 text-xs mb-1">
            <MapPin className="h-3 w-3 mr-0.5" />
            <span className="truncate">{boat.port}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-xs mb-2">
            <Users className="h-3 w-3 mr-0.5" />
            <span>{boat.maxPersons} pers.</span>
            {boat.length && (
              <>
                <span className="mx-1">•</span>
                <span>{boat.length}m</span>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-sm text-gray-900">€{boat.pricePerDay}</span>
              <span className="text-gray-600 text-xs">/giorno</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
