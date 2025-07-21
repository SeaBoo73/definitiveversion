#!/bin/bash

# Script per installare le dipendenze React Native senza conflitti

echo "🚀 Installazione SeaGO Mobile App..."

# Rimuovi node_modules esistenti
rm -rf node_modules package-lock.json

# Installa con legacy peer deps per evitare conflitti
npm install --legacy-peer-deps

echo "✅ Installazione completata!"
echo "🎯 Avvia l'app con: npx expo start"