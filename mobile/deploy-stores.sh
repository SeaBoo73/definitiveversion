#!/bin/bash

echo "🚀 SeaGO - Deploy Script per Apple e Google Store"
echo "================================================"

# Controllo se siamo nella directory mobile
if [ ! -f "app.json" ]; then
    echo "❌ Errore: Esegui questo script dalla cartella mobile/"
    exit 1
fi

echo "📱 Configurazione app SeaGO..."
echo "Nome: SeaGO - Noleggio Barche"
echo "Bundle ID iOS: com.seago.mobile"
echo "Package Android: com.seago.mobile"
echo ""

echo "🔧 Step 1: Login Expo (se necessario)"
echo "Comando: npx expo login"
echo ""

echo "⚙️ Step 2: Configura EAS Build"
echo "Comando: npx eas build:configure"
echo ""

echo "🍎 Step 3: Build iOS per App Store"
echo "Comando: npx eas build --platform ios --profile production"
echo ""

echo "🤖 Step 4: Build Android per Google Play"
echo "Comando: npx eas build --platform android --profile production"
echo ""

echo "📋 Prossimi passaggi dopo i build:"
echo "1. Apple App Store Connect: https://appstoreconnect.apple.com"
echo "2. Google Play Console: https://play.google.com/console"
echo ""

echo "💡 Account richiesti:"
echo "- Apple Developer: €99/anno"
echo "- Google Play Console: €25 una tantum"
echo ""

echo "✅ La tua app SeaGO è configurata e pronta!"
echo "Leggi STORE_DEPLOYMENT_GUIDE.md per dettagli completi"