# SeaBoo iOS Setup Guide - Risoluzione Problemi Xcode

## Problema Attuale
App.xcworkspace non apre correttamente il progetto in Xcode, probabilmente per file corrotti nel download.

## Soluzione Rapida - Ricostruzione Progetto

### Passo 1: Pulizia
```bash
cd ~/Desktop/SeaBoo-iOS
rm -rf ios/
rm -rf node_modules/
```

### Passo 2: Inizializza nuovo progetto Capacitor
```bash
npm init -y
npm install @capacitor/core @capacitor/ios @capacitor/cli
```

### Passo 3: Configura Capacitor
```bash
npx cap init SeaBoo com.seaboo.mobile
```

### Passo 4: Prepara app mobile
```bash
mkdir -p public
cp mobile-preview.html public/index.html
```

### Passo 5: Aggiungi piattaforma iOS
```bash
npx cap add ios
```

### Passo 6: Apri Xcode
```bash
npx cap open ios
```

## Alternativa - Download File Corretti
Se i file iOS sono corrotti, possiamo ricreare il progetto da zero mantenendo tutte le personalizzazioni SeaBoo.