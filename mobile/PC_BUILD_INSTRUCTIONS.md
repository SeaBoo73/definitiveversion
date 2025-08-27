# 💻 BUILD SU PC - SeaBoo v1.0.1

## 📦 PACCHETTO AGGIORNATO
Scarica: `seaboo-mobile-v1.0.1-updated.tar.gz`

## 🚀 SETUP SUL TUO PC

### 1. Estrai il progetto
```bash
tar -xzf seaboo-mobile-v1.0.1-updated.tar.gz
cd mobile
```

### 2. Installa dipendenze
```bash
npm install
```

### 3. Setup iOS (su Mac)
```bash
cd ios && pod install && cd ..
```

### 4. Build per App Store
```bash
npx expo run:ios --configuration Release
```

OPPURE apri Xcode:
```bash
npx expo run:ios --configuration Release --device
```

## ✅ COSA INCLUDE QUESTA VERSIONE

- **Versione 1.0.1** (aggiornata)
- **Build Number 3**
- AuthScreen con cornice grigia "Accesso Rapido"
- Autenticazione smart Facebook/Google/Apple
- Supporto iPad completo
- Navigation completa con sfondo barca a vela
- Bundle ID: com.seaboo.mobile

## 📱 RISULTATO
File .ipa pronto per caricamento su App Store Connect.

## 🍎 UPLOAD APP STORE
1. Vai su appstoreconnect.apple.com
2. Carica il file .ipa generato
3. Compila metadati
4. Sottoponi per review

## 💡 NOTE
- Richiede macOS con Xcode installato
- Account Apple Developer attivo (€99/anno)
- Certificati iOS configurati