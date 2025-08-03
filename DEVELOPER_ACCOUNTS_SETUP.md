# 📱 SETUP ACCOUNT DEVELOPER - SEAGO MOBILE

## 🍎 APPLE DEVELOPER ACCOUNT

### 📋 Requisiti
- **Costo**: $99/anno (circa €90)
- **Tempo setup**: 24-48 ore per approvazione
- **Documenti richiesti**: Carta d'identità valida

### 🔗 Procedura Completa
1. **Vai su**: https://developer.apple.com/programs/
2. **Clicca**: "Enroll" 
3. **Scegli**: "Individual" (per persone fisiche) o "Organization" (per aziende)
4. **Compila modulo** con i tuoi dati personali
5. **Verifica identità** (possono richiedere documenti)
6. **Paga** $99 con carta di credito
7. **Attendi approvazione** (24-48 ore)

### 📧 Email di Conferma
Riceverai email di benvenuto con:
- **Team ID** (servirà per il build)
- **Accesso ad App Store Connect**
- **Certificati di sviluppo**

---

## 🤖 GOOGLE PLAY DEVELOPER ACCOUNT

### 📋 Requisiti  
- **Costo**: $25 una tantum (circa €23)
- **Tempo setup**: Immediato
- **Account Google** richiesto

### 🔗 Procedura Completa
1. **Vai su**: https://play.google.com/console/signup
2. **Accedi** con il tuo account Google
3. **Accetta** i termini del Google Play Developer Distribution Agreement
4. **Paga** $25 con carta di credito
5. **Compila profilo** sviluppatore
6. **Verifica identità** se richiesto
7. **Accesso immediato** alla Play Console

---

## 🔧 CONFIGURAZIONE SEAGO

### Dopo Setup Apple Developer

#### 1. Ottieni Team ID
```bash
# Il Team ID si trova in:
# Apple Developer → Account → Membership Details
# Esempio: ABC123DEF4
```

#### 2. Aggiorna EAS Configuration
```bash
cd mobile
# Crea/aggiorna eas.json con il tuo Team ID
```

#### 3. Genera Certificati
```bash
# EAS gestirà automaticamente i certificati
npx eas credentials
```

### Dopo Setup Google Play

#### 1. Crea App su Play Console
- **Nome app**: SeaGO - Noleggio Barche
- **Categoria**: Travel & Local
- **Lingua**: Italiano
- **Paese**: Italia

#### 2. Configura Store Listing
- **Descrizione breve**: "La piattaforma leader per il noleggio barche in Italia"
- **Descrizione completa**: [Usa quella già preparata]
- **Screenshot**: [Da preparare dall'app]

---

## 🚀 BUILD E DEPLOY AUTOMATICO

### Script Già Pronti
Una volta completati gli account, usa:

```bash
cd mobile

# 1. Build per entrambi gli store
./build-stores.sh

# 2. Deploy automatico (dopo build)
./deploy-stores.sh
```

### Build Process
1. **EAS Build**: Crea file .ipa (iOS) e .aab (Android)
2. **Download**: File pronti per upload
3. **Upload iOS**: Su App Store Connect
4. **Upload Android**: Su Google Play Console

---

## 📝 METADATI STORE (GIÀ PREPARATI)

### App Store (iOS)
- **Nome**: SeaGO - Noleggio Barche
- **Sottotitolo**: Scopri barche in tutta Italia
- **Parole chiave**: noleggio barche, yacht, charter, mare, vacanze
- **Categoria**: Travel
- **Età**: 4+ (per tutti)

### Google Play (Android)  
- **Titolo**: SeaGO - Noleggio Barche
- **Descrizione breve**: La piattaforma leader per il noleggio barche in Italia
- **Categoria**: Travel & Local
- **Target**: Generale

---

## 📸 ASSET RICHIESTI (GIÀ PRONTI)

### Icone App
- ✅ **Icon.png** (1024x1024) - Già creato
- ✅ **Adaptive icon** (Android) - Già creato
- ✅ **Splash screen** - Già configurato

### Screenshot Store (Da Creare)
Dovrai fare questi screenshot dall'app:

#### iPhone (richiesti)
- 6.7" (iPhone 14 Pro Max): 1290x2796
- 6.5" (iPhone 11 Pro Max): 1242x2688  
- 5.5" (iPhone 8 Plus): 1242x2208

#### Android (richiesti)
- Phone: 1080x1920 minimo
- Tablet: 1200x1920 minimo

---

## ⏰ TIMELINE COMPLETA

### Oggi
1. **Registra account Apple** ($99) - 2 ore
2. **Registra account Google Play** ($25) - 30 minuti
3. **Attesa approvazione Apple** - 24-48 ore

### Domani/Dopodomani (dopo approvazione)
4. **Configura EAS con Team ID** - 30 minuti
5. **Build app con script** - 30 minuti  
6. **Upload su store** - 1 ora
7. **Compila metadati** - 2 ore
8. **Submit per review** - 15 minuti

### Settimana Prossima
9. **Review Apple** - 3-7 giorni
10. **Review Google** - 1-3 giorni
11. **App LIVE** sui store! 🎉

---

## 💡 CONSIGLI UTILI

### Per Apple Developer
- Usa la stessa email del tuo Apple ID
- Tieni pronto documento d'identità
- La verifica può richiedere una chiamata

### Per Google Play  
- Usa account Google personale o aziendale
- Backup del recovery code
- Policy privacy richiesta (la creeremo)

### Generale
- **Non cambiare** Bundle ID dopo il setup
- **Salva** tutti gli ID e certificati
- **Backup** delle credenziali

---

## 🆘 SUPPORTO

Se hai problemi durante il setup:

1. **Apple Developer Support**: https://developer.apple.com/support/
2. **Google Play Support**: https://support.google.com/googleplay/android-developer
3. **EAS Documentation**: https://docs.expo.dev/eas/

---

## ✅ CHECKLIST SETUP

### Apple Developer Account
- [ ] Registrazione completata
- [ ] Pagamento $99 effettuato  
- [ ] Email di conferma ricevuta
- [ ] Team ID annotato
- [ ] Accesso ad App Store Connect verificato

### Google Play Developer Account  
- [ ] Registrazione completata
- [ ] Pagamento $25 effettuato
- [ ] Profilo sviluppatore completato
- [ ] Accesso a Play Console verificato
- [ ] Prima app creata

### Pronto per Build
- [ ] Entrambi gli account attivi
- [ ] Team ID configurato in EAS
- [ ] Script di build testati
- [ ] Asset e metadati preparati

**Quando completi questa checklist, l'app SeaGO sarà LIVE su App Store e Google Play! 🚀**