import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from attached_assets
app.use('/attached_assets', express.static('attached_assets'));

// Mobile preview route (before authentication middleware)
app.get("/mobile-preview", (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeaGO Mobile - Anteprima App</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; height: 100vh; overflow: hidden; }
        .mobile-frame { max-width: 375px; height: 100vh; margin: 0 auto; background: white; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: #0ea5e9; color: white; padding: 20px 16px 16px; text-align: center; font-weight: bold; font-size: 18px; }
        .content { flex: 1; overflow-y: auto; padding: 16px; height: calc(100vh - 140px); }
        .search-bar { background: white; border-radius: 12px; padding: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .search-input { width: 100%; border: none; outline: none; font-size: 16px; color: #374151; }
        .categories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .category-card { background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .category-icon { width: 48px; height: 48px; background: #0ea5e9; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
        .category-name { font-weight: 600; color: #374151; margin-bottom: 4px; }
        .category-count { color: #6b7280; font-size: 14px; }
        .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 16px; }
        .boat-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .boat-image { width: 100%; height: 160px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
        .boat-title { font-weight: 600; color: #374151; margin-bottom: 4px; }
        .boat-price { color: #0ea5e9; font-weight: bold; font-size: 18px; }
        .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 375px; background: white; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-around; padding: 12px 0; }
        .nav-item { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #6b7280; font-size: 12px; transition: color 0.2s; }
        .nav-item.active { color: #0ea5e9; }
        .nav-icon { width: 24px; height: 24px; margin-bottom: 4px; font-size: 20px; }
        .info-banner { background: #e0f2fe; border: 1px solid #0ea5e9; border-radius: 8px; padding: 12px; margin-bottom: 16px; text-align: center; }
        .info-text { color: #0369a1; font-size: 14px; font-weight: 500; }
        @media (max-width: 375px) { .mobile-frame { max-width: 100%; } }
    </style>
</head>
<body>
    <div class="mobile-frame">
        <div class="header">🚤 SeaGO - Anteprima App Mobile</div>
        <div class="content" id="content">
            <div class="info-banner">
                <div class="info-text">📱 Anteprima dell'App SeaGO Mobile per iOS e Android</div>
            </div>
            <div id="esplora" class="screen">
                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="🔍 Dove vuoi navigare?" disabled>
                </div>
                <div class="section-title">Categorie Barche</div>
                <div class="categories-grid">
                    <div class="category-card">
                        <div class="category-icon">🚤</div>
                        <div class="category-name">Gommoni</div>
                        <div class="category-count">200+ barche</div>
                    </div>
                    <div class="category-card">
                        <div class="category-icon">🛥️</div>
                        <div class="category-name">Senza Patente</div>
                        <div class="category-count">150+ barche</div>
                    </div>
                    <div class="category-card">
                        <div class="category-icon">🛳️</div>
                        <div class="category-name">Yacht</div>
                        <div class="category-count">85+ barche</div>
                    </div>
                    <div class="category-card">
                        <div class="category-icon">⛵</div>
                        <div class="category-name">Barche a Vela</div>
                        <div class="category-count">60+ barche</div>
                    </div>
                </div>
                <div class="section-title">Barche in Evidenza</div>
                <div class="boat-card">
                    <div class="boat-image">🚤 Azzurra 680</div>
                    <div class="boat-title">Gommone Azzurra 680 - Civitavecchia</div>
                    <div class="boat-price">€350/giorno</div>
                </div>
                <div class="boat-card">
                    <div class="boat-image">🛥️ Luxury Charter</div>
                    <div class="boat-title">Yacht di Lusso - Gaeta</div>
                    <div class="boat-price">€1.200/giorno</div>
                </div>
            </div>
        </div>
        <div class="bottom-nav">
            <div class="nav-item active">
                <div class="nav-icon">🔍</div>
                <span>Esplora</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon">⚓</div>
                <span>Ormeggio</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon">✨</div>
                <span>Esperienze</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon">🛠️</div>
                <span>Servizi</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon">👤</div>
                <span>Profilo</span>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
