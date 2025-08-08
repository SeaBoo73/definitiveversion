const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = 8081;

// Serve React Native web build files
app.use(express.static(path.join(__dirname, 'web-build')));

// Serve the App.tsx content as a simple React app
app.get('*', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SeaBoo Mobile App</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 414px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .nav { display: flex; justify-content: space-around; background: white; padding: 10px 0; position: fixed; bottom: 0; width: 100%; max-width: 414px; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); }
        .nav-item { text-align: center; padding: 8px; cursor: pointer; }
        .nav-item.active { color: #0ea5e9; }
        .screen { padding: 20px 16px 80px; }
        .banner { 
            background-image: url('https://seaboorentalboat.com/attached_assets/yacht_di_lusso_con_arredamento_elegante_ospiti_che_sorseggiano_champagne_relax_su_lettini_equipaggi_dc90zut0xpz751w55lnk_0_1754632540760.png');
            background-size: cover; 
            background-position: center; 
            height: 200px; 
            border-radius: 12px; 
            margin-bottom: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white;
            position: relative;
        }
        .banner::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(30, 64, 175, 0.3);
            border-radius: 12px;
        }
        .banner-content { position: relative; z-index: 1; text-align: center; }
        .banner h2 { margin: 0 0 8px 0; font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .banner p { margin: 0; font-size: 14px; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚓ SeaBoo Mobile</h1>
            <p>La tua app per noleggio barche</p>
        </div>
        
        <div class="screen" id="ormeggio-screen">
            <div class="banner">
                <div class="banner-content">
                    <div style="font-size: 36px; margin-bottom: 12px;">⚓</div>
                    <h2>Servizi Ormeggio Premium</h2>
                    <p>Scopri i migliori porti e marine per la tua imbarcazione</p>
                </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 16px 0; color: #1f2937;">🏛️ Porto di Civitavecchia</h3>
                <p style="color: #6b7280; margin: 0 0 12px 0;">Il porto principale del Lazio con servizi completi</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #10b981; font-weight: 600;">15 posti disponibili</span>
                    </div>
                    <div style="color: #1e40af; font-weight: 700; font-size: 18px;">€35/notte</div>
                </div>
                <button style="background: #0ea5e9; color: white; border: none; padding: 12px 24px; border-radius: 8px; width: 100%; margin-top: 12px; font-weight: 600; cursor: pointer;">
                    Prenota Ormeggio
                </button>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 16px 0; color: #1f2937;">⚓ Marina di Gaeta</h3>
                <p style="color: #6b7280; margin: 0 0 12px 0;">Marina moderna con tutti i comfort</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #10b981; font-weight: 600;">8 posti disponibili</span>
                    </div>
                    <div style="color: #1e40af; font-weight: 700; font-size: 18px;">€42/notte</div>
                </div>
                <button style="background: #0ea5e9; color: white; border: none; padding: 12px 24px; border-radius: 8px; width: 100%; margin-top: 12px; font-weight: 600; cursor: pointer;">
                    Prenota Ormeggio
                </button>
            </div>
        </div>
        
        <div class="nav">
            <div class="nav-item">
                <div>🏠</div>
                <div style="font-size: 12px;">Home</div>
            </div>
            <div class="nav-item active">
                <div>⚓</div>
                <div style="font-size: 12px;">Ormeggio</div>
            </div>
            <div class="nav-item">
                <div>🌊</div>
                <div style="font-size: 12px;">Esperienze</div>
            </div>
            <div class="nav-item">
                <div>⚙️</div>
                <div style="font-size: 12px;">Servizi</div>
            </div>
            <div class="nav-item">
                <div>👤</div>
                <div style="font-size: 12px;">Profilo</div>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

const server = createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SeaBoo Mobile app running on http://localhost:${PORT}`);
});