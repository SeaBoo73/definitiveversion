import OpenAI from "openai";
import { Boat } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export class AIService {
  async getBoatRecommendations(
    userId: number, 
    context: any, 
    boats: Boat[]
  ): Promise<{ explanation: string; recommendations: Boat[] }> {
    try {
      const prompt = `
        Sei un esperto consulente nautico italiano. Basandoti sulle seguenti barche disponibili e le preferenze dell'utente, 
        fornisci raccomandazioni personalizzate e dettagliate in italiano.

        Barche disponibili: ${JSON.stringify(boats.slice(0, 10))}
        
        Preferenze utente: ${JSON.stringify(context)}
        
        Fornisci:
        1. 3-5 raccomandazioni specifiche con motivazioni
        2. Confronti tra le opzioni
        3. Consigli pratici per la navigazione
        4. Suggerimenti su periodo migliore e itinerario
        
        Rispondi in formato JSON con questa struttura:
        {
          "explanation": "Testo dettagliato con raccomandazioni",
          "recommendedBoats": [array di ID barche consigliate]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        explanation: result.explanation || "Raccomandazioni personalizzate basate sulle tue preferenze.",
        recommendations: boats.filter(b => result.recommendedBoats?.includes(b.id)) || boats.slice(0, 3)
      };
    } catch (error) {
      console.error("AI recommendations error:", error);
      return {
        explanation: "Al momento non riesco a fornire raccomandazioni personalizzate. Ti suggerisco di contattare il nostro team per assistenza.",
        recommendations: boats.slice(0, 3)
      };
    }
  }

  async analyzePricing(boat: Boat, similarBoats: Boat[]): Promise<string> {
    try {
      const prompt = `
        Sei un esperto di mercato nautico italiano. Analizza il prezzo di questa barca confrontandola con barche simili.

        Barca da analizzare: ${JSON.stringify(boat)}
        Barche simili per confronto: ${JSON.stringify(similarBoats)}

        Fornisci un'analisi dettagliata del prezzo includendo:
        1. Se il prezzo è competitivo, alto o basso
        2. Fattori che giustificano il prezzo
        3. Confronto con il mercato
        4. Suggerimenti per il cliente
        
        Rispondi in italiano in formato conversazionale e professionale.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800
      });

      return response.choices[0].message.content || "Analisi del prezzo non disponibile al momento.";
    } catch (error) {
      console.error("AI pricing error:", error);
      return "L'analisi dei prezzi non è al momento disponibile. Ti consigliamo di confrontare manualmente con barche simili nella zona.";
    }
  }

  async getWeatherAdvice(location: string, dates: { start: string; end: string }): Promise<string> {
    try {
      const prompt = `
        Sei un esperto meteo marino per la navigazione in Italia. 
        
        Località: ${location}
        Periodo: dal ${dates.start} al ${dates.end}
        
        Fornisci consigli meteo per la navigazione includendo:
        1. Condizioni meteorologiche previste
        2. Stato del mare e venti
        3. Giorni migliori per navigare
        4. Precauzioni da prendere
        5. Consigli su orari di navigazione
        
        Rispondi in italiano con un tono professionale ma accessibile.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800
      });

      return response.choices[0].message.content || "Informazioni meteo non disponibili al momento.";
    } catch (error) {
      console.error("AI weather error:", error);
      return "Le previsioni meteo non sono disponibili al momento. Ti consigliamo di consultare i servizi meteo locali prima della partenza.";
    }
  }

  async planItinerary(
    startLocation: string, 
    preferences: { duration: number; interests: string[]; boatType: string }
  ): Promise<string> {
    try {
      const prompt = `
        Sei un esperto di itinerari nautici italiani. Crea un itinerario dettagliato per una vacanza in barca.

        Punto di partenza: ${startLocation}
        Durata: ${preferences.duration} giorni
        Interessi: ${preferences.interests.join(", ")}
        Tipo di barca: ${preferences.boatType}

        Crea un itinerario giorno per giorno includendo:
        1. Rotte giornaliere con distanze nautiche
        2. Porti e ancoraggi consigliati
        3. Attrazioni e attività in ogni tappa
        4. Ristoranti e servizi locali
        5. Consigli pratici per ogni giorno
        
        Rispondi in italiano con un formato chiaro e dettagliato.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200
      });

      return response.choices[0].message.content || "Itinerario non disponibile al momento.";
    } catch (error) {
      console.error("AI itinerary error:", error);
      return "La pianificazione dell'itinerario non è disponibile al momento. Ti consigliamo di consultare guide nautiche locali per creare il tuo percorso.";
    }
  }
}

export const aiService = new AIService();