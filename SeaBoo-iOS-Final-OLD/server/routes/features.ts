import type { Express } from "express";
import { storage } from "../storage";
import { insertBoatFeatureSchema, insertDynamicPricingSchema, insertAvailabilitySchema } from "@shared/schema";

export function registerFeatureRoutes(app: Express) {
  // Boat Features
  app.get("/api/boats/:boatId/features", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const features = await storage.getBoatFeatures(boatId);
      
      // Group features by category
      const groupedFeatures = features.reduce((acc, feature) => {
        if (!acc[feature.category]) {
          acc[feature.category] = [];
        }
        acc[feature.category].push(feature);
        return acc;
      }, {} as Record<string, any[]>);

      res.json(groupedFeatures);
    } catch (error) {
      console.error("Error fetching boat features:", error);
      res.status(500).json({ error: "Failed to fetch boat features" });
    }
  });

  app.post("/api/boats/:boatId/features", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const validatedData = insertBoatFeatureSchema.parse({
        ...req.body,
        boatId
      });
      
      const feature = await storage.createBoatFeature(validatedData);
      res.status(201).json(feature);
    } catch (error) {
      console.error("Error creating boat feature:", error);
      res.status(400).json({ error: "Invalid feature data" });
    }
  });

  // Dynamic Pricing
  app.get("/api/boats/:boatId/pricing", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      const pricing = await storage.getDynamicPricing(boatId, date);
      res.json(pricing);
    } catch (error) {
      console.error("Error fetching dynamic pricing:", error);
      res.status(500).json({ error: "Failed to fetch pricing" });
    }
  });

  app.post("/api/boats/:boatId/pricing", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const validatedData = insertDynamicPricingSchema.parse({
        ...req.body,
        boatId
      });
      
      const pricing = await storage.createDynamicPricing(validatedData);
      res.status(201).json(pricing);
    } catch (error) {
      console.error("Error creating dynamic pricing:", error);
      res.status(400).json({ error: "Invalid pricing data" });
    }
  });

  // Availability Calendar
  app.get("/api/boats/:boatId/availability", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      const availability = await storage.getAvailability(boatId, startDate, endDate);
      res.json(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.post("/api/boats/:boatId/availability", async (req, res) => {
    try {
      const boatId = parseInt(req.params.boatId);
      const validatedData = insertAvailabilitySchema.parse({
        ...req.body,
        boatId
      });
      
      const availability = await storage.setAvailability(validatedData);
      res.status(201).json(availability);
    } catch (error) {
      console.error("Error setting availability:", error);
      res.status(400).json({ error: "Invalid availability data" });
    }
  });

  // Weather Integration
  app.get("/api/weather", async (req, res) => {
    try {
      const location = req.query.location as string;
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      const weatherData = await storage.getWeatherData(location, date);
      
      if (!weatherData) {
        // In a real implementation, fetch from weather API
        return res.json({
          location,
          date,
          message: "Weather data not available",
          recommendation: "Check local weather services before departure"
        });
      }
      
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Advanced search with features
  app.post("/api/boats/search/advanced", async (req, res) => {
    try {
      const { 
        type, 
        location, 
        startDate, 
        endDate, 
        maxPersons, 
        features = [],
        priceRange,
        equipment = []
      } = req.body;

      // Basic boat search
      const boats = await storage.getBoats({
        type,
        location,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        maxPersons
      });

      // Filter by features if specified
      let filteredBoats = boats;
      if (features.length > 0) {
        const boatFeatures = await Promise.all(
          boats.map(async (boat) => ({
            boat,
            features: await storage.getBoatFeatures(boat.id)
          }))
        );

        filteredBoats = boatFeatures
          .filter(({ features: boatFeatureList }) =>
            features.every((requiredFeature: string) =>
              boatFeatureList.some(feature =>
                feature.feature.toLowerCase().includes(requiredFeature.toLowerCase()) &&
                feature.available
              )
            )
          )
          .map(({ boat }) => boat);
      }

      // Apply price range filter
      if (priceRange) {
        filteredBoats = filteredBoats.filter(boat => {
          const price = parseFloat(boat.pricePerDay);
          return price >= priceRange.min && price <= priceRange.max;
        });
      }

      res.json({
        boats: filteredBoats,
        total: filteredBoats.length,
        filters: {
          type,
          location,
          startDate,
          endDate,
          maxPersons,
          features,
          priceRange,
          equipment
        }
      });
    } catch (error) {
      console.error("Error in advanced search:", error);
      res.status(500).json({ error: "Failed to perform advanced search" });
    }
  });
}