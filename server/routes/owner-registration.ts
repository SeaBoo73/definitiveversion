import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";

const becomeOwnerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(), 
  email: z.string().email(),
  phone: z.string(),
  city: z.string(),
  boatExperience: z.string(),
  acceptTerms: z.boolean(),
  acceptCommission: z.boolean(),
});

export function registerOwnerRoutes(app: Express) {
  // Become owner request
  app.post("/api/become-owner", async (req, res) => {
    try {
      const data = becomeOwnerSchema.parse(req.body);
      
      // Check if user exists with this email
      const existingUser = await storage.getUserByEmail(data.email);
      
      if (existingUser) {
        // If customer exists, update to owner
        if (existingUser.role === "customer") {
          await storage.updateUser(existingUser.id, { role: "owner" });
          res.json({ 
            message: "Successfully upgraded to owner role",
            userId: existingUser.id 
          });
        } else if (existingUser.role === "owner") {
          res.status(400).json({ 
            message: "User is already an owner" 
          });
        } else {
          res.status(400).json({ 
            message: "Cannot upgrade admin users" 
          });
        }
      } else {
        // Create new owner user
        const newUser = await storage.createUser({
          username: data.firstName + " " + data.lastName,
          email: data.email,
          password: "temp_password_" + Math.random().toString(36),
          role: "owner"
        });
        
        res.json({ 
          message: "Owner registration successful",
          userId: newUser.id 
        });
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