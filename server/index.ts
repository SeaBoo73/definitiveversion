import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from attached_assets
app.use('/attached_assets', express.static('attached_assets'));
app.use('/api/images', express.static('attached_assets'));

// Mobile preview route (before authentication middleware)
app.get("/mobile-preview", async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeaGO - Noleggio Barche Italia</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            background: #f9fafb; 
            color: #1f2937; 
            height: 100vh; 
            overflow: hidden; 
        }
        .mobile-frame { 
            max-width: 390px; 
            height: 100vh; 
            margin: 0 auto; 
            background: #f9fafb; 
            position: relative; 
        }
        .header { 
            background: white; 
            padding: 12px 16px; 
            border-bottom: 1px solid #e5e7eb; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); 
        }
        .header-title {
            font-size: 20px;
            font-weight: 700;
            color: #022237;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .logo {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            object-fit: cover;
        }
        .content { 
            flex: 1; 
            overflow-y: auto; 
            padding: 0; 
            height: calc(100vh - 140px); 
            background: #f9fafb;
        }
        .hero-section {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: white;
            padding: 32px 16px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .hero-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .hero-subtitle {
            font-size: 16px;
            opacity: 0.9;
            line-height: 1.4;
        }
        .search-section {
            background: white;
            padding: 20px 16px;
            border-bottom: 1px solid #e5e7eb;
        }
        .search-bar {
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 16px;
            background: transparent;
            color: #1f2937;
        }
        .search-icon {
            color: #6b7280;
            font-size: 20px;
        }
        .stats-section {
            background: white;
            padding: 20px 16px;
            border-bottom: 1px solid #e5e7eb;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
        .stat-card {
            text-align: center;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .stat-number {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 4px;
        }
        .stat-label {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }
        .section-container {
            background: white;
            margin: 16px 0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .section-title {
            font-size: 20px;
            font-weight: 700;
            padding: 20px 16px 16px;
            color: #1f2937;
            background: white;
            border-bottom: 1px solid #f1f5f9;
        }
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1px;
            background: #f1f5f9;
        }
        .category-card {
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            padding: 12px;
            text-align: center;
        }
        .category-image {
            width: 100%;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 8px;
        }
        .category-name {
            font-size: 12px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
            line-height: 1.2;
        }
        .category-desc {
            font-size: 10px;
            color: #64748b;
            margin-bottom: 4px;
        }
        .category-link {
            background: #1e40af;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 500;
            cursor: pointer;
        }
        .boats-section {
            padding: 16px;
        }
        .boat-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #f1f5f9;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .boat-image {
            width: 100%;
            height: 140px;
            object-fit: cover;
        }
        .boat-content {
            padding: 16px;
        }
        .boat-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1f2937;
        }
        .boat-details {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 12px;
            line-height: 1.5;
        }
        .boat-price {
            font-size: 18px;
            font-weight: 700;
            color: #059669;
        }
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            max-width: 390px;
            width: 100%;
            background: white;
            border-top: 1px solid #e5e7eb;
            padding: 8px 0;
            display: flex;
            justify-content: space-around;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            transition: color 0.2s ease;
            min-width: 60px;
            color: #6b7280;
        }
        .nav-item.active {
            color: #1e40af;
        }
        .nav-icon {
            font-size: 22px;
            margin-bottom: 4px;
        }
        .nav-label {
            font-size: 11px;
            font-weight: 600;
        }
        .screen { display: none; }
        .screen.active { display: block; }
        .download-banner {
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
            color: white;
            padding: 12px 16px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
        }
        .download-links {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin-top: 8px;
        }
        .download-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
        }
        .port-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #f1f5f9;
        }
        .port-image {
            width: 100%;
            height: 120px;
            object-fit: cover;
        }
        .port-content {
            padding: 16px;
        }
        .port-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1f2937;
        }
        .port-details {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 8px;
        }
        .port-price {
            font-size: 16px;
            font-weight: 700;
            color: #1e40af;
        }
        @media (max-width: 390px) { .mobile-frame { max-width: 100%; } }
    </style>
