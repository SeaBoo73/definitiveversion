import type { Express } from "express";
import { storage } from "../storage";
import { insertEmergencySchema } from "@shared/schema";

export function registerEmergencyRoutes(app: Express) {
  // Create emergency report
  app.post("/api/emergencies", async (req, res) => {
    try {
      const validatedData = insertEmergencySchema.parse(req.body);
      const emergency = await storage.createEmergency(validatedData);
      
      // Create notification for emergency
      await storage.createNotification({
        userId: req.body.reportedBy,
        type: "emergency",
        title: "Emergenza Segnalata",
        message: `Emergenza ${req.body.type} segnalata con severità ${req.body.severity}`,
        data: JSON.stringify({ emergencyId: emergency.id })
      });

      res.status(201).json(emergency);
    } catch (error) {
      console.error("Error creating emergency:", error);
      res.status(400).json({ error: "Invalid emergency data" });
    }
  });

  // Get emergencies
  app.get("/api/emergencies", async (req, res) => {
    try {
      const bookingId = req.query.bookingId ? parseInt(req.query.bookingId as string) : undefined;
      const emergencies = await storage.getEmergencies(bookingId);
      res.json(emergencies);
    } catch (error) {
      console.error("Error fetching emergencies:", error);
      res.status(500).json({ error: "Failed to fetch emergencies" });
    }
  });

  // Update emergency status
  app.patch("/api/emergencies/:id/status", async (req, res) => {
    try {
      const emergencyId = parseInt(req.params.id);
      const { status, resolution } = req.body;
      
      const emergency = await storage.updateEmergencyStatus(emergencyId, status, resolution);
      
      // Notify reporter of status change
      await storage.createNotification({
        userId: emergency.reportedBy,
        type: "emergency",
        title: "Aggiornamento Emergenza",
        message: `La tua emergenza è stata aggiornata: ${status}`,
        data: JSON.stringify({ emergencyId, status, resolution })
      });

      res.json(emergency);
    } catch (error) {
      console.error("Error updating emergency status:", error);
      res.status(500).json({ error: "Failed to update emergency status" });
    }
  });

  // Get emergency statistics
  app.get("/api/emergencies/stats", async (req, res) => {
    try {
      const emergencies = await storage.getEmergencies();
      
      const stats = {
        total: emergencies.length,
        byType: emergencies.reduce((acc, emergency) => {
          acc[emergency.type] = (acc[emergency.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bySeverity: emergencies.reduce((acc, emergency) => {
          acc[emergency.severity] = (acc[emergency.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: emergencies.reduce((acc, emergency) => {
          acc[emergency.status || 'open'] = (acc[emergency.status || 'open'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching emergency stats:", error);
      res.status(500).json({ error: "Failed to fetch emergency statistics" });
    }
  });

  // Emergency hotline (immediate response)
  app.post("/api/emergencies/hotline", async (req, res) => {
    try {
      const { bookingId, reportedBy, type, description, location } = req.body;
      
      // Create high-priority emergency
      const emergency = await storage.createEmergency({
        bookingId,
        reportedBy,
        type,
        severity: "critical",
        description,
        location
      });

      // Immediate notifications to admin and coast guard
      await storage.createNotification({
        userId: 1, // Admin user
        type: "emergency",
        title: "🆘 EMERGENZA CRITICA",
        message: `Emergenza ${type} segnalata tramite hotline: ${description}`,
        data: JSON.stringify({ 
          emergencyId: emergency.id, 
          hotline: true,
          location,
          priority: "CRITICAL"
        })
      });

      res.status(201).json({
        emergency,
        message: "Emergenza segnalata con successo. I soccorsi sono stati allertati.",
        hotlineNumber: "1530" // Guardia Costiera
      });
    } catch (error) {
      console.error("Error creating hotline emergency:", error);
      res.status(500).json({ error: "Failed to create emergency report" });
    }
  });
}