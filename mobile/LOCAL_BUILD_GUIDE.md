# 🏗️ BUILD LOCALE SENZA ACCOUNT EXPO

## PROBLEMA RISOLTO
Non serve account Expo. Usiamo il build locale.

## COMANDO SEMPLICE
```bash
cd mobile
npx expo build:ios --type archive
```

## ALTERNATIVA: EXPORT E BUILD MANUALE
```bash
npx expo export
```

Poi apri Xcode per compilare il progetto iOS.

## SE HAI XCODE
```bash
npx expo run:ios --configuration Release
```

## RISULTATO
File .ipa pronto per App Store senza account Expo necessario.