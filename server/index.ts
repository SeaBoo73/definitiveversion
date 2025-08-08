import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from attached_assets
app.use('/attached_assets', express.static('attached_assets'));
app.use('/api/images', express.static('attached_assets'));

// Mobile web preview route
app.get("/app-preview", (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.sendFile(path.resolve("mobile-preview.html"));
});

// Native app preview route
app.get("/native-preview", (req, res) => {
  res.sendFile(path.resolve("native-app-preview.html"));
});

(async () => {
  const server = await registerRoutes(app);
  
  // Enable Vite setup for development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use dynamic port allocation
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
    log(`📱 Mobile preview: http://localhost:${port}/app-preview`);
    log(`📱 Native preview: http://localhost:${port}/native-preview`);
    log(`🌐 Web app: http://localhost:${port}`);
  });
})();