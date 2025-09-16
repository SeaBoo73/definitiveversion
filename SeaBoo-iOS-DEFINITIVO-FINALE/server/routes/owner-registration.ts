import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";

// Simplified schema for basic registration - additional fields are optional
const becomeOwnerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(), 
  email: z.string().email(),
  phone: z.string(),
  acceptTerms: z.boolean(),
  // Optional fields for backward compatibility
  city: z.string().optional(),
  boatExperience: z.string().optional(),
  acceptCommission: z.boolean().optional(),
});

export function registerOwnerRoutes(app: Express) {
  // Become owner request
  app.post("/api/become-owner", async (req, res) => {
    try {
      const data = becomeOwnerSchema.parse(req.body);
      
      // For now, skip user lookup and create directly due to DB schema issues
      // Later we'll fix the database schema properly
      try {
        // Create new owner user with minimal fields to avoid schema conflicts
        const newUser = await storage.createUser({
          username: data.firstName + " " + data.lastName,
          email: data.email,
          password: "temp_password_" + Math.random().toString(36),
          role: "owner",
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          verified: false
        });
        
        res.json({ 
          message: "Registrazione completata! Ti contatteremo per finalizzare l'account.",
          userId: newUser.id 
        });
      } catch (createError) {
        // If user already exists, return appropriate message
        if (createError.message?.includes('duplicate') || createError.message?.includes('unique')) {
          res.status(400).json({ 
            message: "Un utente con questa email esiste già. Prova con un'altra email." 
          });
        } else {
          throw createError;
        }
      }
      
    } catch (error) {
      console.error("Owner registration error:", error);
      res.status(400).json({ 
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}