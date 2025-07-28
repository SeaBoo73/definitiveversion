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
    <title>SeaGO Mobile - App Completa</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; height: 100vh; overflow: hidden; }
        .mobile-frame { max-width: 375px; height: 100vh; margin: 0 auto; background: white; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 20px 16px 16px; text-align: center; font-weight: bold; font-size: 18px; }
        .content { flex: 1; overflow-y: auto; padding: 16px; height: calc(100vh - 140px); }
        .search-bar { background: white; border-radius: 12px; padding: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; display: flex; align-items: center; }
        .search-input { flex: 1; border: none; outline: none; font-size: 16px; color: #374151; margin-left: 8px; }
        .search-icon { color: #6b7280; }
        .categories-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .category-card { background: white; border-radius: 12px; padding: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .category-image { width: 100%; height: 80px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; }
        .category-name { font-weight: 600; color: #374151; margin-bottom: 2px; font-size: 14px; }
        .category-count { color: #6b7280; font-size: 12px; }
        .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .boat-card { background: white; border-radius: 12px; padding: 12px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .boat-image { width: 100%; height: 120px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; }
        .boat-title { font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 14px; }
        .boat-details { color: #6b7280; font-size: 12px; margin-bottom: 4px; }
        .boat-price { color: #0ea5e9; font-weight: bold; font-size: 16px; }
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
        .hero-section { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 24px 16px; margin: -16px -16px 24px -16px; text-align: center; border-radius: 0 0 20px 20px; }
        .hero-title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
        .hero-subtitle { font-size: 16px; opacity: 0.9; }
        .filters-bar { background: white; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .filter-item { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
        .filter-item:last-child { border-bottom: none; }
        .filter-label { font-weight: 500; color: #374151; }
        .filter-value { color: #6b7280; font-size: 14px; }
        .experience-card { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
        .experience-card .boat-title { color: white; }
        .experience-card .boat-details { color: rgba(255,255,255,0.8); }
        .experience-card .boat-price { color: white; }
        .service-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .service-card { background: white; border-radius: 12px; padding: 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
        .service-icon { font-size: 32px; margin-bottom: 8px; }
        .service-title { font-weight: 600; color: #374151; margin-bottom: 4px; font-size: 14px; }
        .service-value { color: #0ea5e9; font-weight: bold; font-size: 16px; }
        @media (max-width: 375px) { .mobile-frame { max-width: 100%; } }
    </style>
</head>
<body>
    <div class="mobile-frame">
        <div class="header">🚤 SeaGO - App Mobile Completa</div>
        <div class="content" id="content">
            <div class="info-banner">
                <div class="info-text">📱 Versione Mobile Completa - Identica alla Web App</div>
            </div>
            <div id="esplora" class="screen active">
                <div class="hero-section">
                    <div class="hero-title">Scopri il Mare del Lazio</div>
                    <div class="hero-subtitle">Trova la barca perfetta per la tua avventura</div>
                </div>
                
                <div class="search-bar">
                    <div class="search-icon">🔍</div>
                    <input type="text" class="search-input" placeholder="Dove vuoi navigare?" onclick="showAlert('Ricerca barche - Apre schermata filtri avanzati')">
                </div>
                
                <div class="section-title">🚤 Categorie Barche</div>
                <div class="categories-grid">
                    <div class="category-card" onclick="showAlert('Gommoni - 7 barche disponibili')">
                        <img src="/api/images/gommone senza patente_1752875806367.webp" class="category-image" alt="Gommoni">
                        <div class="category-name">Gommoni</div>
                        <div class="category-count">7 barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Senza Patente - 3 barche disponibili')">
                        <img src="/api/images/OIP (1)_1752921317486.webp" class="category-image" alt="Senza Patente">
                        <div class="category-name">Senza Patente</div>
                        <div class="category-count">3 barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Yacht - 5 barche disponibili')">
                        <img src="/api/images/R (1)_1752920495156.jpg" class="category-image" alt="Yacht">
                        <div class="category-name">Yacht</div>
                        <div class="category-count">5 barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Barche a Vela - 6 barche disponibili')">
                        <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="category-image" alt="Barche a Vela">
                        <div class="category-name">Barche a Vela</div>
                        <div class="category-count">6 barche</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Moto d\\'acqua - Esperienza adrenalina')">
                        <img src="/api/images/WhatsApp Image 2025-06-15 at 23.38.19_1752875703213.jpeg" class="category-image" alt="Moto d'acqua">
                        <div class="category-name">Moto d'acqua</div>
                        <div class="category-count">Disponibili</div>
                    </div>
                    <div class="category-card" onclick="showAlert('Catamarani - Spazio e comfort')">
                        <img src="/api/images/catamarano ludovica_1752876117442.jpg" class="category-image" alt="Catamarani">
                        <div class="category-name">Catamarani</div>
                        <div class="category-count">Disponibili</div>
                    </div>
                </div>
                
                <div class="section-title">🌟 Barche in Evidenza</div>
                <div class="boat-card" onclick="showAlert('Azzurra 680 - Prenota ora')">
                    <img src="/api/images/Immagine WhatsApp 2025-07-27 ore 07.52.02_b0a0f2cb_1753598054172.jpg" class="boat-image" alt="Azzurra 680">
                    <div class="boat-title">Azzurra 680 - Gommone Lusso</div>
                    <div class="boat-details">📍 Civitavecchia • 👥 8 persone • ⛽ Carburante incluso</div>
                    <div class="boat-price">€350/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Luxury Charter - Prenota esperienza')">
                    <img src="/api/images/WhatsApp Image 2025-06-12 at 20.22.10_1752876155096.jpeg" class="boat-image" alt="Charter">
                    <div class="boat-title">Charter Premium con Skipper</div>
                    <div class="boat-details">📍 Gaeta • 👥 12 persone • 👨‍✈️ Skipper incluso</div>
                    <div class="boat-price">€1.200/giorno</div>
                </div>
                <div class="boat-card" onclick="showAlert('Barca a Vela Ludovica - Prenota')">
                    <img src="/api/images/barca a vela ludovica_1752876195081.jpg" class="boat-image" alt="Barca a Vela">
                    <div class="boat-title">Barca a Vela "Ludovica"</div>
                    <div class="boat-details">📍 Ponza • 👥 6 persone • ⛵ Navigazione autentica</div>
                    <div class="boat-price">€280/giorno</div>
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
