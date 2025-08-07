# SeaBoo iOS Build Instructions

## ✅ Progetto Capacitor pronto per VoltBuilder

### File configurati:
- ✅ `voltbuilder.json` - Configurazione build
- ✅ `capacitor.config.ts` - Configurazione Capacitor 
- ✅ `ios/` - Progetto Xcode generato
- ✅ `dist/public/` - Build web ottimizzata

### Bundle ID configurato:
- **App ID:** `com.seago.mobile` (corrisponde ad App Store Connect)
- **App Name:** SeaBoo
- **Version:** 1.0.0

## 🚀 Prossimi passaggi per la build VoltBuilder:

### 1. Registrati su VoltBuilder
- Vai su https://volt.build/
- Crea account (15 giorni gratis)
- Piano consigliato: $15/mese

### 2. Prepara i certificati Apple
Nella cartella `certificates/` devi aggiungere:
- `development.mobileprovision`
- `distribution.mobileprovision` 
- `ios_development.p12`
- `ios_distribution.p12`

### 3. Upload progetto
- Comprimi l'intero progetto in ZIP
- Upload su VoltBuilder
- Avvia build iOS Release
- Scarica il file .ipa risultante

### 4. Upload su App Store Connect
- Usa Application Loader o Transporter
- Oppure VoltBuilder può farlo automaticamente

## ⚠️ Certificati necessari

I certificati li puoi ottenere da:
1. **Apple Developer Console** → Certificates, Identifiers & Profiles
2. **App Store Connect** → Certificati di distribuzione
3. **Xcode** (se disponibile) → Preferences → Accounts

## 🎯 Risultato finale
- File .ipa firmato pronto per App Store
- Upload automatico possibile
- App nativa iOS con la tua web app integrata