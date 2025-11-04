import { Router } from "express";
import OpenAI from "openai";

const router = Router();

// Initialize OpenAI with error handling
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn("OpenAI not initialized - API key may be missing");
}

// AI Chat endpoint
router.post("/chat", async (req, res) => {
  console.log('[AI] Chat endpoint called with:', { message: req.body?.message, hasContext: !!req.body?.context });
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: "Message is required and must be a string" 
      });
    }

    // Check if OpenAI is available
    if (!openai) {
      return res.status(503).json({
        error: "AI service temporarily unavailable",
        fallbackMessage: "Mi dispiace, il servizio di assistenza AI non è al momento disponibile. Puoi contattarci tramite email per ricevere supporto immediato."
      });
    }

    // Create system prompt for SeaBoo maritime assistant
    const systemPrompt = `Sei l'assistente AI di SeaBoo, una piattaforma italiana per il noleggio di barche nel Lazio. 
    
    Le tue competenze includono:
    - Informazioni su barche disponibili (yacht, gommoni, catamarani, barche a vela, jet ski, charter, houseboat)
    - Consigli su porti e marine nel Lazio (Civitavecchia, Gaeta, Ponza, Terracina, Anzio, Formia, Nettuno)
    - Condizioni meteo marine e raccomandazioni di sicurezza
    - Prezzi carburante nautico e servizi portuali
    - Assistenza per prenotazioni e noleggi
    - Informazioni su patenti nautiche e requisiti
    - Consigli per itinerari e destinazioni marine nel Lazio
    
    Rispondi sempre in italiano, in modo cordiale e professionale. Se non conosci una informazione specifica, suggerisci di contattare il servizio clienti o fornisci informazioni generali utili.
    
    Non inventare prezzi specifici o disponibilità esatte - suggerisci di consultare la piattaforma per informazioni aggiornate.`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return res.status(500).json({
        error: "No response from AI service",
        fallbackMessage: "Mi dispiace, non sono riuscito a elaborare la tua richiesta. Prova a riformulare la domanda."
      });
    }

    res.json({ 
      response,
      model: "gpt-4o",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Chat error:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error && error.message.includes('API key')) {
      return res.status(401).json({
        error: "API key invalid",
        fallbackMessage: "Il servizio AI necessita di configurazione. Contatta il supporto tecnico."
      });
    }

    if (error instanceof Error && error.message.includes('quota')) {
      return res.status(429).json({
        error: "API quota exceeded", 
        fallbackMessage: "Il servizio AI ha raggiunto il limite di utilizzo. Riprova più tardi o contatta il supporto."
      });
    }

    res.status(500).json({
      error: "Internal server error",
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Il nostro team è stato avvisato. Puoi contattarci via email per assistenza immediata."
    });
  }
});

