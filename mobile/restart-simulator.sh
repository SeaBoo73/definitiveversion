#!/bin/bash

echo "🔄 Riavviando il simulatore con le modifiche più recenti..."

# Step 1: Pulire la cache del Metro bundler
echo "📦 Pulizia cache Metro bundler..."
npx react-native start --reset-cache &
METRO_PID=$!

# Step 2: Ricompilare l'app iOS
echo "🍎 Ricompilazione app iOS..."
sleep 3
npx react-native run-ios --reset-cache --device="iPhone 15 Pro" || npx react-native run-ios --reset-cache

# Step 3: Se React Native fallisce, usa Expo
if [ $? -ne 0 ]; then
    echo "🔄 Fallback con Expo..."
    killall -9 node 2>/dev/null
    npx expo start --clear --ios
fi

echo "✅ Simulatore riavviato con successo!"