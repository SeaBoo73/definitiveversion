#!/bin/bash

echo "🏗️ === BUILD SEABOO PER APPLE APP STORE ==="
echo "Buildando la versione mobile con sfondo barca a vela..."
echo ""

# Verifica che siamo nella directory mobile
if [ ! -f "app.json" ]; then
    echo "❌ Errore: Esegui questo script dalla cartella mobile/"
    exit 1
fi

echo "📱 App da buildare:"
echo "- Nome: SeaBoo - Noleggio Barche"
echo "- Bundle ID: com.seaboo.mobile" 
echo "- Versione: 1.0.0"
echo "- Build Number: 2"
echo ""

# Controllo EAS Login
echo "🔐 Controllo login EAS..."
if npx eas whoami > /dev/null 2>&1; then
    echo "✅ Login EAS attivo"
    npx eas whoami
else
    echo "❌ Login EAS richiesto"
    echo "Esegui: npx eas login"
    echo "Poi rilancia questo script"
    exit 1
fi

echo ""
echo "🚀 Avvio build iOS per App Store..."
echo "⏱️ Tempo stimato: 15-20 minuti"
echo ""

# Build iOS Production per App Store
npx eas build --platform ios --profile production --non-interactive

echo ""
echo "✅ BUILD iOS COMPLETATO!"
echo ""
echo "📋 PROSSIMI PASSI:"
echo "1. Vai su: https://expo.dev/accounts/[your-account]/projects/seaboo-mobile/builds"
echo "2. Scarica il file .ipa quando è pronto"
echo "3. Caricalo su App Store Connect:"
echo "   - Usa Transporter app oppure"
echo "   - Comando: npx eas submit --platform ios"
echo ""
echo "🍎 App Store Connect: https://appstoreconnect.apple.com"
echo ""