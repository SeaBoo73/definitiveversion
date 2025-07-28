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

// Native app preview route
app.get("/app-preview", (req, res) => {
  res.sendFile(path.resolve("mobile-preview.html"));
});

// Redirect root to native app preview for easier access
app.get("/", (req, res) => {
  res.sendFile(path.resolve("mobile-preview.html"));
});

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
            flex-direction: column;
            gap: 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .search-label {
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 4px;
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
        .stat-change {
            font-size: 10px;
            color: #10b981;
            margin-top: 4px;
        }
        .section-subtitle {
            font-size: 14px;
            color: #64748b;
            text-align: center;
            margin-bottom: 16px;
            padding: 0 16px;
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
                        <span class="search-label">Dove</span>
                        <input type="text" class="search-input" placeholder="Seleziona porto..." onclick="showAlert('Selezione porto - Apre menu località')">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div class="search-bar">
                            <span class="search-label">Dal</span>
                            <input type="text" class="search-input" placeholder="Seleziona data" onclick="showAlert('Data partenza - Calendario')">
                        </div>
                        <div class="search-bar">
                            <span class="search-label">Al</span>
                            <input type="text" class="search-input" placeholder="Seleziona data" onclick="showAlert('Data ritorno - Calendario')">
                        </div>
                    </div>
                    <div class="search-bar">
                        <span class="search-label">Ospiti</span>
                        <input type="text" class="search-input" placeholder="2 ospiti" onclick="showAlert('Numero ospiti - Seleziona persone')">
                    </div>
                    <div class="search-bar">
                        <span class="search-label">Tipo imbarcazione</span>
                        <input type="text" class="search-input" placeholder="Con Skipper" onclick="showAlert('Tipo imbarcazione - Con Skipper/Esperienze o charter')">
                    </div>
                    <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 16px; width: 100%; font-size: 16px; font-weight: 600; margin-top: 8px;" onclick="showAlert('Cerca barche - Avvia ricerca')">Cerca</button>
                </div>

                <div class="section-container">
                    <div class="section-title">Politiche Carburante</div>
                    <div style="padding: 16px;">
                        <div style="background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; text-align: center;">
                            <div style="font-size: 14px; color: #92400e; line-height: 1.5;">
                                Il carburante è generalmente escluso dal prezzo di noleggio. <br>
                                Per charter ed esperienze guidate il carburante è incluso nel prezzo.
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="stats-section">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">500+</div>
                            <div class="stat-label">Barche disponibili</div>
                            <div class="stat-change">+12% questo mese</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">2.5K</div>
                            <div class="stat-label">Utenti attivi</div>
                            <div class="stat-change">+18% questo mese</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">4.8/5</div>
                            <div class="stat-label">Valutazione media</div>
                            <div class="stat-change">Sempre eccellente</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">1.2K</div>
                            <div class="stat-label">Prenotazioni</div>
                            <div class="stat-change">+24% questo mese</div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">Esplora per categoria</div>
                    <div class="section-subtitle">Trova l'imbarcazione perfetta per la tua avventura</div>
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
                    <div class="section-title">Prenota la tua barca</div>
                    <div class="section-subtitle">Scegli tra le nostre imbarcazioni</div>
                    <div class="categories-grid">
                        <div class="category-card" onclick="showAlert('Gommoni - Imbarcazioni versatili')">
                            <img src="/api/images/gommone senza patente_1752875806367.webp" class="category-image" alt="Gommoni">
                            <div class="category-name">Gommoni</div>
                            <div class="category-desc">Imbarcazioni versatili</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Senza patente - Facili da guidare')">
                            <img src="/api/images/OIP (1)_1752921317486.webp" class="category-image" alt="Senza patente">
                            <div class="category-name">Senza patente</div>
                            <div class="category-desc">Facili da guidare</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Yacht - Lusso e comfort')">
                            <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Yacht">
                            <div class="category-name">Yacht</div>
                            <div class="category-desc">Lusso e comfort</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Barche a vela - Navigazione autentica')">
                            <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="category-image" alt="Barche a vela">
                            <div class="category-name">Barche a vela</div>
                            <div class="category-desc">Navigazione autentica</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Moto d\\'acqua - Adrenalina in acqua')">
                            <img src="/api/images/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg" class="category-image" alt="Moto d'acqua">
                            <div class="category-name">Moto d'acqua</div>
                            <div class="category-desc">Adrenalina in acqua</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Catamarani - Spazio e stabilità')">
                            <img src="/api/images/catamarano ludovica_1752876117442.jpg" class="category-image" alt="Catamarani">
                            <div class="category-name">Catamarani</div>
                            <div class="category-desc">Spazio e stabilità</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Charter - Con skipper')">
                            <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="category-image" alt="Charter">
                            <div class="category-name">Charter</div>
                            <div class="category-desc">Con skipper</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Casa galleggiante - Casa galleggiante')">
                            <img src="/api/images/OIP_1752919948843.webp" class="category-image" alt="Casa galleggiante">
                            <div class="category-name">Casa galleggiante</div>
                            <div class="category-desc">Casa galleggiante</div>
                            <button class="category-link">Prenota</button>
                        </div>
                        <div class="category-card" onclick="showAlert('Barche motore - Velocità e comfort')">
                            <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Barche motore">
                            <div class="category-name">Barche motore</div>
                            <div class="category-desc">Velocità e comfort</div>
                            <button class="category-link">Prenota</button>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">Charter Giornalieri</div>
                    <div class="boats-section">
                        <div class="boat-card featured-boat" onclick="showAlert('Charter Costa - Esplora la costa con skipper')">
                            <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="boat-image" alt="Charter Costa">
                            <div class="boat-content">
                                <div class="boat-title">Charter Costa</div>
                                <div class="boat-details">Esplora la costa con skipper</div>
                                <div class="boat-price">€180/giorno</div>
                            </div>
                        </div>
                        <div class="boat-card featured-boat" onclick="showAlert('Tour delle Isole - Gita alle isole vicine')">
                            <img src="/api/images/catamarano ludovica_1752876117442.jpg" class="boat-image" alt="Tour delle Isole">
                            <div class="boat-content">
                                <div class="boat-title">Tour delle Isole</div>
                                <div class="boat-details">Gita alle isole vicine</div>
                                <div class="boat-price">€240/giorno</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">Esplora il Mare di Lazio e Campania</div>
                    <div class="section-subtitle">Scopri le imbarcazioni disponibili nei porti più belli di Lazio e Campania. 14 porti principali da Civitavecchia a Capri con prezzi in tempo reale.</div>
                    <div style="text-align: center; padding: 16px;">
                        <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
                        <div style="font-weight: 600; margin-bottom: 16px;">Porti del Lazio e Campania</div>
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 16px;">14 Porti Principali con Coordinate GPS Precise</div>
                        
                        <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                            <div style="font-weight: 600; margin-bottom: 12px; color: #1e40af;">🏛️ LAZIO</div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Civitavecchia - 4 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Civitavecchia</div>
                                    <div style="font-size: 10px; color: #64748b;">4 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Gaeta - 2 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Gaeta</div>
                                    <div style="font-size: 10px; color: #64748b;">2 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Ponza - 2 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🏝️ Ponza</div>
                                    <div style="font-size: 10px; color: #64748b;">2 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Terracina - 2 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Terracina</div>
                                    <div style="font-size: 10px; color: #64748b;">2 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Anzio - 3 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🏖️ Anzio</div>
                                    <div style="font-size: 10px; color: #64748b;">3 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Formia - 2 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🌊 Formia</div>
                                    <div style="font-size: 10px; color: #64748b;">2 barche</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #fef9e7; border-radius: 12px; padding: 16px;">
                            <div style="font-weight: 600; margin-bottom: 12px; color: #d97706;">🌋 CAMPANIA</div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Napoli - 8 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Napoli</div>
                                    <div style="font-size: 10px; color: #64748b;">8 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Sorrento - 5 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🍋 Sorrento</div>
                                    <div style="font-size: 10px; color: #64748b;">5 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Amalfi - 3 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🏔️ Amalfi</div>
                                    <div style="font-size: 10px; color: #64748b;">3 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Salerno - 4 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Salerno</div>
                                    <div style="font-size: 10px; color: #64748b;">4 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Ischia - 6 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🌋 Ischia</div>
                                    <div style="font-size: 10px; color: #64748b;">6 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Capri - 4 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">💎 Capri</div>
                                    <div style="font-size: 10px; color: #64748b;">4 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Procida - 3 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">🏝️ Procida</div>
                                    <div style="font-size: 10px; color: #64748b;">3 barche</div>
                                </div>
                                <div style="background: white; padding: 8px; border-radius: 8px; text-align: center;" onclick="showAlert('Castellammare - 2 barche disponibili')">
                                    <div style="font-size: 12px; font-weight: 600;">⚓ Castellammare</div>
                                    <div style="font-size: 10px; color: #64748b;">2 barche</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 16px; padding: 12px; background: #e0f2fe; border-radius: 8px; font-size: 12px; color: #0369a1;">
                            La mappa Google Maps si attiverà automaticamente appena l'API sarà configurata
                        </div>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">⚓ Trova il tuo ormeggio ideale</div>
                    <div class="section-subtitle">Ormeggi sicuri e servizi completi per la tua imbarcazione</div>
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

                <div class="section-container">
                    <div class="section-title">Condizioni Meteo e Servizi</div>
                    <div class="section-subtitle">Informazioni utili per la tua navigazione</div>
                    <div style="padding: 16px;">
                        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; border-radius: 16px; padding: 20px; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <div>
                                    <div style="font-size: 18px; font-weight: 600;">Condizioni Marine</div>
                                    <div style="font-size: 14px; opacity: 0.9;">Roma/Fiumicino</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 24px; font-weight: 700;">28°C</div>
                                    <div style="font-size: 12px; opacity: 0.8;">Nuvoloso</div>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px;">
                                <div style="text-align: center;">
                                    <div style="font-weight: 600;">22 kn</div>
                                    <div style="opacity: 0.8;">SSW</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-weight: 600;">0.86 m</div>
                                    <div style="opacity: 0.8;">Leggero</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-weight: 600;">73 km</div>
                                    <div style="opacity: 0.8;">Visibilità</div>
                                </div>
                            </div>
                            <div style="margin-top: 12px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 12px; text-align: center;">
                                Navigazione: Attenzione richiesta
                            </div>
                        </div>
                        <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 12px; width: 100%; font-size: 14px; font-weight: 600;" onclick="showAlert('Dettagli meteo completi')">Dettagli completi</button>
                    </div>
                </div>

                <div class="section-container">
                    <div class="section-title">Affitta la tua barca</div>
                    <div class="section-subtitle">Guadagna mettendo a disposizione la tua imbarcazione. Gestisci tutto facilmente dalla tua dashboard personale.</div>
                    <div style="padding: 16px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                            <div style="background: #f0f9ff; padding: 16px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 20px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">€3.5K</div>
                                <div style="font-size: 11px; color: #64748b;">Guadagno medio mensile</div>
                            </div>
                            <div style="background: #ecfdf5; padding: 16px; border-radius: 12px; text-align: center;">
                                <div style="font-size: 20px; font-weight: 700; color: #10b981; margin-bottom: 4px;">85%</div>
                                <div style="font-size: 11px; color: #64748b;">Tasso occupazione</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <div style="font-weight: 600; margin-bottom: 12px; font-size: 16px;">Registrazione immediata</div>
                            <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Clicca qui per procedere direttamente alla registrazione senza compilare i dati.</div>
                            <button style="background: #1e40af; color: white; border: none; border-radius: 12px; padding: 12px; width: 100%; font-size: 14px; font-weight: 600; margin-bottom: 16px;" onclick="showAlert('Diventa noleggiatore - Registrazione diretta')">Diventa noleggiatore</button>
                        </div>

                        <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                            <div style="font-weight: 600; margin-bottom: 12px; font-size: 16px;">Registrazione rapida</div>
                            <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Compila i dati per iniziare subito</div>
                            <div style="display: grid; gap: 8px;">
                                <input type="text" placeholder="Nome" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px;">
                                <input type="text" placeholder="Cognome" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px;">
                                <input type="email" placeholder="Email" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px;">
                                <button style="background: #10b981; color: white; border: none; border-radius: 8px; padding: 12px; font-size: 14px; font-weight: 600;" onclick="showAlert('Continua con questi dati - Vai alla registrazione completa')">Continua con questi dati</button>
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

(async () => {
  const server = await registerRoutes(app);
  // Commenting out Vite setup to serve native app preview directly
  // await setupVite(app, server);

  // Start the server
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port} - Native App Preview Mode`);
  });
})();
