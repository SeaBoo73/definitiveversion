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

**IMPORTANTE**: Assicurati che `android:launchMode="singleTask"` sia presente nell'activity!

## Passo 2: Modifica MainActivity.java

Apri `android/app/src/main/java/it/seaboo/app/MainActivity.java` e sostituisci TUTTO il contenuto con:

```java
package it.seaboo.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "SeaBooAuth";
    private String pendingToken = null;
    
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
    
    @Override
    public void onStart() {
        super.onStart();
        if (pendingToken != null) {
            injectTokenWithRetry(pendingToken);
            pendingToken = null;
        }
    }
    
    private void handleIntent(Intent intent) {
        Uri data = intent.getData();
        Log.d(TAG, "handleIntent: data=" + data);
        
        if (data != null && "seaboo".equals(data.getScheme())) {
            String token = data.getQueryParameter("token");
            Log.d(TAG, "Token found: " + (token != null ? "YES" : "NO"));
            
            if (token != null && !token.isEmpty()) {
                pendingToken = token;
                injectTokenWithRetry(token);
            }
        }
    }
    
    private void injectTokenWithRetry(String token) {
        Handler handler = new Handler(Looper.getMainLooper());
        int[] delays = {100, 500, 1000, 2000};
        for (int delay : delays) {
            handler.postDelayed(() -> injectToken(token), delay);
        }
    }
    
    private void injectToken(String token) {
        try {
            if (getBridge() != null && getBridge().getWebView() != null) {
                String js = "if(window.handleSeaBooAuth){window.handleSeaBooAuth('" + token + "');}else{window.SEABOO_PENDING_TOKEN='" + token + "';}";
                Log.d(TAG, "Injecting token via JS");
                getBridge().getWebView().evaluateJavascript(js, null);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error injecting token: " + e.getMessage());
        }
    }
}
```

## Passo 3: Rebuild

Dopo aver fatto queste modifiche:

1. In Android Studio: **Build > Clean Project**
2. Poi: **Build > Rebuild Project**
3. Infine: **Run**

## Come funziona

1. Quando clicchi "Accedi con Google" nell'app, si apre il browser
2. Dopo il login Google, il browser reindirizza a `seaboo://auth?token=xxx`
3. Android intercetta questo URL e apre l'app SeaBoo
4. MainActivity.java estrae il token e lo inietta nella WebView
5. L'app riceve il token e completa il login automaticamente