</head>
<body>
    <div class="mobile-frame">
        <div class="download-banner">
            👉 Scarica l'app SeaGO per un'esperienza migliore
            <div class="download-links">
                <button class="download-btn" onclick="showAlert('App Store - Download iOS')">App Store</button>
                <button class="download-btn" onclick="showAlert('Google Play - Download Android')">Google Play</button>
                <button class="download-btn" onclick="showAlert('Continua nel browser')">Continua nel browser</button>
            </div>
        </div>
        
        <div class="header">
            <div class="header-title">
                <img src="/api/images/Immagine WhatsApp 2025-07-23 ore 18.35.06_81ef1af0_1753289164694.jpg" alt="SeaGO Logo" class="logo">
                SeaGO
            </div>
        </div>
        
        <div class="content" id="content">
            <div id="esplora" class="screen active">
                <div class="hero-section">
                    <div class="hero-title">Naviga verso l'avventura</div>
                    <div class="hero-subtitle">Prenota barche, yacht e imbarcazioni uniche in tutta Italia.<br>Vivi il mare come mai prima d'ora.</div>
                </div>
                
                <div class="search-section">
                    <div class="search-bar">
                        <span class="search-icon">🔍</span>
                        <input type="text" class="search-input" placeholder="Seleziona porto..." onclick="showAlert('Selezione porto - Apre menu località')">
                    </div>
                    <div class="search-bar">
                        <span class="search-icon">📅</span>
                        <input type="text" class="search-input" placeholder="Dal - Al" onclick="showAlert('Calendario date - Seleziona periodo')">
                    </div>
                    <div class="search-bar">
                        <span class="search-icon">👥</span>
                        <input type="text" class="search-input" placeholder="2 ospiti" onclick="showAlert('Numero ospiti - Seleziona persone')">
                    </div>
                    <div class="search-bar">
                        <span class="search-icon">⛵</span>
                        <input type="text" class="search-input" placeholder="Con Skipper" onclick="showAlert('Tipo imbarcazione - Charter/Esperienze')">
                    </div>
                    <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 16px; width: 100%; font-size: 16px; font-weight: 600; margin-top: 8px;" onclick="showAlert('Cerca barche - Avvia ricerca')">Cerca</button>
                </div>
                
                <div class="stats-section">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">500+</div>
                            <div class="stat-label">Barche disponibili</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">2.5K</div>
                            <div class="stat-label">Utenti attivi</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">4.8/5</div>
                            <div class="stat-label">Valutazione media</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">1.2K</div>
                            <div class="stat-label">Prenotazioni</div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">Esplora per categoria</div>
                    <div class="categories-grid">
                        <div class="category-card" onclick="showAlert('Gommoni - Imbarcazioni pneumatiche versatili')">
                            <img src="/api/images/gommone senza patente_1752875806367.webp" class="category-image" alt="Gommoni">
                            <div class="category-name">Gommoni</div>
                            <div class="category-desc">Imbarcazioni pneumatiche versatili e sicure</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Barche senza patente - Facili da guidare')">
                            <img src="/api/images/OIP (1)_1752921317486.webp" class="category-image" alt="Senza patente">
                            <div class="category-name">Barche senza patente</div>
                            <div class="category-desc">Facili da guidare, perfette per principianti</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Yacht - Lusso e comfort esclusivo')">
                            <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Yacht">
                            <div class="category-name">Yacht</div>
                            <div class="category-desc">Lusso e comfort per una navigazione esclusiva</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Barche a vela - Esperienza autentica')">
                            <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="category-image" alt="Barche a vela">
                            <div class="category-name">Barche a vela</div>
                            <div class="category-desc">L'esperienza autentica della navigazione</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Moto d\'acqua - Adrenalina e velocità')">
                            <img src="/api/images/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg" class="category-image" alt="Moto d'acqua">
                            <div class="category-name">Moto d'acqua</div>
                            <div class="category-desc">Adrenalina e velocità sull'acqua</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Catamarani - Spazio e stabilità per gruppi')">
                            <img src="/api/images/catamarano ludovica_1752876117442.jpg" class="category-image" alt="Catamarani">
                            <div class="category-name">Catamarani</div>
                            <div class="category-desc">Spazio e stabilità per gruppi numerosi</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Charter - Esperienza completa con skipper')">
                            <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="category-image" alt="Charter">
                            <div class="category-name">Charter</div>
                            <div class="category-desc">Esperienza completa con skipper professionista</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Houseboat - Casa galleggiante per vacanze uniche')">
                            <img src="/api/images/OIP_1752919948843.webp" class="category-image" alt="Houseboat">
                            <div class="category-name">Houseboat</div>
                            <div class="category-desc">La tua casa galleggiante per vacanze uniche</div>
                            <button class="category-link">Esplora</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Barche a motore - Velocità e comfort')">
                            <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Barche a motore">
                            <div class="category-name">Barche a motore</div>
                            <div class="category-desc">Velocità e comfort per esplorare la costa</div>
                            <button class="category-link">Esplora</button>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">⚓ Trova il tuo ormeggio ideale</div>
                    <div style="padding: 16px;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;" onclick="showAlert('Pontili attrezzati - Servizi completi con acqua ed elettricità')">
                                <div style="font-size: 24px; margin-bottom: 8px;">⚓</div>
                                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Pontili attrezzati</div>
                                <div style="font-size: 12px; color: #64748b;">Servizi completi con acqua, elettricità e assistenza</div>
                                <button style="background: #1e40af; color: white; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; margin-top: 8px;">Esplora pontili</button>
                            </div>
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;" onclick="showAlert('Boe di ormeggio - Soluzioni economiche per soste brevi')">
                                <div style="font-size: 24px; margin-bottom: 8px;">🛟</div>
                                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Boe di ormeggio</div>
                                <div style="font-size: 12px; color: #64748b;">Soluzioni economiche per soste brevi</div>
                                <button style="background: #1e40af; color: white; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; margin-top: 8px;">Trova boe</button>
                            </div>
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;" onclick="showAlert('Ormeggi sicuri - Videosorveglianza e assistenza 24/7')">
                                <div style="font-size: 24px; margin-bottom: 8px;">🔐</div>
                                <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">Ormeggi sicuri</div>
                                <div style="font-size: 12px; color: #64748b;">Videosorveglianza e assistenza 24/7</div>
                                <button style="background: #1e40af; color: white; border: none; border-radius: 6px; padding: 4px 8px; font-size: 10px; margin-top: 8px;">Sicurezza H24</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">🌊 Condizioni Meteo e Servizi</div>
                    <div style="padding: 16px;">
                        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div>
                                    <div style="font-weight: 600; color: #0369a1;">Roma/Fiumicino</div>
                                    <div style="font-size: 12px; color: #64748b;">Condizioni Marine</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 24px; font-weight: 700; color: #0369a1;">27°C</div>
                                    <div style="font-size: 12px; color: #64748b;">Nuvoloso</div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #0369a1;">26 kn</div>
                                    <div style="font-size: 10px; color: #64748b;">SSW</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #0369a1;">0.86 m</div>
                                    <div style="font-size: 10px; color: #64748b;">Leggero</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #0369a1;">72 km</div>
                                    <div style="font-size: 10px; color: #64748b;">Visibilità</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 12px; font-weight: 600; color: #f59e0b;">Attenzione</div>
                                    <div style="font-size: 10px; color: #64748b;">richiesta</div>
                                </div>
                            </div>
                            
                            <button style="background: #0ea5e9; color: white; border: none; border-radius: 8px; padding: 8px 16px; width: 100%; font-size: 14px;" onclick="showAlert('Dettagli meteo completi - Previsioni 48h')">Dettagli completi</button>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">🚤 Affitta la tua barca</div>
                    <div style="padding: 16px;">
                        <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 20px; border-radius: 16px; text-align: center; margin-bottom: 16px;">
                            <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Guadagna mettendo a disposizione la tua imbarcazione</div>
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 16px;">Gestisci tutto facilmente dalla tua dashboard personale.</div>
                            
                            <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                                <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Registrazione rapida</div>
                                <div style="font-size: 14px; margin-bottom: 12px;">Compila i dati per iniziare subito</div>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                                    <input type="text" placeholder="Nome" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px; color: white; font-size: 14px;">
                                    <input type="text" placeholder="Cognome" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px; color: white; font-size: 14px;">
                                </div>
                                <input type="email" placeholder="Email" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 8px; width: 100%; color: white; font-size: 14px; margin-bottom: 12px;">
                                
                                <button style="background: white; color: #1e40af; border: none; border-radius: 8px; padding: 12px; width: 100%; font-size: 14px; font-weight: 600;" onclick="showAlert('Continua registrazione - Dati precompilati')">Continua con questi dati</button>
                            </div>
                            
                            <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px;">
                                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Registrazione immediata</div>
                                <div style="font-size: 14px; margin-bottom: 12px;">Clicca qui per procedere direttamente alla registrazione senza compilare i dati.</div>
                                <button style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 12px; width: 100%; font-size: 14px; font-weight: 600;" onclick="showAlert('Diventa noleggiatore - Registrazione diretta')">Diventa noleggiatore</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="ormeggio" class="screen">
                <div class="hero-section">
                    <div class="hero-title">⚓ Servizi Ormeggio</div>
                    <div class="hero-subtitle">Trova il posto perfetto per la tua barca</div>
                </div>
                
                <div class="search-section">
                    <div class="search-bar">
                        <span class="search-icon">📅</span>
                        <input type="text" class="search-input" placeholder="Check-in - Check-out" onclick="showAlert('Calendario ormeggio - Seleziona periodo')">
                    </div>
                    <div class="search-bar">
                        <span class="search-icon">📏</span>
                        <input type="text" class="search-input" placeholder="Lunghezza barca (metri)" onclick="showAlert('Dimensioni barca - Specifica lunghezza')">
                    </div>
                    <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 16px; width: 100%; font-size: 16px; font-weight: 600; margin-top: 8px;" onclick="showAlert('Cerca ormeggi - Trova posti disponibili')">Cerca Ormeggi</button>
                </div>

                <div class="section-container">
                    <div class="section-title">📍 Porti Disponibili</div>
                    <div class="boats-section">
                        <div class="port-card" onclick="showAlert('Porto di Civitavecchia - Pontili e servizi completi')">
                            <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.02_b0a0f2cb_1753598054172.jpg" class="port-image" alt="Porto Civitavecchia">
                            <div class="port-content">
                                <div class="port-title">⚓ Porto di Civitavecchia</div>
                                <div class="port-details">Pontili attrezzati • Servizi H24 • 4.8/5 (156 recensioni)</div>
                                <div class="port-price">€45/metro/giorno</div>
                            </div>
                        </div>
                        <div class="port-card" onclick="showAlert('Marina di Gaeta - Ormeggi protetti con servizi')">
                            <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.03_0d100773_1753598624016.jpg" class="port-image" alt="Marina di Gaeta">
                            <div class="port-content">
                                <div class="port-title">⚓ Marina di Gaeta</div>
                                <div class="port-details">Ormeggi protetti • Assistenza completa • 4.7/5 (89 recensioni)</div>
                                <div class="port-price">€35/metro/giorno</div>
                            </div>
                        </div>
                        <div class="port-card" onclick="showAlert('Porto di Ponza - Boe e pontili in acque cristalline')">
                            <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.03_4e65c9b7_1753598157994.jpg" class="port-image" alt="Porto di Ponza">
                            <div class="port-content">
                                <div class="port-title">🏝️ Porto di Ponza</div>
                                <div class="port-details">Boe e pontili • Acque cristalline • 4.9/5 (234 recensioni)</div>
                                <div class="port-price">€25/metro/giorno</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="esperienze" class="screen">
                <div class="hero-section">
                    <div class="hero-title">✨ Esperienze Premium</div>
                    <div class="hero-subtitle">Vivi il mare con tour ed esperienze uniche</div>
                </div>

                <div class="section-container">
                    <div class="section-title">🎯 Categorie Esperienze</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 16px;">
                        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 16px; border-radius: 12px; text-align: center;" onclick="showAlert('Tour Guidati - Escursioni con guida esperta')">
                            <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                            <div style="font-weight: 600; margin-bottom: 4px;">Tour Guidati</div>
                            <div style="font-size: 12px; opacity: 0.9;">Escursioni con guida esperta</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 16px; border-radius: 12px; text-align: center;" onclick="showAlert('Gourmet - Aperitivi e cene al tramonto')">
                            <div style="font-size: 24px; margin-bottom: 8px;">🍽️</div>
                            <div style="font-weight: 600; margin-bottom: 4px;">Gourmet</div>
                            <div style="font-size: 12px; opacity: 0.9;">Aperitivi e cene al tramonto</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px; border-radius: 12px; text-align: center;" onclick="showAlert('Charter Luxury - Esperienza completa con equipaggio')">
                            <div style="font-size: 24px; margin-bottom: 8px;">⛵</div>
                            <div style="font-weight: 600; margin-bottom: 4px;">Charter</div>
                            <div style="font-size: 12px; opacity: 0.9;">Esperienza completa con equipaggio</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 16px; border-radius: 12px; text-align: center;" onclick="showAlert('Eventi Speciali - Compleanni e celebrazioni')">
                            <div style="font-size: 24px; margin-bottom: 8px;">🎉</div>
                            <div style="font-weight: 600; margin-bottom: 4px;">Eventi</div>
                            <div style="font-size: 12px; opacity: 0.9;">Compleanni e celebrazioni</div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">🌟 Esperienze in Evidenza</div>
                    <div class="boats-section">
                        <div style="background: linear-gradient(135deg, #f97316, #ea580c); color: white; border-radius: 16px; overflow: hidden; margin-bottom: 16px;" onclick="showAlert('Tramonto a Ponza - Tour romantico con aperitivo')">
                            <img src="/api/images/caiacco_1753599016775.jpg" style="width: 100%; height: 140px; object-fit: cover;">
                            <div style="padding: 16px;">
                                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">🌅 Tramonto a Ponza</div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Tour romantico con aperitivo al tramonto • 4 ore • Max 8 persone</div>
                                <div style="font-size: 18px; font-weight: 700;">€89/persona</div>
                            </div>
                        </div>
                        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border-radius: 16px; overflow: hidden; margin-bottom: 16px;" onclick="showAlert('Gourmet Capri - Cena stellata in navigazione')">
                            <img src="/api/images/image_1753598279018.png" style="width: 100%; height: 140px; object-fit: cover;">
                            <div style="padding: 16px;">
                                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">🍽️ Gourmet Capri</div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Cena stellata in navigazione • Chef a bordo • 6 ore • Max 12 persone</div>
                                <div style="font-size: 18px; font-weight: 700;">€180/persona</div>
                            </div>
                        </div>
                        <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 16px; overflow: hidden; margin-bottom: 16px;" onclick="showAlert('Charter Premium - Giornata completa con skipper e hostess')">
                            <img src="/api/images/image_1753598580513.png" style="width: 100%; height: 140px; object-fit: cover;">
                            <div style="padding: 16px;">
                                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">⛵ Charter Premium</div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">Giornata completa con skipper e hostess • 8 ore • Max 16 persone</div>
                                <div style="font-size: 18px; font-weight: 700;">€150/persona</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="servizi" class="screen">
                <div class="hero-section">
                    <div class="hero-title">🔧 Servizi Marittimi</div>
                    <div class="hero-subtitle">Tutto quello che serve per la tua navigazione</div>
                </div>

                <div class="section-container">
                    <div class="section-title">🌊 Meteo Live</div>
                    <div style="padding: 16px;">
                        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 12px; padding: 16px;">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 20px; font-weight: 600; color: #0369a1;">27°C</div>
                                    <div style="font-size: 12px; color: #64748b;">Temperatura</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 20px; font-weight: 600; color: #0369a1;">15 kn</div>
                                    <div style="font-size: 12px; color: #64748b;">Vento NE</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 20px; font-weight: 600; color: #0369a1;">0.5 m</div>
                                    <div style="font-size: 12px; color: #64748b;">Altezza onde</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 20px; font-weight: 600; color: #10b981;">Ottimo</div>
                                    <div style="font-size: 12px; color: #64748b;">Per navigare</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">⛽ Carburante</div>
                    <div class="boats-section">
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px;" onclick="showAlert('Distributore Civitavecchia - Carburante nautico')">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 600;">⛽ Civitavecchia Marina</div>
                                    <div style="font-size: 12px; color: #64748b;">2.1 km dal porto</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 16px; font-weight: 600; color: #1e40af;">€1.85/L</div>
                                    <div style="font-size: 10px; color: #10b981;">Aperto H24</div>
                                </div>
                            </div>
                        </div>
                        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px;" onclick="showAlert('Distributore Gaeta - Carburante e servizi')">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 600;">⛽ Gaeta Port Services</div>
                                    <div style="font-size: 12px; color: #64748b;">1.8 km dal porto</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 16px; font-weight: 600; color: #1e40af;">€1.82/L</div>
                                    <div style="font-size: 10px; color: #10b981;">Aperto 7-22</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">🚨 Emergenze</div>
                    <div style="padding: 16px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; padding: 12px; text-align: center;" onclick="showAlert('Guardia Costiera - Chiamata emergenza 1530')">
                                <div style="font-size: 20px; margin-bottom: 4px;">🚨</div>
                                <div style="font-size: 14px; font-weight: 600; color: #dc2626;">Guardia Costiera</div>
                                <div style="font-size: 12px; color: #991b1b;">1530</div>
                            </div>
                            <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 12px; text-align: center;" onclick="showAlert('Assistenza Tecnica - Supporto meccanico H24')">
                                <div style="font-size: 20px; margin-bottom: 4px;">🔧</div>
                                <div style="font-size: 14px; font-weight: 600; color: #d97706;">Assistenza</div>
                                <div style="font-size: 12px; color: #92400e;">24/7</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="profilo" class="screen">
                <div class="hero-section">
                    <div class="hero-title">👤 Area Utente</div>
                    <div class="hero-subtitle">Gestisci il tuo account e le prenotazioni</div>
                </div>

                <div class="section-container">
                    <div class="section-title">🔐 Accesso</div>
                    <div style="padding: 16px;">
                        <div style="display: grid; gap: 12px;">
                            <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 16px; font-size: 16px; font-weight: 600;" onclick="showAlert('Login - Accedi al tuo account')">Accedi</button>
                            <button style="background: white; color: #1e40af; border: 2px solid #1e40af; border-radius: 12px; padding: 16px; font-size: 16px; font-weight: 600;" onclick="showAlert('Registrazione - Crea nuovo account')">Registrati</button>
                        </div>

                        <div style="margin: 20px 0; text-align: center; color: #64748b; font-size: 14px;">
                            Non hai ancora un account? Scegli il tuo ruolo:
                        </div>

                        <div style="display: grid; gap: 12px;">
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;" onclick="showAlert('Registrazione Cliente - Prenota barche ed esperienze')">
                                <div style="font-weight: 600; margin-bottom: 4px;">👥 Mi registro come Cliente</div>
                                <div style="font-size: 12px; color: #64748b;">Prenota barche ed esperienze</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; border-radius: 12px; padding: 16px;" onclick="showAlert('Registrazione Sea Host - Affitta le tue barche')">
                                <div style="font-weight: 600; margin-bottom: 4px;">🚤 Diventa Sea Host</div>
                                <div style="font-size: 12px; opacity: 0.9;">Affitta le tue barche e guadagna</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">📞 Assistenza e Supporto</div>
                    <div style="padding: 16px;">
                        <div style="display: grid; gap: 12px;">
                            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;" onclick="showAlert('FAQ - Domande frequenti e risposte')">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="font-size: 24px;">❓</div>
                                    <div>
                                        <div style="font-weight: 600;">FAQ</div>
                                        <div style="font-size: 12px; color: #64748b;">Domande frequenti</div>
                                    </div>
                                </div>
                            </div>
                            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;" onclick="showAlert('Chat AI - Assistente intelligente sempre disponibile')">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="font-size: 24px;">🤖</div>
                                    <div>
                                        <div style="font-weight: 600;">Chat AI</div>
                                        <div style="font-size: 12px; color: #64748b;">Assistente intelligente 24/7</div>
                                    </div>
                                </div>
                            </div>
                            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;" onclick="showAlert('Email Support - Contatta il team di supporto')">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="font-size: 24px;">📧</div>
                                    <div>
                                        <div style="font-weight: 600;">Email Support</div>
                                        <div style="font-size: 12px; color: #64748b;">support@seago.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-nav">
            <div class="nav-item active" onclick="showScreen('esplora')">
                <span class="nav-icon">🚤</span>
                <span class="nav-label">ESPLORA</span>
            </div>
            <div class="nav-item" onclick="showScreen('ormeggio')">
                <span class="nav-icon">⚓</span>
                <span class="nav-label">ORMEGGIO</span>
            </div>
            <div class="nav-item" onclick="showScreen('esperienze')">
                <span class="nav-icon">✨</span>
                <span class="nav-label">ESPERIENZE</span>
            </div>
            <div class="nav-item" onclick="showScreen('servizi')">
                <span class="nav-icon">🔧</span>
                <span class="nav-label">SERVIZI</span>
            </div>
            <div class="nav-item" onclick="showScreen('profilo')">
                <span class="nav-icon">👤</span>
                <span class="nav-label">PROFILO</span>
            </div>
        </div>
    </div>

    <script>
        function showScreen(screenId) {
            // Hide all screens
            const screens = document.querySelectorAll('.screen');
            screens.forEach(screen => screen.classList.remove('active'));
            
            // Show selected screen
            document.getElementById(screenId).classList.add('active');
            
            // Update active nav item
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            event.currentTarget.classList.add('active');
            
            // Scroll to top
            document.getElementById('content').scrollTop = 0;
        }
        
        function showAlert(message) {
            alert('SeaGO Mobile: ' + message);
        }
    </script>
