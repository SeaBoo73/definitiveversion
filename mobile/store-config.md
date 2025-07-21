# 📱 SeaGO - Configurazione Store

## 🍎 APPLE APP STORE

### Requisiti Apple Developer
1. **Account Apple Developer** (€99/anno)
   - Registrati su [developer.apple.com](https://developer.apple.com)
   - Verifica identità e pagamento

2. **Certificati iOS**
   ```bash
   # Configura certificati
   npx eas credentials
   ```

### Build iOS
```bash
# Setup EAS (una sola volta)
npx eas build:configure

# Build per App Store
npx eas build --platform ios --profile production
```

### Upload App Store
1. **App Store Connect**
   - Vai su [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Crea nuova app "SeaGO"
   - Carica build da EAS

2. **Metadati Store**
   - **Nome**: SeaGO - Noleggio Barche
   - **Descrizione**: La piattaforma leader per il noleggio barche in Italia
   - **Categoria**: Travel
   - **Parole chiave**: barche, noleggio, yacht, gommoni, charter
   - **Screenshots**: Obbligatori per iPhone e iPad

## 🤖 GOOGLE PLAY STORE

### Requisiti Google Play
1. **Account Google Play Console** (€25 una tantum)
   - Registrati su [play.google.com/console](https://play.google.com/console)
   - Verifica identità

2. **Keystore Android**
   ```bash
   # EAS genera automaticamente keystore
   npx eas credentials
   ```

### Build Android
```bash
# Build per Google Play
npx eas build --platform android --profile production
```

### Upload Google Play
1. **Google Play Console**
   - Crea nuova app "SeaGO"
   - Carica AAB file da EAS

2. **Store Listing**
   - **Titolo**: SeaGO - Noleggio Barche
   - **Descrizione breve**: Prenota barche in Italia
   - **Descrizione completa**: 
     ```
     Scopri e prenota le migliori barche in Italia con SeaGO!
     
     🚤 Migliaia di barche disponibili
     ⭐ Yacht, gommoni, barche a vela
     💳 Pagamenti sicuri con Stripe
     📅 Prenotazione facile
     💬 Chat con proprietari
     
     Naviga verso l'avventura con SeaGO!
     ```
   - **Categoria**: Maps & Navigation
   - **Screenshots**: Obbligatori per telefono e tablet

## 🚀 PROCESSO COMPLETO

### Passo 1: Setup Accounts
- [ ] Apple Developer Account (€99/anno)
- [ ] Google Play Console (€25 una tantum)

### Passo 2: Configurazione EAS
```bash
cd mobile
npm install -g @expo/cli
npx eas build:configure
```

### Passo 3: Build Production
```bash
# iOS (richiede Mac per test locale)
npx eas build --platform ios --profile production

# Android
npx eas build --platform android --profile production
```

### Passo 4: Asset Store
- **Icona app**: 1024x1024px (già configurata)
- **Screenshots**: iPhone, iPad, Android phone, tablet
- **Video preview**: Opzionale ma raccomandato

### Passo 5: Review Process
- **Apple**: 2-7 giorni review
- **Google**: 1-3 giorni review

## 📊 Metadati Ottimizzati

### Keywords (ASO)
- **Primarie**: barche, noleggio, yacht, charter
- **Secondarie**: gommoni, vela, motore, mare
- **Long-tail**: noleggio barche italia, charter yacht

### Descrizione Marketing
```
🚤 SEAGO - LA TUA PORTA SUL MARE

Scopri migliaia di barche in tutta Italia:
✅ Yacht di lusso
✅ Gommoni sportivi  
✅ Barche a vela
✅ Charter con equipaggio

🔒 SICURO E SEMPLICE
• Pagamenti protetti Stripe
• Recensioni verificate
• Chat diretta con proprietari
• Assistenza 24/7

📱 PRENOTA IN 3 CLICK
1. Scegli la barca
2. Seleziona date
3. Paga e naviga!

Unisciti a migliaia di navigatori che hanno scelto SeaGO.
```

## 💡 CONSIGLI PRO

### Ottimizzazione ASO
- Monitora ranking keywords
- A/B test icona e screenshots
- Raccogli recensioni positive
- Aggiorna regolarmente

### Marketing Launch
- Soft launch in Italia
- Campagne social media
- Influencer nautici
- Partnership marina/porti

La tua app SeaGO sarà pronta per conquistare gli store! 🚀