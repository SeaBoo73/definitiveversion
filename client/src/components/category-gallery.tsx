import { Link } from "wouter";
import { useState } from "react";

const categories = [
  {
    id: "gommone",
    name: "Gommone",
    description: "Perfetto per escursioni giornaliere",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "yacht",
    name: "Yacht",
    description: "Lusso e comfort per gruppi",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "catamarano",
    name: "Catamarano",
    description: "Stabilità e spazio per famiglie",
    image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "jetski",
    name: "Moto d'acqua",
    description: "Adrenalina pura",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "sailboat",
    name: "Barca a vela",
    description: "Navigazione tradizionale",
    image: "https://images.unsplash.com/photo-1568605117036-cfb79e7ad4f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "kayak",
    name: "Kayak",
    description: "Esplorazione silenziosa",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "charter",
    name: "Charter",
    description: "Servizio completo con equipaggio",
    image: "https://images.unsplash.com/photo-1567095751004-aa51a2690368?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
  {
    id: "houseboat",
    name: "Houseboat",
    description: "Casa galleggiante per soggiorni",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
  },
];

export function CategoryGallery() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Esplora per categoria</h2>
          <p className="text-lg text-gray-600">Trova l'imbarcazione perfetta per la tua avventura</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?type=${category.id}`}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-ocean-blue transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
