// Database completo dei porti Lazio e Campania per selezione nelle imbarcazioni
export const PORTS_DATA = [
  // Porti del Lazio
  { name: "Civitavecchia", region: "Lazio", fullName: "Porto di Civitavecchia" },
  { name: "Ponza", region: "Lazio", fullName: "Porto di Ponza" },
  { name: "Gaeta", region: "Lazio", fullName: "Porto di Gaeta" },
  { name: "Anzio", region: "Lazio", fullName: "Marina di Anzio" },
  { name: "Fiumicino", region: "Lazio", fullName: "Porto di Fiumicino" },
  { name: "Terracina", region: "Lazio", fullName: "Marina di Terracina" },
  { name: "Ostia", region: "Lazio", fullName: "Porto di Ostia" },
  { name: "San Felice Circeo", region: "Lazio", fullName: "Porto di San Felice Circeo" },
  { name: "Formia", region: "Lazio", fullName: "Porto di Formia" },
  { name: "Nettuno", region: "Lazio", fullName: "Marina di Nettuno" },
  { name: "Santa Marinella", region: "Lazio", fullName: "Porto di Santa Marinella" },
  { name: "Ventotene", region: "Lazio", fullName: "Porto di Ventotene" },
  { name: "Ladispoli", region: "Lazio", fullName: "Porto di Ladispoli" },
  { name: "Sperlonga", region: "Lazio", fullName: "Porto di Sperlonga" },
  { name: "Montalto di Castro", region: "Lazio", fullName: "Porto di Montalto di Castro" },

  // Porti della Campania
  { name: "Napoli", region: "Campania", fullName: "Porto di Napoli" },
  { name: "Salerno", region: "Campania", fullName: "Porto di Salerno" },
  { name: "Sorrento", region: "Campania", fullName: "Marina di Sorrento" },
  { name: "Amalfi", region: "Campania", fullName: "Porto di Amalfi" },
  { name: "Positano", region: "Campania", fullName: "Porto di Positano" },
  { name: "Capri", region: "Campania", fullName: "Marina Grande di Capri" },
  { name: "Ischia", region: "Campania", fullName: "Porto di Ischia" },
  { name: "Procida", region: "Campania", fullName: "Porto di Procida" },
  { name: "Pozzuoli", region: "Campania", fullName: "Porto di Pozzuoli" },
  { name: "Castellammare di Stabia", region: "Campania", fullName: "Porto di Castellammare di Stabia" },
  { name: "Torre del Greco", region: "Campania", fullName: "Porto di Torre del Greco" },
  { name: "Bagnoli", region: "Campania", fullName: "Porto di Bagnoli" },
  { name: "Marina di Stabia", region: "Campania", fullName: "Marina di Stabia" },
  { name: "Casamicciola", region: "Campania", fullName: "Porto di Casamicciola Terme" },
  { name: "Forio d'Ischia", region: "Campania", fullName: "Porto di Forio d'Ischia" },
  { name: "Cetara", region: "Campania", fullName: "Porto di Cetara" },
  { name: "Maiori", region: "Campania", fullName: "Porto di Maiori" },
  { name: "Minori", region: "Campania", fullName: "Porto di Minori" },
  { name: "Atrani", region: "Campania", fullName: "Porto di Atrani" },
  { name: "Furore", region: "Campania", fullName: "Marina di Furore" },
  { name: "Conca dei Marini", region: "Campania", fullName: "Porto di Conca dei Marini" },
  { name: "Agropoli", region: "Campania", fullName: "Porto di Agropoli" },
  { name: "Palinuro", region: "Campania", fullName: "Porto di Palinuro" },
  { name: "Marina di Camerota", region: "Campania", fullName: "Marina di Camerota" },
  { name: "Sapri", region: "Campania", fullName: "Porto di Sapri" },
  { name: "Scario", region: "Campania", fullName: "Porto di Scario" },
  { name: "Pisciotta", region: "Campania", fullName: "Marina di Pisciotta" },
  { name: "Vico Equense", region: "Campania", fullName: "Marina di Vico Equense" },
  { name: "Piano di Sorrento", region: "Campania", fullName: "Marina di Piano di Sorrento" },
  { name: "Massa Lubrense", region: "Campania", fullName: "Marina di Massa Lubrense" }
];

// Funzione per ottenere tutti i porti ordinati per regione
export function getAllPorts() {
  return PORTS_DATA.sort((a, b) => {
    if (a.region !== b.region) {
      return a.region.localeCompare(b.region);
    }
    return a.name.localeCompare(b.name);
  });
}

// Funzione per cercare porti per nome
export function searchPorts(query: string) {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  return PORTS_DATA.filter(port => 
    port.name.toLowerCase().includes(normalizedQuery) ||
    port.fullName.toLowerCase().includes(normalizedQuery)
  );
}