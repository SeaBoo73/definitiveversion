# 📲 PASSAGGI ESATTI per caricare SeaBoo su App Store

## DOVE ESEGUIRE I COMANDI
Apri il **terminale di Replit** (in basso) e vai nella cartella mobile:

```bash
cd mobile
```

## STEP 1: LOGIN EXPO 
```bash
npx eas login
```
**Cosa inserire:**
- Email o username del tuo account Expo
- Password

**Se non hai account Expo:**
1. Vai su expo.dev 
2. Registrati gratis
3. Torna qui e fai login

## STEP 2: AVVIA BUILD iOS
```bash
./build-seaboo-app-store.sh
```

**Tempo:** 15-20 minuti
**Dove vedere progresso:** expo.dev > Projects > seaboo-mobile > Builds

## STEP 3: DOWNLOAD BUILD (quando pronto)
Sul sito expo.dev:
1. Vai su Projects
2. Clicca "seaboo-mobile" 
3. Sezione "Builds"
4. Clicca "Download" quando completato

## STEP 4: CARICA SU APP STORE
```bash
npx eas submit --platform ios
```

**OPPURE manualmente:**
1. Vai su appstoreconnect.apple.com
2. Apri app "Transporter" 
3. Carica file .ipa scaricato

## ACCOUNT NECESSARI
- ✅ Account Expo (gratis) - per il build
- ✅ Account Apple Developer (€99/anno) - per pubblicare

## RISULTATO FINALE
App SeaBoo v1.0.1 sull'Apple App Store identica a quella nello screenshot.