#!/bin/bash

# SeaBoo iOS Build Configuration Script
# Team ID: DC866Q4KQV

echo "🚀 Configurazione build iOS per SeaBoo"
echo "Team ID: DC866Q4KQV"
echo "Bundle ID: com.seaboo.mobile"

# Build web assets
echo "📦 Building web assets..."
npm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync ios

# Update Xcode project with Team ID
echo "⚙️ Configurazione Team ID in Xcode project..."

# Navigate to iOS directory
cd ios/App

# Update project.pbxproj with Team ID
sed -i.bak 's/DEVELOPMENT_TEAM = "";/DEVELOPMENT_TEAM = "DC866Q4KQV";/g' App.xcodeproj/project.pbxproj

echo "✅ Configurazione completata!"
echo ""
echo "📱 Prossimi passi:"
echo "1. npx cap open ios"
echo "2. In Xcode: Product → Archive"
echo "3. Organizer → Distribute App → App Store Connect"
echo ""
echo "🎯 Ready for App Store submission!"