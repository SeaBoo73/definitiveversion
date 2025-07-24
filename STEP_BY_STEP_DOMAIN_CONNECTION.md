# 🔗 Collegamento Dominio seagorentalboat.com - Guida Passo-Passo

## 1️⃣ ACCESSO AL DEPLOYMENT REPLIT

1. **Vai alla sezione "Deployments"** nel tuo progetto Replit
2. **Clicca sul deployment attivo** (quello che hai già creato)
3. **Cerca la tab "Domains"** o il pulsante "Add Custom Domain"

## 2️⃣ AGGIUNTA DOMINIO PERSONALIZZATO

1. **Clicca "Add Custom Domain"** o "Connect Domain"
2. **Inserisci**: `seagorentalboat.com`
3. **Clicca "Add Domain"** o "Connect"
4. **Replit ti mostrerà le istruzioni DNS specifiche**

## 3️⃣ CONFIGURAZIONE DNS (Dal tuo provider dominio)

**Replit ti fornirà qualcosa tipo:**

```
Record Type: A
Name: @
Value: 147.185.221.23 (esempio)
TTL: 300

Record Type: CNAME
Name: www
Value: seagorentalboat-tuonome.replit.app
TTL: 300
```

**Nel pannello del tuo provider DNS:**
1. **Aggiungi Record A**: `@` → `[IP fornito da Replit]`
2. **Aggiungi Record CNAME**: `www` → `[URL fornito da Replit]`
3. **Salva le modifiche DNS**

## 4️⃣ VERIFICA COLLEGAMENTO

**Attendi 5-60 minuti, poi verifica:**
- ✅ `seagorentalboat.com` apre la piattaforma SeaGO
- ✅ `www.seagorentalboat.com` funziona
- ✅ HTTPS è attivo automaticamente
- ✅ `seagorentalboat.com/sitemap.xml` mostra il sitemap
- ✅ Tutte le funzionalità sono operative

## 5️⃣ OTTIMIZZAZIONE SEO FINALE (Opzionale)

**Per massime performance SEO:**
1. In "Secrets" Replit: aggiungi `VITE_CUSTOM_DOMAIN` = `seagorentalboat.com`
2. Rebuild progetto: `npm run build`
3. Il sistema userà automaticamente il dominio nelle meta tags

## 🎯 RISULTATO FINALE

- **URL Pubblico**: `https://seagorentalboat.com`
- **SEO Completo**: Keywords "boat rental", "noleggio barche Italia"
- **Structured Data**: Automaticamente su dominio personalizzato
- **Certificato SSL**: Gestito automaticamente da Replit
- **Performance**: Ottimizzata per settore marittimo

Il dominio è perfetto per posizionamento internazionale nel settore boat rental!