# 🌐 Collegare il Tuo Dominio Personalizzato a SeaBoo

## Passo 1: Configurazione nel Deployment Replit

1. **Vai alla sezione "Deployments"** nel tuo progetto Replit
2. **Clicca sul tuo deployment attivo**
3. **Cerca la sezione "Domains" o "Custom Domain"**
4. **Clicca "Add custom domain"**
5. **Inserisci il tuo dominio** (es: `seago.it` o `tuodominio.com`)

## Passo 2: Configurazione DNS

Replit ti fornirà le istruzioni DNS. Tipicamente:

**Per dominio principale (es: seago.it):**
```
Tipo: A
Nome: @
Valore: [IP fornito da Replit]
TTL: 300
```

**Per www (es: www.seago.it):**
```
Tipo: CNAME  
Nome: www
Valore: [dominio.replit.app fornito da Replit]
TTL: 300
```

## Passo 3: Ottimizzazione SEO per Dominio Personalizzato

1. **Aggiungi variabile ambiente:**
   - Vai in "Secrets" nel tuo progetto Replit
   - Aggiungi: `VITE_CUSTOM_DOMAIN` = `tuodominio.com`

2. **Rebuild progetto:**
   - Esegui `npm run build` per applicare il nuovo dominio
   - Il sistema SEO userà automaticamente il tuo dominio personalizzato

## Passo 4: Verifica Funzionamento

✅ **Controlla questi elementi:**
- [ ] Il dominio si apre correttamente
- [ ] HTTPS funziona automaticamente
- [ ] Tutte le pagine sono accessibili
- [ ] Sitemap è disponibile su `tuodominio.com/sitemap.xml`
- [ ] Robots.txt è disponibile su `tuodominio.com/robots.txt`

## Benefici SEO con Dominio Personalizzato:

🔍 **Migliore posizionamento:**
- URL brandizzato per autorità del dominio
- Structured data aggiornati automaticamente
- Meta tags ottimizzati per il tuo dominio
- Google Search Console configurabile

🚀 **Funzionalità Maritime complete:**
- Tutte le ottimizzazioni SEO attive
- Keywords "noleggio barche Italia" ottimizzate
- Geotargeting per regioni costiere italiane
- Schema.org per servizi nautici

## Tempo di Propagazione:
- **5-60 minuti** per la maggior parte dei provider DNS
- **Fino a 24-48 ore** nel caso peggiore

## Supporto:
Se incontri problemi, controlla che:
1. Le impostazioni DNS siano corrette
2. Il deployment Replit sia attivo
3. Il dominio non sia già in uso altrove