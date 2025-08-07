# 📱 SeaBoo Mobile App - Deployment

## 🚀 Avvio Immediato

```bash
cd mobile
./start-mobile.sh
```

## 📦 Opzioni di Distribuzione

### 1. **PWA Web Mobile** (Raccomandato per Replit)
```bash
npm run web
```
- ✅ Funziona immediatamente su tutti i dispositivi
- ✅ Installabile come app nativa dal browser
- ✅ Perfetto per test e demo

### 2. **Expo Go App** 
```bash
npm start
```
- ✅ Test su dispositivi reali iOS/Android
- ✅ QR code per installazione rapida
- ✅ Hot reload durante sviluppo

### 3. **Build Nativo** (Per distribuzione store)
```bash
# Android APK
npx eas build --platform android --profile preview

# iOS App (solo su Mac)
npx eas build --platform ios --profile preview
```

## 🎯 App Mobile Features

### Navigazione Completa (5 Sezioni)
- **Esplora**: Ricerca barche, categorie, barche in evidenza
- **Esperienze**: Tour guidati e esperienze premium  
- **Charter**: Opzioni charter con skipper/bareboat
- **Aiuto**: FAQ, contatti, assistenza clienti
- **Profilo**: Gestione utente, login, statistiche

### Screen Aggiuntivi
- **Dettaglio Barca**: Specifiche complete e prenotazione
- **Sistema Prenotazione**: Date, ospiti, servizi extra
- **Autenticazione**: Login/registrazione completi

### Design Nativo
- Navigazione bottom tab iOS/Android
- Icone Ionicons per esperienza nativa
- Design responsive con SafeAreaView
- Colori SeaBoo brand (#0ea5e9)

## 🔗 Integrazione con Backend

L'app mobile si connette automaticamente al backend SeaBoo esistente:
- API booking e pagamenti
- Sistema autenticazione
- Database PostgreSQL
- Chat real-time

## 📱 Test su Dispositivi

1. **Avvia l'app**: `./start-mobile.sh`
2. **Scansiona QR code** con:
   - **Android**: App Expo Go
   - **iOS**: Fotocamera iPhone/iPad
3. **Test completo** su dispositivo reale

## 🚀 Deployment Finale

Per distribuzione store:
```bash
# Setup EAS
npx eas build:configure

# Build production
npx eas build --platform all
```

L'app SeaBoo mobile è pronta per essere utilizzata!