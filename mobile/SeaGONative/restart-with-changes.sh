#!/bin/bash

echo "🔄 Riavviando il simulatore con le modifiche più recenti di AuthScreen..."

# Pulire la cache Metro
echo "📦 Pulizia cache Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

# Attendere un secondo per l'avvio del Metro
sleep 3

# Avviare il simulatore iOS con cache pulita
echo "🍎 Avvio simulatore iOS..."
xcrun simctl boot "iPhone 15 Pro" 2>/dev/null || echo "Simulatore già avviato"

# Installare l'app sul simulatore
echo "📱 Installazione app con modifiche..."
npx react-native run-ios --simulator="iPhone 15 Pro" --reset-cache

echo "✅ App avviata con le modifiche più recenti!"
echo "👆 Vai su Profilo → Accedi/Registrati → Accesso Smart per vedere l'AuthScreen aggiornato"