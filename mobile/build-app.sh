#!/bin/bash

echo "📱 Creazione app SeaGO per download..."

# Build APK per Android
echo "🤖 Creazione APK Android..."
npx eas build --platform android --profile preview --local

# Build per iOS (solo su Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Creazione app iOS..."
    npx eas build --platform ios --profile preview --local
else
    echo "⚠️  Build iOS disponibile solo su Mac"
fi

echo "✅ App create! Controlla la cartella build/"