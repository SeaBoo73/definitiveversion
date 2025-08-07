# 📱 SeaBoo Mobile - Anteprima App

## 🔍 3 MODI PER VEDERE L'APP IN ANTEPRIMA

### 1. 📱 EXPO GO APP (PIÙ SEMPLICE)
**Per vedere subito su smartphone**

1. **Scarica Expo Go**
   - iOS: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Avvia preview dal computer**
   ```bash
   cd mobile
   npx expo start
   ```

3. **Scansiona QR Code**
   - Apri Expo Go sul telefono
   - Scansiona il QR code che appare nel terminale
   - L'app SeaBoo si aprirà direttamente sul tuo dispositivo!

### 2. 🌐 EXPO WEB (NEL BROWSER)
**Per vedere subito nel browser**

```bash
cd mobile
npx expo install
npx expo start --web
```

L'app si aprirà automaticamente nel browser come PWA mobile.

### 3. 📋 ANTEPRIMA CODICE
**Vedi come è strutturata l'app**

L'app SeaBoo mobile include:

#### 🏠 **5 Schermate Principali**
- **Esplora**: Ricerca barche con filtri
- **Ormeggio**: Servizi portuali e ormeggi  
- **Esperienze**: Tour ed escursioni
- **Servizi**: Meteo, carburante, assistenza
- **Profilo**: Account utente e impostazioni

#### 🎨 **Design Features**
- **Navigazione bottom tab** con icone intuitive
- **Header blu SeaBoo** con logo aziendale
- **Cards moderne** per barche ed esperienze
- **Colori brand**: Blu oceano (#0ea5e9) e gradienti
- **Font ottimizzati** per leggibilità mobile

#### ⚡ **Funzionalità Avanzate**
- **Geolocalizzazione** per barche vicine
- **Chat integrata** con proprietari
- **Pagamenti Stripe** sicuri
- **Notifiche push** per prenotazioni
- **Modalità offline** per info essenziali

## 🚀 COMANDI RAPIDI

### Avvio Standard
```bash
cd mobile
npx expo start
```

### Solo Web Browser
```bash
cd mobile
npx expo start --web
```

### Solo Android (con emulatore)
```bash
cd mobile
npx expo start --android
```

### Solo iOS (con simulatore)
```bash
cd mobile
npx expo start --ios
```

## 📱 STRUTTURA APP

```
SeaBoo Mobile
├── 🏠 Home (Esplora)
│   ├── Ricerca barche
│   ├── Categorie (yacht, gommoni, vela...)
│   └── Barche in evidenza
├── ⚓ Ormeggio
│   ├── Cerca ormeggi disponibili
│   ├── Tariffe pontili/boe
│   └── Prenotazione posto barca
├── ✨ Esperienze
│   ├── Tour guidati
│   ├── Charter lusso
│   └── Esperienze gourmet
├── 🛠️ Servizi
│   ├── Meteo marino
│   ├── Prezzi carburante
│   ├── Info porti
│   └── Assistenza AI
└── 👤 Profilo
    ├── I miei dati
    ├── Prenotazioni
    ├── Impostazioni
    └── Aiuto
```

## 💡 CONSIGLI PER L'ANTEPRIMA

### Per Test Completo
1. **Usa Expo Go** per esperienza nativa reale
2. **Testa su dispositivi diversi** (phone/tablet)
3. **Prova tutte le sezioni** della navigazione
4. **Verifica responsive design** girando schermo

### Per Demo Clienti
1. **Usa browser web** per presentazioni
2. **Attiva modalità sviluppatore** per simulare dispositivi
3. **Registra screen recording** per video demo

L'app è completamente funzionante e pronta per essere testata! 🚀