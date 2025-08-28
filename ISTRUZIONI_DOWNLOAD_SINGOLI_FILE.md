# 📱 SeaBoo iOS - Download File Singoli

## 🎯 COME SCARICARE I FILE SINGOLARMENTE

### 📋 FILE DA SCARICARE (click destro → Download):

#### **1. File di Configurazione:**
- `package-seaboo-ios.json` → rinomina in `package.json`
- `capacitor-seaboo.config.ts` → rinomina in `capacitor.config.ts`
- `tsconfig-seaboo.json` → rinomina in `tsconfig.json`
- `vite-seaboo.config.ts` → rinomina in `vite.config.ts`

#### **2. Cartelle dell'App:**
- Scarica la cartella `seaboo-ios-client` → rinomina in `client`
- Scarica la cartella `seaboo-ios-shared` → rinomina in `shared`

#### **3. File Istruzioni:**
- `ISTRUZIONI_DOWNLOAD_SINGOLI_FILE.md` (questo file)

### 🛠️ RICOSTRUZIONE SUL MAC

#### **Passo 1: Crea cartella principale**
```bash
mkdir ~/Desktop/SeaBoo-iOS-Ready
cd ~/Desktop/SeaBoo-iOS-Ready
```

#### **Passo 2: Posiziona i file scaricati**
```
SeaBoo-iOS-Ready/
├── package.json (da package-seaboo-ios.json)
├── capacitor.config.ts (da capacitor-seaboo.config.ts)
├── tsconfig.json (da tsconfig-seaboo.json)
├── vite.config.ts (da vite-seaboo.config.ts)
├── client/ (da seaboo-ios-client)
└── shared/ (da seaboo-ios-shared)
```

#### **Passo 3: Installa e configura**
```bash
npm install
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init
```
Quando richiesto:
- **App name:** SeaBoo
- **App ID:** it.seaboo.app

#### **Passo 4: Build iOS**
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

#### **Passo 5: Configura Xcode**
- **Bundle Identifier:** it.seaboo.app
- **Version:** 1.0.1
- **Build:** 3
- **Team:** Il tuo Apple Developer Account

#### **Passo 6: Upload App Store**
- **Product → Archive**
- **Organizer → Distribute App**

## ✅ RISULTATO
App iOS nativa con il tuo design aggiornato, pronta per l'App Store!

---
**Versione:** 1.0.1  
**Data:** 28 Agosto 2025