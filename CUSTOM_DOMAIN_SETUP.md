# 🌐 Collegare Dominio Personalizzato a SeaBoo

## Passo 1: Configurazione nel Deployment Replit

1. **Vai alla sezione Deployments** del tuo progetto
2. **Clicca su "Domains" o "Custom Domain"**
3. **Inserisci il tuo dominio** (es: seago.it, tuodominio.com)
4. **Replit ti fornirà le istruzioni DNS**

## Passo 2: Configurazione DNS dal tuo Provider

**Tipo A Record:**
- Nome: @ (o lascia vuoto per root domain)
- Valore: [IP fornito da Replit]
- TTL: 300 (o default)

**Tipo CNAME Record (per www):**
- Nome: www
- Valore: [CNAME fornito da Replit]
- TTL: 300

## Passo 3: Verifica Certificato SSL

Replit gestisce automaticamente:
- Certificato SSL/TLS gratuito
- Redirect HTTPS automatico
- Rinnovo certificato automatico

## Esempio Configurazione DNS:

```
Tipo    Nome    Valore
A       @       xxx.xxx.xxx.xxx
CNAME   www     your-app.replit.app
```

## Tempo di Propagazione:
- 5-60 minuti per la maggior parte dei provider
- Fino a 24-48 ore nel peggiore dei casi

## Verifica Funzionamento:
1. Apri il tuo dominio personalizzato
2. Controlla che mostri la piattaforma SeaBoo
3. Verifica HTTPS funzionante
4. Testa tutte le funzionalità