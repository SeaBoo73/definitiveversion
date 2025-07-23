import { Link } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Boat } from "@shared/schema";
import gommoneImage from "@assets/gommone senza patente_1752875806367.webp";
import jetskiImage from "@assets/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg";
import barcheSenzaPatenteImage from "@assets/OIP (1)_1752921317486.webp";
import catamaranoImage from "@assets/catamarano ludovica_1752876117442.jpg";
import charterImage from "@assets/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg";
import sailboatImage from "@assets/barca a vela ludovica_1752876195081.jpg";
import houseboatImage from "@assets/OIP_1752919948843.webp";
import motorboatImage from "@assets/R (1)_1752920495156.jpg";

const categoryMapping = [
  {
    id: "gommone",
    name: "Gommoni",
    description: "Imbarcazioni pneumatiche versatili e sicure",
    image: gommoneImage,
  },
  {
    id: "barche-senza-patente",
    name: "Barche senza patente",
    description: "Facili da guidare, perfette per principianti",
    image: barcheSenzaPatenteImage,
  },
  {
    id: "yacht",
    name: "Yacht",
    description: "Lusso e comfort per una navigazione esclusiva",
    image: motorboatImage,
  },
  {
    id: "sailboat",
    name: "Barche a vela",
    description: "L'esperienza autentica della navigazione",
    image: sailboatImage,
  },
  // Categorie senza corrispondenza nel DB - mantenute per completezza UI
  {
    id: "jetski",
    name: "Moto d'acqua", 
    description: "Adrenalina e velocità sull'acqua",
    image: jetskiImage,
  },
  {
    id: "catamarano",
    name: "Catamarani",
    description: "Spazio e stabilità per gruppi numerosi",
    image: catamaranoImage,
  },
  {
    id: "charter",
    name: "Charter",
    description: "Esperienza completa con skipper professionista",
    image: charterImage,
  },
  {
    id: "houseboat",
    name: "Houseboat",
    description: "La tua casa galleggiante per vacanze uniche",
    image: houseboatImage,
  },
  {
    id: "motorboat",
    name: "Barche a motore",
    description: "Velocità e comfort per esplorare la costa", 
    image: motorboatImage,
  },
];

export function CategoryGallery() {
  const { data: boats = [], isLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
  });



  // Calcola i contatori reali per ogni categoria
  const getCategoryCount = (categoryId: string) => {
    return boats.filter(boat => boat.type === categoryId).length;
  };

  // Crea le categorie con i contatori dinamici
  const categories = categoryMapping.map(cat => ({
    ...cat,
    count: getCategoryCount(cat.id)
  })); // Mostra tutte le categorie, anche quelle senza barche

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Esplora per categoria</h2>
          <p className="text-lg text-gray-600">Trova l'imbarcazione perfetta per la tua avventura</p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-gradient-to-r from-ocean-blue to-deep-navy">
              <Link href="/categories">
                Vedi Tutte le Categorie
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                
                {/* Contatore barche */}
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="font-bold text-sm text-gray-800">{category.count}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 group-hover:text-ocean-blue transition-colors mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              
              {/* Pulsante Esplora */}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300"
                asChild
              >
                <Link href={`/search?boatTypes=${category.id}`}>
                  Esplora
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