</body>
</html>
  `);
});
                    <div class="service-card" onclick="showAlert('21 Barche disponibili oggi')">
                        <div class="service-icon">🚤</div>
                        <div class="service-title">Barche</div>
                        <div class="service-value">21 disponibili</div>
                    </div>
                    <div class="service-card" onclick="showAlert('15 Porti nel Lazio')">
                        <div class="service-icon">⚓</div>
                        <div class="service-title">Porti</div>
                        <div class="service-value">15 porti</div>
                    </div>
                    <div class="service-card" onclick="showAlert('850+ Clienti soddisfatti')">
                        <div class="service-icon">⭐</div>
                        <div class="service-title">Clienti</div>
                        <div class="service-value">850+ felici</div>
                    </div>
                    <div class="service-card" onclick="showAlert('24/7 Supporto disponibile')">
                        <div class="service-icon">🔒</div>
                        <div class="service-title">Supporto</div>
                        <div class="service-value">24/7</div>
                    </div>
                </div>
                
                <div class="section-title">🚤 Categorie Barche</div>
                <div class="categories-grid">
                    <div class="category-card" onclick="showAlert('Gommoni - 7 barche: da €180 a €450/giorno')">
                        <img src="/api/images/gommone senza patente_1752875806367.webp" class="category-image" alt="Gommoni">
                        <div class="category-name">Gommoni</div>
                        <div class="category-count">7 barche • da €180</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Senza Patente - 3 barche: perfette per principianti')">
                        <img src="/api/images/OIP (1)_1752921317486.webp" class="category-image" alt="Senza Patente">
                        <div class="category-name">Senza Patente</div>
                        <div class="category-count">3 barche • da €120</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Yacht - 5 barche di lusso: esperienze premium')">
                        <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Yacht">
                        <div class="category-name">Yacht</div>
                        <div class="category-count">5 barche • da €850</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Barche a Vela - 6 barche: navigazione autentica')">
                        <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="category-image" alt="Barche a Vela">
                        <div class="category-name">Barche a Vela</div>
                        <div class="category-count">6 barche • da €280</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Moto d\\'acqua - Adrenalina pura: noleggio orario')">
                        <img src="/api/images/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg" class="category-image" alt="Moto d'acqua">
                        <div class="category-name">Moto d'acqua</div>
                        <div class="category-count">Disponibili • €80/ora</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Catamarani - Spazio per gruppi: fino a 12 persone')">
                        <img src="/api/images/catamarano ludovica_1752876117442.jpg" class="category-image" alt="Catamarani">
                        <div class="category-name">Catamarani</div>
                        <div class="category-count">Disponibili • €520</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Charter - Con skipper: esperienza completa')">
                        <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="category-image" alt="Charter">
                        <div class="category-name">Charter</div>
                        <div class="category-count">15 esperienze • €1.200</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Houseboat - Casa galleggiante: vacanze uniche')">
                        <img src="/api/images/OIP_1752919948843.webp" class="category-image" alt="Houseboat">
                        <div class="category-name">Houseboat</div>
                        <div class="category-count">Disponibili • €380</div>
                    </div>
                </div>
                
                <div class="section-title">🌟 Barche in Evidenza</div>
                <div class="boat-card featured-boat" onclick="showAlert('Azzurra 680 - Gommone luxury con tutti i comfort')">
                    <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.02_b0a0f2cb_1753598054172.jpg" class="boat-image" alt="Azzurra 680">
                    <div class="boat-title">⭐ Azzurra 680 - Gommone Lusso</div>
                    <div class="boat-details">📍 Civitavecchia • 👥 8 persone • ⛽ Carburante incluso • ⭐ 4.9 (47 recensioni)</div>
                    <div class="boat-price">€350/giorno <span style="font-size: 12px; color: #10b981;">• Bestseller</span></div>
                </div>
                <div class="boat-card featured-boat" onclick="showAlert('Charter Premium - Esperienza completa con skipper professionale')">
                    <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="boat-image" alt="Charter Premium">
                    <div class="boat-title">⭐ Charter Premium con Skipper</div>
                    <div class="boat-details">📍 Gaeta • 👥 12 persone • 👨‍✈️ Skipper professionale • 🥂 Aperitivo • ⭐ 5.0 (23 recensioni)</div>
                    <div class="boat-price">€1.200/giorno <span style="font-size: 12px; color: #f59e0b;">• Luxury</span></div>
                </div>
                <div class="boat-card featured-boat" onclick="showAlert('Barca a Vela Ludovica - Navigazione autentica con istruttore')">
                    <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="boat-image" alt="Barca a Vela Ludovica">
                    <div class="boat-title">⭐ Barca a Vela "Ludovica"</div>
                    <div class="boat-details">📍 Ponza • 👥 6 persone • ⛵ Navigazione autentica • 🎓 Corso vela • ⭐ 4.8 (31 recensioni)</div>
                    <div class="boat-price">€280/giorno <span style="font-size: 12px; color: #3b82f6;">• Con corso</span></div>
                </div>
                <div class="boat-card featured-boat" onclick="showAlert('Senza Patente Easy - Perfetto per famiglie e principianti')">
                    <img src="/api/images/OIP (1)_1752921317486.webp" class="boat-image" alt="Easy Boat">
                    <div class="boat-title">⭐ Easy Boat - Senza Patente</div>
                    <div class="boat-details">📍 Terracina • 👥 5 persone • 🎓 Briefing incluso • 🔧 Assistenza • ⭐ 4.7 (89 recensioni)</div>
                    <div class="boat-price">€120/giorno <span style="font-size: 12px; color: #22c55e;">• Principianti</span></div>
                </div>
                <div class="boat-card featured-boat" onclick="showAlert('Jetski Yamaha - Adrenalina pura sul mare del Lazio')">
                    <img src="/api/images/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg" class="boat-image" alt="Jetski Yamaha">
                    <div class="boat-title">⭐ Jetski Yamaha VX Cruiser</div>
                    <div class="boat-details">📍 Anzio • 👥 2 persone • ⚡ 180HP • 🏁 Adrenalina • ⭐ 4.6 (54 recensioni)</div>
                    <div class="boat-price">€80/ora <span style="font-size: 12px; color: #ef4444;">• Adrenalina</span></div>
                </div>
            </div>
            
            <div id="ormeggio" class="screen">
                <div class="hero-section">
                    <div class="hero-title">⚓ Servizi Ormeggio</div>
                    <div class="hero-subtitle">Trova il posto perfetto per la tua barca</div>
                </div>
                
                <div class="filters-bar">
                    <div class="filter-item" onclick="showAlert('Filtro date - Seleziona periodo ormeggio')">
                        <span class="filter-label">📅 Date</span>
                        <span class="filter-value">Seleziona periodo</span>
                    </div>
                    <div class="filter-item" onclick="showAlert('Filtro lunghezza - Specifica metri barca')">
                        <span class="filter-label">📏 Lunghezza</span>
                        <span class="filter-value">8-20 metri</span>
                    </div>
                    <div class="filter-item" onclick="showAlert('Filtro servizi - Scegli servizi porto')">
                        <span class="filter-label">🛠️ Servizi</span>
                        <span class="filter-value">Tutti</span>
                    </div>
                </div>
                
                <div class="section-title">🏖️ Porti Disponibili</div>
                <div class="boat-card" onclick="showAlert('Porto di Civitavecchia - Prenota ormeggio pontile')">
                    <img src="/api/images/image_1753598279018.png" class="boat-image" alt="Porto Civitavecchia">
                    <div class="boat-title">Porto di Civitavecchia - Pontile A</div>
                    <div class="boat-details">⭐ 4.8 • 🔒 Sicurezza H24 • 🚿 Servizi completi</div>
                    <div class="boat-price">€45/metro/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Marina di Gaeta - Prenota posto premium')">
                    <img src="/api/images/image_1753598580513.png" class="boat-image" alt="Marina Gaeta">
                    <div class="boat-title">Marina di Gaeta - Servizi Premium</div>
                    <div class="boat-details">⭐ 4.9 • ⛽ Carburante • 🍽️ Ristorante</div>
                    <div class="boat-price">€38/metro/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Porto di Anzio - Prenota ormeggio')">
                    <img src="/api/images/image_1753598781937.png" class="boat-image" alt="Porto Anzio">
                    <div class="boat-title">Porto di Anzio - Marina Turistico</div>
                    <div class="boat-details">⭐ 4.7 • 🏪 Market • 🔧 Assistenza tecnica</div>
                    <div class="boat-price">€32/metro/giorno</div>
                </div>
            </div>
            
            <div id="esperienze" class="screen">
                <div class="hero-section">
                    <div class="hero-title">✨ Esperienze Marine</div>
                    <div class="hero-subtitle">Scopri il mare in modo unico</div>
                </div>
                
                <div class="categories-grid">
                    <div class="category-card" onclick="showAlert('Tour Guidati - Scopri la costa con esperto')">
                        <div class="category-name">🗺️ Tour Guidati</div>
                        <div class="category-count">12 esperienze</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Gourmet - Degustazioni marine esclusive')">
                        <div class="category-name">🍾 Gourmet</div>
                        <div class="category-count">8 esperienze</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Charter - Esperienza completa con skipper')">
                        <div class="category-name">👨‍✈️ Charter</div>
                        <div class="category-count">15 esperienze</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Eventi - Celebrazioni speciali in mare')">
                        <div class="category-name">🎉 Eventi</div>
                        <div class="category-count">6 esperienze</div>
                    </div>
                </div>
                
                <div class="section-title">🌟 Esperienze Premium</div>
                <div class="boat-card experience-card" onclick="showAlert('Tour Costiera Amalfitana - Prenota esperienza premium')">
                    <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.03_0d100773_1753598624016.jpg" class="boat-image" alt="Costiera Amalfitana">
                    <div class="boat-title">Tour Costiera Amalfitana VIP</div>
                    <div class="boat-details">⏰ 8 ore • 🍽️ Pranzo incluso • 👥 Max 8 persone</div>
                    <div class="boat-price">€120/persona</div>
                </div>
                <div class="boat-card experience-card" onclick="showAlert('Aperitivo al Tramonto - Esperienza romantica')">
                    <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.03_4e65c9b7_1753598157994.jpg" class="boat-image" alt="Aperitivo Tramonto">
                    <div class="boat-title">Aperitivo al Tramonto - Ponza</div>
                    <div class="boat-details">⏰ 3 ore • 🥂 Drink inclusi • 🌅 Vista esclusiva</div>
                    <div class="boat-price">€85/persona</div>
                </div>
                <div class="boat-card experience-card" onclick="showAlert('Escursione Isole Pontine - Giornata completa')">
                    <img src="/api/images/image_1753600144919.png" class="boat-image" alt="Isole Pontine">
                    <div class="boat-title">Escursione Isole Pontine</div>
                    <div class="boat-details">⏰ Giornata intera • 🏝️ 3 isole • 🍱 Picnic marino</div>
                    <div class="boat-price">€95/persona</div>
                </div>
            </div>
            
            <div id="servizi" class="screen">
                <div class="hero-section">
                    <div class="hero-title">🛠️ Servizi Esterni</div>
                    <div class="hero-subtitle">Tutto quello che ti serve per navigare</div>
                </div>
                
                <div class="service-grid">
                    <div class="service-card" onclick="showAlert('Meteo Marino - Condizioni in tempo reale')">
                        <div class="service-icon">🌊</div>
                        <div class="service-title">Meteo Marino</div>
                        <div class="service-value">Vento: 12 nodi</div>
                    </div>
                    <div class="service-card" onclick="showAlert('Carburante - Distributori e prezzi')">
                        <div class="service-icon">⛽</div>
                        <div class="service-title">Carburante</div>
                        <div class="service-value">€1.48/litro</div>
                    </div>
                    <div class="service-card" onclick="showAlert('Porti - Servizi e disponibilità')">
                        <div class="service-icon">⚓</div>
                        <div class="service-title">Info Porti</div>
                        <div class="service-value">15 porti</div>
                    </div>
                    <div class="service-card" onclick="showAlert('Emergenze - Contatti sicurezza')">
                        <div class="service-icon">🆘</div>
                        <div class="service-title">Emergenze</div>
                        <div class="service-value">Guardia Costiera</div>
                    </div>
                </div>
                
                <div class="section-title">🌊 Condizioni Marine Live</div>
                <div class="boat-card" onclick="showAlert('Meteo Civitavecchia - Condizioni ottimali')">
                    <img src="/api/images/image_1753600168887.png" class="boat-image" alt="Meteo Civitavecchia">
                    <div class="boat-title">Civitavecchia - Condizioni Ottimali</div>
                    <div class="boat-details">🌡️ 24°C • 💨 12 nodi NE • 🌊 Onde 0.5m</div>
                    <div class="boat-price" style="color: #22c55e;">Navigazione Sicura ✅</div>
                </div>
                <div class="boat-card" onclick="showAlert('Meteo Gaeta - Condizioni buone')">
                    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">🌤️ Gaeta Live</div>
                    <div class="boat-title">Gaeta - Condizioni Buone</div>
                    <div class="boat-details">🌡️ 23°C • 💨 15 nodi SE • 🌊 Onde 0.8m</div>
                    <div class="boat-price" style="color: #22c55e;">Navigazione Buona ✅</div>
                </div>
                
                <div class="section-title">⛽ Distributori Carburante</div>
                <div class="boat-card" onclick="showAlert('IP Marina Civitavecchia - Rifornimento')">
                    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">⛽ IP Marina</div>
                    <div class="boat-title">IP Marina - Civitavecchia</div>
                    <div class="boat-details">📍 Porto Turistico • 🕒 24h • 💳 Carte accettate</div>
                    <div class="boat-price">€1.48/litro</div>
                </div>
            </div>
            
            <div id="profilo" class="screen">
                <div class="hero-section">
                    <div class="hero-title">👤 Il Mio Profilo</div>
                    <div class="hero-subtitle">Gestisci il tuo account SeaGO</div>
                </div>
                
                <div class="section-title">🔐 Account</div>
                <div class="boat-card" onclick="showAlert('Login - Accedi al tuo account SeaGO')">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">🔑 Login</div>
                    <div class="boat-title">Accedi al tuo Account</div>
                    <div class="boat-details">Email e password • Accesso rapido • Sicuro</div>
                    <div class="boat-price" style="color: #10b981;">Accedi ora</div>
                </div>
                <div class="boat-card" onclick="showAlert('Registrazione - Crea nuovo account')">
                    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">📝 Registro</div>
                    <div class="boat-title">Registrati su SeaGO</div>
                    <div class="boat-details">Gratis • Facile • Veloce</div>
                    <div class="boat-price" style="color: #3b82f6;">Registrati</div>
                </div>
                
                <div class="section-title">📋 Le Mie Prenotazioni</div>
                <div class="boat-card" onclick="showAlert('Prenotazioni attive - Gestisci le tue prenotazioni')">
                    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">📅 Prenotazioni</div>
                    <div class="boat-title">Le Mie Prenotazioni</div>
                    <div class="boat-details">3 prenotazioni attive • 2 prossime • 5 completate</div>
                    <div class="boat-price" style="color: #f59e0b;">Gestisci</div>
                </div>
                
                <div class="section-title">🛠️ Diventa Noleggiatore</div>
                <div class="boat-card" onclick="showAlert('Diventa Sea Host - Registra la tua barca')">
                    <div style="background: linear-gradient(135deg, #f97316, #ea580c); height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 8px;">🚤 Sea Host</div>
                    <div class="boat-title">Diventa Sea Host</div>
                    <div class="boat-details">Guadagna fino a €12.500/anno • Commissione 15%</div>
                    <div class="boat-price" style="color: #f97316;">Registra barca</div>
                </div>
                
                <div class="section-title">🤝 Assistenza</div>
                <div class="service-grid">
                    <div class="service-card" onclick="showAlert('Chat AI - Assistenza intelligente 24/7')">
                        <div class="service-icon">🤖</div>
                        <div class="service-title">Chat AI</div>
                        <div class="service-value">24/7</div>
                    </div>
                    <div class="service-card" onclick="showAlert('FAQ - Domande frequenti')">
                        <div class="service-icon">❓</div>
                        <div class="service-title">FAQ</div>
                        <div class="service-value">50+ risposte</div>
                    </div>
                    <div class="service-card" onclick="showAlert('Email - Supporto via email')">
                        <div class="service-icon">📧</div>
                        <div class="service-title">Email</div>
                        <div class="service-value">Supporto</div>
                    </div>
                    <div class="service-card" onclick="showAlert('Centro Aiuto - Guide complete')">
                        <div class="service-icon">📚</div>
                        <div class="service-title">Centro Aiuto</div>
                        <div class="service-value">Guide complete</div>
                    </div>
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
