# PULIZIA VERSIONI MOBILE SEAGO

## SITUAZIONE ATTUALE
Hai 3 versioni dell'app mobile create durante lo sviluppo:

### ✅ `mobile/` - VERSIONE PRINCIPALE (DA TENERE)
- React Native 0.73.2 + Expo 50.0.0
- Configurazione completa per App Store
- EAS Build configurato
- Script automatici di build
- **QUESTA È L'APP DA PUBBLICARE**

### ⚠️ `SeaBoo-Mobile/` - VERSIONE SPERIMENTALE 
- React Native 0.79.5 + Expo 53.0.20
- Versione di test più recente
- Solo base minima
- **PUOI RIMUOVERE**

### ⚠️ `mobile/SeaBooNative/` - VERSIONE BACKUP
- React Native puro senza Expo
- Versione semplificata
- **PUOI RIMUOVERE**

## RACCOMANDAZIONE

**USA SOLO `mobile/` per pubblicazione su store!**

### Vantaggi versione `mobile/`:
- Configurazione EAS Build completa
- Script automatici per build store
- Bundle ID configurato: `com.seago.mobile`
- Permessi iOS/Android impostati
- Icone e splash screen pronti
- Documentazione completa

## AZIONI SUGGERITE

### 1. Conferma versione principale
```bash
cd mobile
npm install
npm start
```

### 2. Rimuovi versioni duplicate (opzionale)
```bash
# Backup prima di rimuovere
mv SeaBoo-Mobile SeaBoo-Mobile-backup
mv mobile/SeaBooNative mobile/SeaBooNative-backup

# O rimuovi completamente
rm -rf SeaBoo-Mobile
rm -rf mobile/SeaBooNative
```

### 3. Procedi con pubblicazione
```bash
cd mobile
./build-stores.sh
```

## PROSSIMI PASSI

1. **Setup account developer** (Apple + Google)
2. **Build automatico** con script esistente
3. **Upload su store** 
4. **Pubblicazione**

**La tua app principale in `mobile/` è già pronta per gli store!**