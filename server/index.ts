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
  res.sendFile(path.resolve("mobile-preview.html"));
});

// Direct mobile preview route
app.get("/mobile-preview.html", (req, res) => {
  res.sendFile(path.resolve("mobile-preview.html"));
});

// Native app preview route
app.get("/native-preview", (req, res) => {
  res.sendFile(path.resolve("native-app-preview.html"));
});

// Archived mobile preview route (temporary)
app.get("/archived-preview", (req, res) => {
  res.sendFile(path.resolve("mobile-preview-ARCHIVED-20250810_061034.html"));
});

// Mobile project preview route (temporary)
app.get("/mobile-project-preview", (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeaBoo Mobile - React Native Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #f9fafb; }
        .mobile-frame { max-width: 375px; margin: 20px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .header { background: #0ea5e9; color: white; padding: 16px; text-align: center; font-weight: bold; font-size: 18px; }
        .content { min-height: 600px; background: #f8fafc; }
        .tab-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 343px; background: white; border-radius: 25px; display: flex; justify-content: space-around; padding: 12px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .tab-item { text-align: center; color: #6b7280; font-size: 12px; cursor: pointer; padding: 8px 12px; border-radius: 15px; transition: all 0.2s; }
        .tab-item.active { color: #0ea5e9; background: rgba(14, 165, 233, 0.1); }
        .tab-icon { font-size: 20px; margin-bottom: 4px; }
        .screen { padding: 20px; display: none; }
        .screen.active { display: block; }
        .welcome { text-align: center; padding: 40px 20px; }
        .welcome h1 { color: #1e293b; margin-bottom: 16px; font-size: 24px; }
        .welcome p { color: #64748b; margin-bottom: 32px; }
        .feature-grid { display: grid; gap: 16px; margin-top: 20px; }
        .feature-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .feature-card h3 { color: #0ea5e9; margin-bottom: 8px; }
        .feature-card p { color: #64748b; font-size: 14px; }
    </style>
</head>
<body>
    <div class="mobile-frame">
        <div class="header">SeaBoo</div>
        <div class="content">
            <div id="esplora" class="screen active">
                <div class="welcome">
                    <h1>🚤 Esplora</h1>
                    <p>Trova la tua barca ideale</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Ricerca Avanzata</h3>
                            <p>Trova barche per tipo, location e date</p>
                        </div>
                        <div class="feature-card">
                            <h3>Mappa Interattiva</h3>
                            <p>Visualizza barche sulla mappa</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="ormeggio" class="screen">
                <div class="welcome">
                    <h1>⚓ Ormeggio</h1>
                    <p>Trova il tuo posto barca</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Porti Disponibili</h3>
                            <p>48 porti in tutta Italia</p>
                        </div>
                        <div class="feature-card">
                            <h3>Prenotazione Facile</h3>
                            <p>Prenota il tuo ormeggio in pochi tap</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="esperienze" class="screen">
                <div class="welcome">
                    <h1>🌊 Esperienze</h1>
                    <p>Vivi il mare come mai prima</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Charter con Skipper</h3>
                            <p>Esperienze guidate professionali</p>
                        </div>
                        <div class="feature-card">
                            <h3>Tour Esclusivi</h3>
                            <p>Scopri luoghi nascosti</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="servizi" class="screen">
                <div class="welcome">
                    <h1>🛠️ Servizi</h1>
                    <p>Tutto per la tua navigazione</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Assistenza 24/7</h3>
                            <p>Supporto sempre disponibile</p>
                        </div>
                        <div class="feature-card">
                            <h3>Rifornimento</h3>
                            <p>Carburante e attrezzature</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="profilo" class="screen">
                <div class="welcome">
                    <h1>👤 Profilo</h1>
                    <p>Il tuo account SeaBoo</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Le Tue Prenotazioni</h3>
                            <p>Gestisci i tuoi noleggi</p>
                        </div>
                        <div class="feature-card">
                            <h3>Impostazioni</h3>
                            <p>Personalizza la tua esperienza</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-bar">
            <div class="tab-item active" onclick="showScreen('esplora', this)">
                <div class="tab-icon">🔍</div>
                <div>Esplora</div>
            </div>
            <div class="tab-item" onclick="showScreen('ormeggio', this)">
                <div class="tab-icon">⚓</div>
                <div>Ormeggio</div>
            </div>
            <div class="tab-item" onclick="showScreen('esperienze', this)">
                <div class="tab-icon">🌊</div>
                <div>Esperienze</div>
            </div>
            <div class="tab-item" onclick="showScreen('servizi', this)">
                <div class="tab-icon">🛠️</div>
                <div>Servizi</div>
            </div>
            <div class="tab-item" onclick="showScreen('profilo', this)">
                <div class="tab-icon">👤</div>
                <div>Profilo</div>
            </div>
        </div>
    </div>
    <script>
        function showScreen(screenId, tabElement) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
            tabElement.classList.add('active');
        }
        console.log('📱 SeaBoo Mobile App - React Native Navigation Preview');
    </script>
</body>
</html>`;
  res.send(html);
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