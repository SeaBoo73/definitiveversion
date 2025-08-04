#!/bin/bash

echo "🍎 === CONFIGURAZIONE APPLE DEVELOPER - SEAGO ==="
echo ""

# Verifica se l'utente ha completato la registrazione
read -p "Hai completato la registrazione Apple Developer e ricevuto l'email di conferma? (y/n): " registration_done

if [[ $registration_done != "y" ]]; then
    echo ""
    echo "❌ Completa prima la registrazione:"
    echo "   🔗 https://developer.apple.com/programs/"
    echo "   💰 Costo: $99/anno"
    echo "   ⏰ Tempo: 24-48 ore approvazione"
    echo ""
    echo "📖 Leggi APPLE_DEVELOPER_SETUP_GUIDE.md per aiuto"
    exit 1
fi

echo ""
echo "✅ Perfetto! Ora configuriamo SeaGO con il tuo account."
echo ""

# Richiedi Team ID
echo "📋 Inserisci il TEAM ID dall'email di Apple Developer:"
echo "   (Formato: ABC123DEF4 - 10 caratteri alfanumerici)"
read -p "Team ID: " team_id

# Valida Team ID
if [[ ! $team_id =~ ^[A-Z0-9]{10}$ ]]; then
    echo ""
    echo "❌ Team ID non valido. Deve essere 10 caratteri come: ABC123DEF4"
    echo ""
    echo "💡 Dove trovare il Team ID:"
    echo "   • Email di benvenuto Apple Developer"
    echo "   • https://developer.apple.com → Account → Membership"
    echo "   • App Store Connect → Users and Access"
    exit 1
fi

echo ""
echo "🔧 Configurazione SeaGO con Team ID: $team_id"

# Backup del file EAS esistente
if [[ -f "eas.json" ]]; then
    cp eas.json eas.json.backup
    echo "   ✅ Backup eas.json creato"
fi

# Aggiorna configurazione EAS con Team ID
cat > eas.json << EOF
{
  "cli": {
    "version": ">= 0.35.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "teamId": "$team_id"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "teamId": "$team_id"
      },
      "android": {}
    }
  }
}
EOF

echo "   ✅ eas.json aggiornato con Team ID"

# Aggiorna app.json con Team ID se necessario
if grep -q "teamId" app.json; then
    echo "   ✅ app.json già configurato"
else
    # Backup app.json
    cp app.json app.json.backup
    
    # Aggiunge teamId alla sezione iOS
    jq --arg teamId "$team_id" '.expo.ios.teamId = $teamId' app.json > app.json.tmp && mv app.json.tmp app.json
    echo "   ✅ app.json aggiornato con Team ID"
fi

echo ""
echo "✅ CONFIGURAZIONE COMPLETATA!"
echo ""
echo "📱 SeaGO è ora configurato per:"
echo "   🆔 Bundle ID: com.seago.mobile"
echo "   🍎 Team ID: $team_id"
echo "   📦 Versione: 1.0.0"
echo ""

# Verifica configurazione
echo "🔍 VERIFICA CONFIGURAZIONE:"
echo "   📄 EAS Build: $(cat eas.json | grep -o '"teamId": "[^"]*"' | head -1)"
echo "   📄 App JSON: $(cat app.json | grep -o '"teamId": "[^"]*"' || echo 'Team ID aggiunto')"
echo ""

echo "🚀 PROSSIMI PASSI:"
echo "   1. Registra Google Play Console ($25)"
echo "   2. Esegui: ./build-stores.sh"
echo "   3. Upload su App Store Connect"
echo ""

read -p "Vuoi procedere con Google Play Console ora? (y/n): " setup_google

if [[ $setup_google == "y" ]]; then
    echo ""
    echo "🤖 Aprendo guida Google Play Console..."
    echo "   🔗 https://play.google.com/console/signup"
    echo "   💰 Costo: $25 una tantum"
    echo ""
    echo "📖 Segui le istruzioni in DEVELOPER_ACCOUNTS_SETUP.md"
else
    echo ""
    echo "✅ Configurazione Apple completata!"
    echo "   Quando sei pronto: ./setup-google-play.sh"
fi

echo ""
echo "🎉 SeaGO è ora pronto per il build iOS! 🎉"