#!/bin/bash

echo "🏪 === SETUP ACCOUNT DEVELOPER SEAGO ==="
echo ""
echo "📱 App: SeaGO - Noleggio Barche"
echo "🆔 Bundle: com.seago.mobile"
echo ""

echo "📋 ACCOUNT DEVELOPER RICHIESTI:"
echo ""

echo "🍎 APPLE DEVELOPER ACCOUNT"
echo "   💰 Costo: $99/anno (€90 circa)"
echo "   ⏰ Tempo: 24-48 ore approvazione"
echo "   🔗 Link: https://developer.apple.com/programs/"
echo "   📋 Documenti: Carta d'identità"
echo ""

echo "🤖 GOOGLE PLAY DEVELOPER ACCOUNT"
echo "   💰 Costo: $25 una tantum (€23 circa)"
echo "   ⏰ Tempo: Immediato"
echo "   🔗 Link: https://play.google.com/console/signup"
echo "   📋 Requisiti: Account Google"
echo ""

echo "💡 ISTRUZIONI PASSO-PASSO:"
echo ""

echo "1️⃣ APPLE DEVELOPER:"
echo "   • Vai su https://developer.apple.com/programs/"
echo "   • Clicca 'Enroll'"
echo "   • Scegli 'Individual' (persona) o 'Organization' (azienda)"
echo "   • Compila i dati personali"
echo "   • Paga $99 con carta di credito"
echo "   • Attendi email di approvazione (24-48h)"
echo "   • Annota il TEAM ID dalla email"
echo ""

echo "2️⃣ GOOGLE PLAY CONSOLE:"
echo "   • Vai su https://play.google.com/console/signup"
echo "   • Accedi con account Google"
echo "   • Accetta i termini"
echo "   • Paga $25 con carta di credito"
echo "   • Compila profilo sviluppatore"
echo "   • Accesso immediato alla console"
echo ""

echo "3️⃣ DOPO SETUP (quando hai entrambi gli account):"
echo "   • Esegui: ./configure-accounts.sh"
echo "   • Poi: ./build-stores.sh"
echo "   • Infine: ./deploy-stores.sh"
echo ""

echo "📞 SUPPORTO:"
echo "   🍎 Apple: https://developer.apple.com/support/"
echo "   🤖 Google: https://support.google.com/googleplay/android-developer"
echo ""

echo "⏰ TIMELINE TOTALE:"
echo "   📅 Oggi: Registrazione account (2-3 ore)"
echo "   📅 Domani: Approvazione Apple + configurazione"
echo "   📅 Prossima settimana: App LIVE sui store! 🎉"
echo ""

read -p "Hai completato la registrazione di entrambi gli account? (y/n): " accounts_ready
if [[ $accounts_ready == "y" ]]; then
    echo ""
    echo "✅ Perfetto! Ora configura gli account:"
    echo "   ./configure-accounts.sh"
else
    echo ""
    echo "📋 Completa prima la registrazione degli account:"
    echo "   🍎 Apple Developer: https://developer.apple.com/programs/"
    echo "   🤖 Google Play: https://play.google.com/console/signup"
    echo ""
    echo "💰 Costi totali: $124 (€113 circa)"
    echo "   • Apple: $99/anno"
    echo "   • Google: $25 una tantum"
fi

echo ""
echo "📖 Leggi DEVELOPER_ACCOUNTS_SETUP.md per guida completa"