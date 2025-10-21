// Database completo dei cantieri nautici per tutte le categorie di barche
export const BOAT_MANUFACTURERS = {
  // Yacht di lusso
  yacht: [
    "Azimut", "Ferretti", "Riva", "Pershing", "Benetti", "Sanlorenzo", "Baglietto",
    "Sunseeker", "Princess", "Fairline", "Beneteau", "Jeanneau", "Sea Ray", "Cranchi",
    "Absolute", "Galeon", "Prestige", "Lagoon", "Bavaria", "Hanse"
  ],
  
  // Barche a vela
  sailboat: [
    "Beneteau", "Jeanneau", "Bavaria", "Hanse", "Dufour", "X-Yachts", "Dehler",
    "Elan", "Grand Soleil", "Solaris", "Comet", "Etap", "Najad", "Hallberg-Rassy",
    "Moody", "Oyster", "Swan", "Wauquiez", "Contest", "Arcona", "Italia Yachts",
    "Advanced Yachts", "Ice Yachts", "Pogo Structures", "RM Yachts"
  ],
  
  // Catamarani
  catamaran: [
    "Lagoon", "Fountaine Pajot", "Catana", "Leopard", "Privilege", "Nautitech",
    "Seawind", "Gemini", "Outremer", "Maverick", "Sunreef", "HH Catamarans",
    "Balance", "Voyage", "Antares", "Aventura", "Broadblue", "Excess"
  ],
  
  // Gommoni
  dinghy: [
    "Zodiac", "Bombard", "Quicksilver", "Highfield", "AB Inflatables", "Avon",
    "Hypalon", "Valiant", "Mariner", "Mercury", "Caribe", "West Marine",
    "Achilles", "Seamax", "Saturn", "Newport Vessels", "Intex", "Bestway"
  ],
  
  // Moto d'acqua
  jetski: [
    "Yamaha", "Kawasaki", "Sea-Doo", "Polaris", "Honda", "Suzuki", "KTM",
    "Beta", "Aprilia", "Can-Am", "Bombardier"
  ],
  
  // Charter tradizionali
  charter: [
    "Gulet", "Traditional Turkish", "Wooden Yacht", "Classic Sail",
    "Mediterranean Charter", "Turkish Gulet", "Croatian Charter",
    "Greek Traditional", "Italian Charter", "French Charter"
  ],
  
  // Houseboat
  houseboat: [
    "Gibson", "Stardust Cruisers", "Sumerset", "Thoroughbred", "Adventure Craft",
    "Horizon", "Catamaran Cruisers", "Jamestowner", "Skipperliner",
    "Lakeview", "Holiday Mansion", "Fun Country", "Destination Yachts"
  ],
  
  // Gulet
  gulet: [
    "Turkish Gulet", "Bodrum Gulet", "Marmaris Gulet", "Gocek Gulet",
    "Traditional Gulet", "Luxury Gulet", "Classic Gulet", "Motor Sailer",
    "Ketch Gulet", "Schooner Gulet", "Custom Gulet"
  ],
  
  // Kayak/Caiacco
  kayak: [
    "Ocean Kayak", "Perception", "Wilderness Systems", "Old Town", "Pyranha",
    "Dagger", "Liquid Logic", "Jackson Kayak", "Riot", "Point 65",
    "Advanced Elements", "Aquaglide", "Sea Eagle", "BOTE", "Hobie"
  ],
  
  // Barche a motore
  motorboat: [
    "Boston Whaler", "Sea Ray", "Chaparral", "Cobalt", "Formula", "Regal",
    "Monterey", "Four Winns", "Bayliner", "Maxum", "Larson", "Glastron",
    "Stingray", "Rinker", "Chris-Craft", "Mastercraft", "Malibu", "Nautique",
    "Centurion", "Supra", "Tige", "Moomba", "Axis", "Heyday"
  ],
  
  // Barche senza patente
  "barche-senza-patente": [
    "Quicksilver", "Beneteau Flyer", "Jeanneau Cap Camarat", "Ranieri",
    "Marinello", "Stingher", "Sessa", "Flaminia", "Idea Marine",
    "Selva", "Scanner", "Nuova Jolly", "Lomac", "BSC", "Tempest",
    "Mano Marine", "AM Yacht", "Marlin Boat", "Coverline", "Open"
  ]
};

// Lista completa di tutti i cantieri per validazione generale
export const ALL_MANUFACTURERS = Array.from(
  new Set(Object.values(BOAT_MANUFACTURERS).flat())
).sort();

// Funzione per validare un cantiere
export function validateManufacturer(manufacturer: string, boatType?: string): boolean {
  const normalizedManufacturer = manufacturer.trim();
  
  if (!normalizedManufacturer) return false;
  
  // Se viene specificato il tipo di barca, controlla solo in quella categoria
  if (boatType && BOAT_MANUFACTURERS[boatType as keyof typeof BOAT_MANUFACTURERS]) {
    const categoryManufacturers = BOAT_MANUFACTURERS[boatType as keyof typeof BOAT_MANUFACTURERS];
    return categoryManufacturers.some(m => 
      m.toLowerCase() === normalizedManufacturer.toLowerCase()
    );
  }
  
  // Altrimenti controlla in tutti i cantieri
  return ALL_MANUFACTURERS.some(m => 
    m.toLowerCase() === normalizedManufacturer.toLowerCase()
  );
}

// Funzione per ottenere suggerimenti di cantieri per una categoria
export function getManufacturersByCategory(boatType: string): string[] {
  return BOAT_MANUFACTURERS[boatType as keyof typeof BOAT_MANUFACTURERS] || [];
}

// Funzione per trovare cantieri simili (per suggerimenti)
export function findSimilarManufacturers(input: string, limit: number = 5): string[] {
  const normalizedInput = input.toLowerCase().trim();
  if (!normalizedInput) return [];
  
  return ALL_MANUFACTURERS
    .filter(manufacturer => 
      manufacturer.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(manufacturer.toLowerCase())
    )
    .slice(0, limit);
}