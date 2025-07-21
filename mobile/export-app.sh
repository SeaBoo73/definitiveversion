#!/bin/bash

echo "📱 Esportazione app SeaGO per installazione..."

# Pulisci build precedenti
rm -rf dist/ .expo/

# Export dell'app per Android/iOS
echo "🚀 Esportazione in corso..."
npx expo export --platform web --output-dir ./dist

echo "✅ App esportata con successo!"
echo "📂 Trova i file in: mobile/dist/"
echo "🌐 Per testare: apri mobile/dist/index.html"

# Crea un semplice server per il test
echo "🔗 Avvio server di test..."
cd dist && python3 -m http.server 8080 &
echo "📱 Testa l'app su: http://localhost:8080"