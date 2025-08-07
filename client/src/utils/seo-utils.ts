// SEO utilities specifically for maritime/nautical content

export const maritimeKeywords = {
  // Primary maritime keywords
  primary: [
    'noleggio barche',
    'charter nautico', 
    'boat rental',
    'yacht charter',
    'ormeggi marittimi',
    'servizi nautici'
  ],
  
  // Boat types - Italian terms
  boatTypes: [
    'yacht',
    'barche a vela',
    'catamarani',
    'gommoni',
    'moto d\'acqua',
    'barche a motore',
    'houseboat',
    'gulet',
    'caiacco',
    'barche senza patente'
  ],
  
  // Italian coastal locations
  locations: [
    'Italia',
    'Lazio',
    'Campania',
    'Toscana',
    'Liguria',
    'Sardegna',
    'Sicilia',
    'costa italiana',
    'mare italiano',
    'Riviera italiana'
  ],
  
  // Services
  services: [
    'esperienze maritime',
    'charter con skipper',
    'noleggio barche lusso',
    'vacanze in barca',
    'escursioni nautiche',
    'pesca sportiva',
    'tramonti sul mare',
    'cene a bordo'
  ],
  
  // Long-tail keywords
  longTail: [
    'noleggio barche senza patente Italia',
    'charter yacht Costa Amalfitana',
    'weekend in barca Lazio',
    'vacanze maritime Toscana',
    'ormeggi sicuri Sardegna',
    'esperienze nautiche Liguria',
    'boat rental Mediterranean Italy',
    'luxury yacht charter Italian coast'
  ]
};

// Generate SEO-optimized content
export const generateMaritimeMeta = (pageType: string, location?: string, boatType?: string) => {
  const baseTitle = "SeaGO - Piattaforma Marittima";
  const baseDescription = "Scopri SeaGO, la piattaforma leader per servizi nautici in Italia";
  
  switch (pageType) {
    case 'boat-listing':
      return {
        title: `${boatType ? boatType.charAt(0).toUpperCase() + boatType.slice(1) : 'Barche'} in ${location || 'Italia'} | ${baseTitle}`,
        description: `Trova e prenota ${boatType || 'barche'} in ${location || 'Italia'}. ${baseDescription} con oltre 1000 imbarcazioni disponibili.`,
        keywords: [
          `noleggio ${boatType || 'barche'} ${location || 'Italia'}`,
          `${boatType || 'boat rental'} ${location || 'Italy'}`,
          'charter nautico',
          'servizi maritimi'
        ].join(', ')
      };
      
    case 'location-page':
      return {
        title: `Noleggio Barche ${location} | Charter e Servizi Nautici | ${baseTitle}`,
        description: `Scopri le migliori barche a noleggio ${location ? `a ${location}` : 'in Italia'}. Charter con skipper, yacht di lusso e servizi nautici completi.`,
        keywords: [
          `noleggio barche ${location || 'Italia'}`,
          `charter nautico ${location || 'Italia'}`,
          `yacht ${location || 'Italia'}`,
          'servizi portuali',
          'ormeggi sicuri'
        ].join(', ')
      };
      
    case 'service-page':
      return {
        title: `Servizi Nautici Professionali ${location ? `- ${location}` : ''} | ${baseTitle}`,
        description: `Servizi nautici completi: noleggio barche, charter, ormeggi, assistenza. ${baseDescription} per la tua esperienza marittima.`,
        keywords: [
          'servizi nautici',
          'assistenza marittima',
          'ormeggi sicuri',
          'charter professionale',
          'noleggio barche Italia'
        ].join(', ')
      };
      
    default:
      return {
        title: baseTitle,
        description: baseDescription,
        keywords: maritimeKeywords.primary.join(', ')
      };
  }
};

// Schema.org generators for maritime content
export const generateBoatSchema = (boat: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": boat.name,
  "description": boat.description,
  "category": "Boat Rental",
  "brand": {
    "@type": "Brand", 
    "name": boat.manufacturer || "SeaGO"
  },
  "offers": {
    "@type": "Offer",
    "price": boat.price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString(),
    "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    "seller": {
      "@type": "Organization",
      "name": "SeaGO"
    }
  },
  "image": boat.images?.[0] || "/attached_assets/default-boat.jpg",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Boat Type",
      "value": boat.type
    },
    {
      "@type": "PropertyValue", 
      "name": "Capacity",
      "value": `${boat.capacity} persone`
    },
    {
      "@type": "PropertyValue",
      "name": "Location",
      "value": boat.port
    },
    {
      "@type": "PropertyValue",
      "name": "Length",
      "value": `${boat.length || 'N/A'} metri`
    }
  ],
  "aggregateRating": boat.rating ? {
    "@type": "AggregateRating",
    "ratingValue": boat.rating,
    "reviewCount": boat.reviewCount || 1,
    "bestRating": 5,
    "worstRating": 1
  } : undefined
});

// Utility to clean and optimize URLs for SEO
export const generateSEOUrl = (title: string, id?: number): string => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ý]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');
    
  return id ? `${cleanTitle}-${id}` : cleanTitle;
};

// Maritime-specific meta tags
export const maritimeMetaTags = {
  // Geographic targeting
  geographic: [
    { name: 'geo.region', content: 'IT' },
    { name: 'geo.placename', content: 'Italia' },
    { name: 'geo.position', content: '41.9028;12.4964' }, // Rome coordinates
    { name: 'ICBM', content: '41.9028, 12.4964' }
  ],
  
  // Business/Industry specific
  business: [
    { name: 'business.contact_data.country_name', content: 'Italy' },
    { name: 'business.contact_data.region', content: 'Lazio' },
    { property: 'business:contact_data:locality', content: 'Roma' },
    { property: 'business:contact_data:country_name', content: 'Italy' }
  ],
  
  // Social media optimization
  social: [
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:site_name', content: 'SeaGO' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@SeaGO_Italia' }
  ]
};

// Get base URL with custom domain support
export const getBaseUrl = () => {
  return import.meta.env.VITE_CUSTOM_DOMAIN 
    ? `https://${import.meta.env.VITE_CUSTOM_DOMAIN}`
    : 'https://seaboorentalboat.com';
};