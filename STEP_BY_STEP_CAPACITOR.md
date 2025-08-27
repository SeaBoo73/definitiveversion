# 📱 PASSAGGI SEMPLICI - Capacitor per iOS

## PASSO 1: SCARICA E ESTRAI
```bash
# Scarica il file: seaboo-web-mobile-v1.0.1-appstore.tar.gz
# Poi sul tuo Mac:
tar -xzf seaboo-web-mobile-v1.0.1-appstore.tar.gz
cd seaboo-web-mobile
```

## PASSO 2: INSTALLA DIPENDENZE
```bash
npm install
```

## PASSO 3: INSTALLA CAPACITOR
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

## PASSO 4: INIZIALIZZA CAPACITOR
```bash
npx cap init "SeaBoo" "com.seaboo.mobile"
```

## PASSO 5: AGGIUNGI PIATTAFORMA iOS
```bash
npx cap add ios
```

## PASSO 6: BUILD WEB APP
```bash
npm run build
```

## PASSO 7: COPIA SU iOS
```bash
npx cap copy ios
```

## PASSO 8: APRI XCODE
```bash
npx cap open ios
```

## PASSO 9: BUILD PER APP STORE
In Xcode:
1. Seleziona "Any iOS Device"
2. Product > Archive
3. Distribute App > App Store Connect

FINE! La tua app sarà caricata sull'App Store.