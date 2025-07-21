#!/bin/bash

echo "📱 Creazione PWA SeaGO (App installabile)..."

# Esporta come PWA
npx expo export --platform web --output-dir ./pwa-app

# Crea manifest per l'installazione
cat > ./pwa-app/manifest.json << EOL
{
  "name": "SeaGO - Noleggio Barche",
  "short_name": "SeaGO",
  "description": "Prenota barche e yacht in Italia",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0ea5e9",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOL

# Aggiorna index.html per PWA
sed -i 's/<head>/<head><link rel="manifest" href="\/manifest.json"><meta name="theme-color" content="#0ea5e9">/' ./pwa-app/index.html

echo "✅ PWA creata con successo!"
echo "📱 L'app può essere installata su telefono visitando la directory pwa-app"
echo "🌐 Apri pwa-app/index.html e clicca 'Aggiungi alla schermata Home'"