// AI Recommendations endpoint
router.post("/recommendations", async (req, res) => {
  console.log('[AI] Recommendations endpoint called with:', { input: req.body?.input, hasContext: !!req.body?.context });
  try {
    const { input, context } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        error: "Input is required and must be a string" 
      });
    }

    // Check if OpenAI is available
    if (!openai) {
      return res.status(503).json({
        error: "AI service temporarily unavailable",
        fallbackMessage: "Mi dispiace, il servizio di raccomandazioni AI non è al momento disponibile."
      });
    }

    // Create system prompt for boat recommendations
    const systemPrompt = `Sei l'assistente AI di SeaBoo specializzato in raccomandazioni di barche.
    
    Analizza la richiesta dell'utente e fornisci raccomandazioni specifiche per barche disponibili nel Lazio.
    
    Considera:
    - Budget e tipo di barca richiesta
    - Destinazione e porto di partenza
    - Numero di persone
    - Durata del noleggio
    - Preferenze speciali (lusso, sport acquatici, pesca, ecc.)
    
    Rispondi sempre in italiano con raccomandazioni concrete e motivate.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: `Richiesta: ${input}\nContesto: ${JSON.stringify(context || {})}`
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return res.status(500).json({
        error: "No response from AI service",
        fallbackMessage: "Mi dispiace, non sono riuscito a elaborare la tua richiesta."
      });
    }

    res.json({ 
      recommendations: response,
      model: "gpt-4o",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Recommendations error:", error);
    
    if (error instanceof Error && error.message.includes('quota')) {
      return res.status(429).json({
        error: "API quota exceeded", 
        fallbackMessage: "Il servizio AI ha raggiunto il limite di utilizzo. Riprova più tardi."
      });
    }

    res.status(500).json({
      error: "Internal server error",
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Riprova più tardi."
    });
  }
});

// AI Pricing Analysis endpoint
router.post("/pricing", async (req, res) => {
  console.log('[AI] Pricing endpoint called with:', { input: req.body?.input, hasContext: !!req.body?.context });
  try {
    const { input, context } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        error: "Input is required and must be a string" 
      });
    }

    if (!openai) {
      return res.status(503).json({
        error: "AI service temporarily unavailable",
        fallbackMessage: "Mi dispiace, il servizio di analisi prezzi non è al momento disponibile."
      });
    }

    const systemPrompt = `Sei l'assistente AI di SeaBoo specializzato nell'analisi dei prezzi di noleggio barche.
    
    Analizza se il prezzo richiesto è equo considerando:
    - Tipo di barca e caratteristiche
    - Stagionalità (alta stagione estiva vs bassa stagione)
    - Durata del noleggio
    - Servizi inclusi (skipper, carburante, assicurazione)
    - Località e porto di partenza
    
    Fornisci un'analisi dettagliata del prezzo e suggerimenti per il cliente.
    Rispondi sempre in italiano.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Richiesta: ${input}\nContesto: ${JSON.stringify(context || {})}` }
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return res.status(500).json({
        error: "No response from AI service",
        fallbackMessage: "Mi dispiace, non sono riuscito a elaborare la tua richiesta."
      });
    }

    res.json({ 
      pricing: response,
      model: "gpt-4o",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Pricing error:", error);
    
    if (error instanceof Error && error.message.includes('quota')) {
      return res.status(429).json({
        error: "API quota exceeded", 
        fallbackMessage: "Il servizio AI ha raggiunto il limite di utilizzo. Riprova più tardi."
      });
    }

    res.status(500).json({
      error: "Internal server error",
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Riprova più tardi."
    });
  }
});

// AI Weather Advice endpoint
router.post("/weather", async (req, res) => {
  console.log('[AI] Weather endpoint called with:', { input: req.body?.input, hasContext: !!req.body?.context });
  try {
    const { input, context } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        error: "Input is required and must be a string" 
      });
    }

    if (!openai) {
      return res.status(503).json({
        error: "AI service temporarily unavailable",
        fallbackMessage: "Mi dispiace, il servizio meteo non è al momento disponibile."
      });
    }

    const systemPrompt = `Sei l'assistente AI di SeaBoo specializzato in consigli meteorologici per la navigazione.
    
    Fornisci consigli basati su:
    - Condizioni meteo marine previste
    - Sicurezza della navigazione
    - Migliori periodi per navigare
    - Precauzioni da prendere
    - Destinazioni consigliate in base al meteo
    
    Dai sempre priorità alla sicurezza dei naviganti.
    Rispondi sempre in italiano in modo chiaro e professionale.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Richiesta: ${input}\nContesto: ${JSON.stringify(context || {})}` }
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return res.status(500).json({
        error: "No response from AI service",
        fallbackMessage: "Mi dispiace, non sono riuscito a elaborare la tua richiesta."
      });
    }

    res.json({ 
      weather: response,
      model: "gpt-4o",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Weather error:", error);
    
    if (error instanceof Error && error.message.includes('quota')) {
      return res.status(429).json({
        error: "API quota exceeded", 
        fallbackMessage: "Il servizio AI ha raggiunto il limite di utilizzo. Riprova più tardi."
      });
    }

    res.status(500).json({
      error: "Internal server error",
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Riprova più tardi."
    });
  }
});

// AI Itinerary Planning endpoint
router.post("/itinerary", async (req, res) => {
  console.log('[AI] Itinerary endpoint called with:', { input: req.body?.input, hasContext: !!req.body?.context });
  try {
    const { input, context } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ 
        error: "Input is required and must be a string" 
      });
    }

    if (!openai) {
      return res.status(503).json({
        error: "AI service temporarily unavailable",
        fallbackMessage: "Mi dispiace, il servizio di pianificazione itinerari non è al momento disponibile."
      });
    }

    const systemPrompt = `Sei l'assistente AI di SeaBoo specializzato nella pianificazione di itinerari nautici nel Lazio e Campania.
    
    Crea itinerari dettagliati considerando:
    - Porti e località di partenza/arrivo
    - Distanze nautiche e tempi di navigazione
    - Punti di interesse lungo il percorso
    - Baie e ancoraggi consigliati
    - Ristoranti e servizi disponibili
    - Condizioni meteo e mare previste
    - Livello di esperienza dei naviganti
    
    Fornisci itinerari pratici e dettagliati con tappe, orari e consigli utili.
    Rispondi sempre in italiano.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Richiesta: ${input}\nContesto: ${JSON.stringify(context || {})}` }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return res.status(500).json({
        error: "No response from AI service",
        fallbackMessage: "Mi dispiace, non sono riuscito a elaborare la tua richiesta."
      });
    }

    res.json({ 
      itinerary: response,
      model: "gpt-4o",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Itinerary error:", error);
    
    if (error instanceof Error && error.message.includes('quota')) {
      return res.status(429).json({
        error: "API quota exceeded", 
        fallbackMessage: "Il servizio AI ha raggiunto il limite di utilizzo. Riprova più tardi."
      });
    }

    res.status(500).json({
      error: "Internal server error",
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Riprova più tardi."
    });
  }
});

// Health check endpoint for AI service
router.get("/status", (req, res) => {
  res.json({
    aiServiceAvailable: !!openai,
    hasApiKey: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

export default router;