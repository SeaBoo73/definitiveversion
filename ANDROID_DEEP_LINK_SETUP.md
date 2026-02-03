# Setup Deep Link per Android - SeaBoo

## Passo 1: Modifica AndroidManifest.xml

Apri `android/app/src/main/AndroidManifest.xml` e aggiungi questo intent-filter DENTRO il tag `<activity>` principale (quello con `android:name=".MainActivity"`):

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="seaboo" />
</intent-filter>
```

Il tuo `<activity>` dovrebbe apparire così:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    ...altri attributi...>
    
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    
    <!-- AGGIUNGI QUESTO per deep links -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="seaboo" />
    </intent-filter>
    
</activity>
```

**IMPORTANTE**: Assicurati che `android:launchMode="singleTask"` sia presente nell'activity!

## Passo 2: Modifica MainActivity.java

Apri `android/app/src/main/java/it/seaboo/app/MainActivity.java` e sostituisci TUTTO il contenuto con:

```java
package it.seaboo.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "SeaBooAuth";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }
    
    private void handleIntent(Intent intent) {
        String action = intent.getAction();
        Uri data = intent.getData();
        
        if (Intent.ACTION_VIEW.equals(action) && data != null) {
            String scheme = data.getScheme();
            if ("seaboo".equals(scheme)) {
                String token = data.getQueryParameter("token");
                if (token != null && !token.isEmpty()) {
                    Log.d(TAG, "Received auth token from deep link");
                    // Pass token to WebView via JavaScript
                    String js = "window.postMessage({type:'SEABOO_AUTH_TOKEN',token:'" + token + "'},'*');";
                    getBridge().getWebView().post(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    });
                }
            }
        }
    }
}
```

## Passo 3: Rebuild

Dopo aver fatto queste modifiche:

1. `npm run build`
2. `npx cap sync android`
3. In Android Studio: **Build > Clean Project**
4. Poi: **Build > Rebuild Project**
5. Infine: **Run**

## Come funziona

1. Quando clicchi "Accedi con Google" nell'app, si apre il browser
2. Dopo il login Google, il browser reindirizza a `seaboo://auth?token=xxx`
3. Android intercetta questo URL e apre l'app SeaBoo
4. MainActivity.java estrae il token e lo passa alla WebView tramite postMessage
5. L'app riceve il messaggio e fa lo scambio del token per il login
