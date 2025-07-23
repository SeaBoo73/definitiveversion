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
        fallbackMessage: "Mi dispiace, il servizio di assistenza AI non è al momento disponibile. Puoi contattarci tramite WhatsApp o email per ricevere supporto immediato."
      });
    }

    // Create system prompt for SeaGO maritime assistant
    const systemPrompt = `Sei l'assistente AI di SeaGO, una piattaforma italiana per il noleggio di barche nel Lazio. 
    
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
      fallbackMessage: "Mi dispiace, c'è stato un errore tecnico. Il nostro team è stato avvisato. Puoi contattarci direttamente per assistenza immediata."
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