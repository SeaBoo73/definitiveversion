#!/bin/bash

echo "🏪 === BUILD PER APP STORE ===" 
echo "Preparazione SeaGO per distribuzione..."

# Verifica EAS CLI
if ! command -v eas &> /dev/null; then
    echo "📦 Installazione EAS CLI..."
    npm install -g @expo/cli eas-cli
fi

echo ""
echo "🔧 Setup iniziale (una sola volta):"
echo "1. Crea account Apple Developer (€99/anno)"
echo "2. Crea account Google Play Console (€25 una tantum)"
echo "3. Configura EAS: npx eas build:configure"
echo ""

read -p "Hai completato il setup? (y/n): " setup
if [[ $setup != "y" ]]; then
    echo "❌ Completa il setup prima di continuare"
    echo ""
    echo "📋 PASSI RICHIESTI:"
    echo "1. Account Apple Developer: https://developer.apple.com"
    echo "2. Account Google Play: https://play.google.com/console"
    echo "3. Configura EAS: npx eas build:configure"
    exit 1
fi

echo ""
echo "🚀 Avvio build per store..."

# Build Android per Google Play
echo "🤖 Build Android per Google Play Store..."
npx eas build --platform android --profile production

# Build iOS per App Store (se su Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Build iOS per Apple App Store..."
    npx eas build --platform ios --profile production
else
    echo "⚠️  Build iOS disponibile solo su Mac"
    echo "   Usa GitHub Actions o servizio cloud per iOS"
fi

echo ""
echo "✅ BUILD COMPLETATI!"
echo ""
echo "📱 PROSSIMI PASSI:"
echo "1. Scarica i file build da EAS"
echo "2. Carica su App Store Connect (iOS)"
echo "3. Carica su Google Play Console (Android)"
echo "4. Compila metadati e screenshot"
echo "5. Sottoponi per review"
echo ""
echo "📋 Leggi store-config.md per dettagli completi"