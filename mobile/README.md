# SeaGO Mobile App

App mobile nativa per la piattaforma SeaGO di noleggio barche.

## Tecnologie utilizzate

- **React Native** con **Expo**
- **TypeScript** per la sicurezza dei tipi
- **React Navigation** per la navigazione
- **AsyncStorage** per la persistenza locale
- **Native APIs** per fotocamera, GPS, notifiche

## Funzionalità principali

### ✅ Implementate
- Schermata principale con lista barche
- Autenticazione utente
- Dettagli barca con galleria immagini
- Dashboard proprietario
- Navigazione nativa ottimizzata

### 🔄 In sviluppo
- Sistema di prenotazione
- Integrazione pagamenti Stripe
- Mappa interattiva
- Chat messaging
- Notifiche push
- Fotocamera per documenti

## Come usare l'app

### Installazione

1. Installa Expo CLI:
```bash
npm install -g @expo/cli
```

2. Vai nella cartella mobile:
```bash
cd mobile
```

3. Installa le dipendenze:
```bash
npm install
```

4. Avvia l'app:
```bash
npx expo start
```

### Testing

**Credenziali di test:**
- Email: `owner@test.com`
- Password: `password123`

### Struttura del progetto

```
mobile/
├── App.tsx                 # Entry point dell'app
├── app.json               # Configurazione Expo
├── src/
│   ├── screens/          # Schermate dell'app
│   │   ├── HomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── BoatDetailsScreen.tsx
│   │   └── OwnerDashboardScreen.tsx
│   ├── services/         # Servizi e API
│   │   └── AuthContext.tsx
│   └── components/       # Componenti riutilizzabili
└── assets/              # Immagini e risorse
```

## Prossimi passi

1. **Completare le schermate mancanti**
2. **Integrare APIs complete**
3. **Aggiungere funzionalità native**
4. **Pubblicare su App Store/Play Store**

## Vantaggi dell'app nativa

- **Prestazioni ottimali** - Velocità nativa
- **Accesso completo al dispositivo** - Fotocamera, GPS, notifiche
- **Esperienza utente superiore** - Animazioni fluide
- **Funzionamento offline** - Dati locali
- **Distribuzione app store** - Visibilità e credibilità