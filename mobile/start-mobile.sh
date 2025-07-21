#!/bin/bash

echo "📱 Avvio SeaGO Mobile App"
echo "=========================="

# Controlla se Expo CLI è installato
if ! command -v npx expo &> /dev/null; then
    echo "📦 Installazione Expo CLI..."
    npm install -g @expo/cli
fi

echo "🚀 Avvio app mobile SeaGO..."
echo "📱 App disponibile su:"
echo "   - Android: Scansiona QR code con Expo Go"
echo "   - iOS: Scansiona QR code con fotocamera"
echo "   - Web: Aprirà automaticamente nel browser"
echo ""

npx expo start --web