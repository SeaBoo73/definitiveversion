# 🚀 Come avviare l'app mobile SeaBoo

## Metodo 1: Expo Go (Veloce - 5 minuti)

### Passo 1: Installa Expo Go
- **iPhone**: Scarica "Expo Go" dall'App Store
- **Android**: Scarica "Expo Go" da Google Play Store

### Passo 2: Avvia il server
```bash
cd mobile
npm install
npx expo start
```

### Passo 3: Scansiona il QR Code
- Apri Expo Go sul telefono
- Scansiona il QR Code che appare nel terminale
- L'app si caricherà automaticamente

## Metodo 2: Simulatore (Sviluppo)

### iPhone Simulator (Mac)
```bash
npx expo start --ios
```

### Android Emulator
```bash
npx expo start --android
```

## Metodo 3: App Build (Produzione)

### Android APK
```bash
npx expo build:android
```

### iOS IPA
```bash
npx expo build:ios
```

## Caratteristiche dell'app

✅ **Logo integrato** - Il tuo logo SeaBoo nell'header
✅ **Navigazione nativa** - Esperienza mobile ottimizzata
✅ **Autenticazione** - Login con credenziali esistenti
✅ **Lista barche** - Visualizzazione responsive
✅ **Dettagli barca** - Galleria immagini native
✅ **Dashboard proprietario** - Gestione completa

## Credenziali di test

- **Email**: owner@test.com
- **Password**: password123

## Prossimi passi

1. Test dell'app mobile
2. Aggiunta funzionalità native (GPS, camera)
3. Pubblicazione su App Store/Play Store
4. Notifiche push