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

// Native app preview route - Only accessible via /app-preview
app.get("/app-preview", (req, res) => {
  res.sendFile(path.resolve("mobile-preview.html"));
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
    log(`📱 App preview: http://localhost:${port}/app-preview`);
    log(`🌐 Web app: http://localhost:${port}`);
  });
})();