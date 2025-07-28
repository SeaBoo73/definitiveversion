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
        .category-card:hover, .boat-card:hover, .nav-item:hover { cursor: pointer; transform: translateY(-2px); transition: all 0.2s ease; }
        .category-card:active, .boat-card:active { transform: scale(0.98); }
        .screen { display: none; }
        .screen.active { display: block; }
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
            <div id="esplora" class="screen active">
                <div class="search-bar">
                    <input type="text" class="search-input" placeholder="🔍 Dove vuoi navigare?" onclick="showAlert('Funzione di ricerca')">
                </div>
                <div class="section-title">Categorie Barche</div>
                <div class="categories-grid">
                    <div class="category-card" onclick="showAlert('Categoria Gommoni selezionata')">
                        <div class="category-icon">🚤</div>
                        <div class="category-name">Gommoni</div>
                        <div class="category-count">200+ barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Categoria Senza Patente selezionata')">
                        <div class="category-icon">🛥️</div>
                        <div class="category-name">Senza Patente</div>
                        <div class="category-count">150+ barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Categoria Yacht selezionata')">
                        <div class="category-icon">🛳️</div>
                        <div class="category-name">Yacht</div>
                        <div class="category-count">85+ barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Categoria Barche a Vela selezionata')">
                        <div class="category-icon">⛵</div>
                        <div class="category-name">Barche a Vela</div>
                        <div class="category-count">60+ barche</div>
                    </div>
                </div>
                <div class="section-title">Barche in Evidenza</div>
                <div class="boat-card" onclick="showAlert('Gommone Azzurra 680 - Visualizza dettagli')">
                    <div class="boat-image">🚤 Azzurra 680</div>
                    <div class="boat-title">Gommone Azzurra 680 - Civitavecchia</div>
                    <div class="boat-price">€350/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Yacht di Lusso - Visualizza dettagli')">
                    <div class="boat-image">🛥️ Luxury Charter</div>
                    <div class="boat-title">Yacht di Lusso - Gaeta</div>
                    <div class="boat-price">€1.200/giorno</div>
                </div>
            </div>
            
            <div id="ormeggio" class="screen">
                <div class="section-title">Servizi Ormeggio</div>
                <div class="boat-card" onclick="showAlert('Porto di Civitavecchia - Prenota ormeggio')">
                    <div class="boat-image">⚓ Porto Civitavecchia</div>
                    <div class="boat-title">Porto di Civitavecchia - Pontile A</div>
                    <div class="boat-price">€45/metro/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Marina di Gaeta - Prenota ormeggio')">
                    <div class="boat-image">⚓ Marina Gaeta</div>
                    <div class="boat-title">Marina di Gaeta - Servizi Premium</div>
                    <div class="boat-price">€38/metro/giorno</div>
                </div>
            </div>
            
            <div id="esperienze" class="screen">
                <div class="section-title">Esperienze Marine</div>
                <div class="boat-card" onclick="showAlert('Tour Costiera Amalfitana - Prenota esperienza')">
                    <div class="boat-image">✨ Tour Amalfi</div>
                    <div class="boat-title">Tour Costiera Amalfitana</div>
                    <div class="boat-price">€120/persona</div>
                </div>
                <div class="boat-card" onclick="showAlert('Aperitivo al Tramonto - Prenota esperienza')">
                    <div class="boat-image">🍾 Aperitivo</div>
                    <div class="boat-title">Aperitivo al Tramonto - Ponza</div>
                    <div class="boat-price">€85/persona</div>
                </div>
            </div>
            
            <div id="servizi" class="screen">
                <div class="section-title">Servizi Esterni</div>
                <div class="boat-card" onclick="showAlert('Meteo Marino - Visualizza condizioni')">
                    <div class="boat-image">🌊 Meteo</div>
                    <div class="boat-title">Condizioni Meteo Marine</div>
                    <div class="boat-price">Vento: 15 nodi</div>
                </div>
                <div class="boat-card" onclick="showAlert('Carburante - Trova distributori')">
                    <div class="boat-image">⛽ Carburante</div>
                    <div class="boat-title">Distributori Carburante</div>
                    <div class="boat-price">€1.45/litro</div>
                </div>
            </div>
            
            <div id="profilo" class="screen">
                <div class="section-title">Il Mio Profilo</div>
                <div class="boat-card" onclick="showAlert('Accedi al tuo account')">
                    <div class="boat-image">👤 Account</div>
                    <div class="boat-title">Accedi o Registrati</div>
                    <div class="boat-price">Gestisci account</div>
                </div>
                <div class="boat-card" onclick="showAlert('Le mie prenotazioni')">
                    <div class="boat-image">📋 Prenotazioni</div>
                    <div class="boat-title">Le Mie Prenotazioni</div>
                    <div class="boat-price">3 prenotazioni attive</div>
                </div>
            </div>
        </div>
        <div class="bottom-nav">
            <div class="nav-item active" onclick="showScreen('esplora', this)">
                <div class="nav-icon">🔍</div>
                <span>Esplora</span>
            </div>
            <div class="nav-item" onclick="showScreen('ormeggio', this)">
                <div class="nav-icon">⚓</div>
                <span>Ormeggio</span>
            </div>
            <div class="nav-item" onclick="showScreen('esperienze', this)">
                <div class="nav-icon">✨</div>
                <span>Esperienze</span>
            </div>
            <div class="nav-item" onclick="showScreen('servizi', this)">
                <div class="nav-icon">🛠️</div>
                <span>Servizi</span>
            </div>
            <div class="nav-item" onclick="showScreen('profilo', this)">
                <div class="nav-icon">👤</div>
                <span>Profilo</span>
            </div>
        </div>
    </div>
    
    <script>
        function showScreen(screenId, navItem) {
            // Nascondi tutte le schermate
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => screen.classList.remove('active'));
            
            // Rimuovi classe active da tutti i nav items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            
            // Mostra schermata selezionata
            document.getElementById(screenId).classList.add('active');
            navItem.classList.add('active');
            
            // Aggiorna titolo header
            const titles = {
                'esplora': '🚤 SeaGO - Esplora',
                'ormeggio': '⚓ SeaGO - Ormeggio', 
                'esperienze': '✨ SeaGO - Esperienze',
                'servizi': '🛠️ SeaGO - Servizi',
                'profilo': '👤 SeaGO - Profilo'
            };
            document.querySelector('.header').textContent = titles[screenId] || '🚤 SeaGO - Anteprima App Mobile';
        }
        
        function showAlert(message) {
            alert('📱 Anteprima Mobile: ' + message + '\\n\\nNell\\'app reale questa funzione aprirà la schermata corrispondente.');
        }
    </script>
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
