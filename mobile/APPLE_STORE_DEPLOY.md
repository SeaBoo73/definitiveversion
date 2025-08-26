# 🍎 Deploy SeaBoo su Apple App Store

## VERSIONE DA BUILDARE
Questa guida è per buildare **esattamente la versione mobile** con sfondo barca a vela che vedi nell'anteprima.

## STEP 1: LOGIN EAS
```bash
cd mobile
npx eas login
```
Usa le credenziali del tuo account Expo.

## STEP 2: AVVIA BUILD iOS
```bash
./build-seaboo-app-store.sh
```

OPPURE manualmente:
```bash
npx eas build --platform ios --profile production
```

## STEP 3: MONITORAGGIO BUILD
- Il build richiede 15-20 minuti
- Puoi monitorarlo su: https://expo.dev
- Riceverai una notifica quando è pronto

## STEP 4: DOWNLOAD AUTOMATICO
Il file .ipa sarà scaricabile direttamente da Expo:
1. Vai su expo.dev → Projects → seaboo-mobile → Builds
2. Clicca "Download" quando il build è completato

## STEP 5: UPLOAD SU APP STORE
### Opzione A - Automatico (Consigliato)
```bash
npx eas submit --platform ios
```

### Opzione B - Manuale
1. Scarica il file .ipa
2. Apri l'app "Transporter" di Apple
3. Carica il file .ipa

## APP STORE CONNECT
Vai su: https://appstoreconnect.apple.com

### Informazioni App
- **Nome**: SeaBoo - Noleggio Barche
- **Bundle ID**: com.seaboo.mobile
- **Categoria**: Travel
- **Descrizione**: La piattaforma leader per il noleggio barche in Italia

### Metadati Richiesti
- Screenshot iPhone (6.7", 6.5", 5.5")
- Screenshot iPad (12.9", 11")
- Icona app (1024x1024)
- Descrizione marketing
- Keywords: barca, noleggio, yacht, mare, charter

## TEMPI
- **Build**: 15-20 minuti
- **Review Apple**: 24-48 ore
- **Pubblicazione**: Immediata dopo approvazione

## NOTE IMPORTANTI
- Questa versione include il nuovo design con sfondo barca a vela
- AuthScreen con cornice grigia per "Accesso Rapido"
- Autenticazione smart Facebook/Google/Apple
- Supporto iPad completo