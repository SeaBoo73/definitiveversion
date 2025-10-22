import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Redirect, Link, useLocation } from "wouter";
import { Anchor, ArrowLeft } from "lucide-react";
import seabooLogo from "@assets/WhatsApp Image 2025-08-19 at 12.38.33_1757318764148.jpeg";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  acceptTerms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
}).refine((data) => data.acceptTerms, {
  message: "Devi accettare i termini e condizioni",
  path: ["acceptTerms"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, appleLoginMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check URL parameters for initial tab
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    return tabParam === 'register' ? 'register' : 'login';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Extract pre-filled data from URL parameters for registration
  const getPreFilledRegisterValues = () => {
    const urlParams = new URLSearchParams(window.location.search);
    // Get role from URL parameter, defaulting to "customer"
    const roleParam = urlParams.get('role');
    const role = (roleParam === 'owner') ? "owner" as const : "user" as const;
    
    return {
      username: "",
      email: urlParams.get('email') || "",
      password: "",
      confirmPassword: "",
      role: role,
      firstName: urlParams.get('firstName') || "",
      lastName: urlParams.get('lastName') || "",
      phone: urlParams.get('phone') || "",
      businessName: "",
      businessType: "",
      vatNumber: "",
      website: "",
      instagram: "",
      acceptTerms: false,
    };
  };

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: getPreFilledRegisterValues(),
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterData) => {
    console.log('📝 onRegister called with data:', data);
    console.log('📝 Form errors:', registerForm.formState.errors);
    const { confirmPassword, acceptTerms, ...registerData } = data;
    console.log('📝 Sending to API:', registerData);
    registerMutation.mutate(registerData);
  };

  const handleAppleSignIn = async () => {
    try {
      console.log('🚀 handleAppleSignIn started');
      
      // Check if we're in Capacitor (native iOS app)
      const isCapacitor = (window as any).Capacitor !== undefined;
      
      if (isCapacitor) {
        console.log('📱 Running in Capacitor, using native Apple Sign In...');
        
        try {
          const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');
          
          const options = {
            clientId: 'it.seaboo.app',
            redirectURI: 'https://seaboo.it/auth/apple/callback',
            scopes: 'email name',
            state: 'seaboo_state_' + Date.now(),
          };
          
          const result = await SignInWithApple.authorize(options);
          
          console.log('✅ Native Apple Sign In successful');
          
          // Extract data from Apple authentication
          const appleUserId = result.response.user || '';
          const rawEmail = result.response.email;
          const givenName = result.response.givenName || '';
          const familyName = result.response.familyName || '';
          
          if (!appleUserId) {
            throw new Error('ID Apple non fornito');
          }
          
          // Generate a valid email if Apple doesn't provide one
          // Use a hash of the Apple ID to create a clean email address
          const cleanAppleId = appleUserId.replace(/[^a-z0-9]/gi, '').substring(0, 30);
          const email = rawEmail || `apple${cleanAppleId}@seaboo.app`;
          
          console.log('🍎 Apple data:', { appleUserId, email, givenName, familyName });
          
          // Register/login with Apple data
          const userData: any = {
            email: email,
            password: appleUserId,
            username: `apple_${cleanAppleId}`,
            role: 'customer',
          };
          
          // Add name fields only if provided by Apple
          if (givenName) userData.firstName = givenName;
          if (familyName) userData.lastName = familyName;
          
          registerMutation.mutate(userData);
          
          return;
        } catch (nativeError: any) {
          console.error('❌ Native Apple Sign In error:', nativeError);
          
          // Don't show error if user cancelled
          if (nativeError.code === '1001' || nativeError.message?.includes('cancel')) {
            return;
          }
          
          throw nativeError;
        }
      }
      
      // Web: Try web Apple Sign In
      if (typeof window !== 'undefined' && window.AppleID) {
        console.log('🔄 Apple SDK available, attempting web Apple Sign In...');
        
        try {
          // Initialize Apple Sign In if not already done
          if (!window.AppleID.auth) {
            console.log('📝 Initializing Apple SDK...');
            await window.AppleID.auth.init({
              clientId: 'it.seaboo.web',
              scope: 'name email',
              redirectURI: window.location.origin + '/auth/apple/callback',
              usePopup: true
            });
          }
          
          const response = await window.AppleID.auth.signIn();
          
          console.log('✅ Apple Sign In successful, processing...');
          appleLoginMutation.mutate({
            id_token: response.authorization.id_token,
            user_info: response.user
          });
          return;
        } catch (sdkError) {
          console.error('❌ Apple SDK error:', sdkError);
          throw sdkError;
        }
      }
      
      // Se l'SDK Apple non è disponibile, mostra errore
      toast({
        title: "Apple Sign In non disponibile",
        description: "L'SDK Apple non è caricato correttamente. Prova con email e password.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('❌ Apple Sign In error:', error);
      
      toast({
        title: "Errore Apple Sign In",
        description: "Impossibile completare l'accesso con Apple. Prova con email e password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-8 min-h-full">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alla home
            </Button>
          </div>
          
          <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-center py-12">
            <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Anchor className="h-8 w-8 text-ocean-blue mr-2" />
              <h1 className="text-3xl font-bold text-ocean-blue">SeaBoo</h1>
            </div>
            <p className="text-gray-600">Naviga verso l'avventura</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="auth-tab-trigger text-gray-600 font-medium transition-all duration-200 hover:text-gray-900"
              >
                Accedi
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="auth-tab-trigger text-gray-600 font-medium transition-all duration-200 hover:text-gray-900"
              >
                Registrati
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Accedi al tuo account</CardTitle>
                  <CardDescription>
                    Inserisci le tue credenziali per accedere
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nome@esempio.com"
                        {...loginForm.register("email")}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-ocean-blue hover:bg-blue-600"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">oppure</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50"
                    disabled={appleLoginMutation.isPending}
                    onClick={handleAppleSignIn}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    {appleLoginMutation.isPending ? "Accesso in corso..." : "Continua con Apple"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crea un nuovo account</CardTitle>
                  <CardDescription>
                    Unisciti a SeaBoo e inizia la tua avventura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nome</Label>
                        <Input
                          id="firstName"
                          placeholder="Mario"
                          {...registerForm.register("firstName")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Cognome</Label>
                        <Input
                          id="lastName"
                          placeholder="Rossi"
                          {...registerForm.register("lastName")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Nome utente</Label>
                      <Input
                        id="username"
                        placeholder="mariorossi"
                        {...registerForm.register("username")}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="nome@esempio.com"
                        {...registerForm.register("email")}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefono (opzionale)</Label>
                      <Input
                        id="phone"
                        placeholder="+39 123 456 7890"
                        {...registerForm.register("phone")}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Come vuoi usare SeaBoo?</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {/* Cliente Option */}
                        <div 
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            registerForm.watch("role") === "user" 
                              ? "border-ocean-blue bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => registerForm.setValue("role", "user")}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              registerForm.watch("role") === "user" 
                                ? "border-ocean-blue bg-ocean-blue" 
                                : "border-gray-300"
                            }`}>
                              {registerForm.watch("role") === "user" && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">Mi registro come cliente</h3>
                              <p className="text-sm text-gray-600">Prenota e noleggia barche</p>
                            </div>
                          </div>
                        </div>

                        {/* Noleggiatore Option */}
                        <div 
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            registerForm.watch("role") === "owner" 
                              ? "border-ocean-blue bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => registerForm.setValue("role", "owner")}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              registerForm.watch("role") === "owner" 
                                ? "border-ocean-blue bg-ocean-blue" 
                                : "border-gray-300"
                            }`}>
                              {registerForm.watch("role") === "owner" && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">Mi registro come noleggiatore</h3>
                              <p className="text-sm text-gray-600">Affitta la tua barca e guadagna</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {registerForm.watch("role") === "owner" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            💡 <strong>Come noleggiatore</strong> potrai anche prenotare altre barche come cliente!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Business Information Section - Only for Owners */}
                    {registerForm.watch("role") === "owner" && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-medium text-blue-900 mb-2">🏢 Informazioni Attività</h3>
                          <p className="text-sm text-blue-800">
                            Come proprietario, inserisci le informazioni della tua attività.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Nome Attività</Label>
                            <Input
                              id="businessName"
                              placeholder="Es. Marina del Porto"
                              {...registerForm.register("businessName")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="businessType">Tipo Attività</Label>
                            <Input
                              id="businessType"
                              placeholder="Es. Noleggio barche"
                              {...registerForm.register("businessType")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="vatNumber">Partita IVA / Codice Fiscale</Label>
                            <Input
                              id="vatNumber"
                              placeholder="12345678901 o RSSMRA80A01H501X"
                              {...registerForm.register("vatNumber")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="website">Sito Web (opzionale)</Label>
                            <Input
                              id="website"
                              placeholder="https://www.tuosito.it"
                              {...registerForm.register("website")}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram (opzionale)</Label>
                            <Input
                              id="instagram"
                              placeholder="@tuoinstagram"
                              {...registerForm.register("instagram")}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-800">
                            💡 Puoi sempre aggiornare questi dati nel tuo profilo dopo la registrazione.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Payment Methods Info for Customers */}
                    {registerForm.watch("role") === "user" && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-medium text-green-900 mb-2">💳 Metodi di Pagamento</h3>
                          <p className="text-sm text-green-800 mb-3">
                            Come cliente, potrai pagare i tuoi noleggi con diversi metodi sicuri:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center">
                              <span className="text-green-600 mr-1">✓</span>
                              <span>Carte di credito</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-1">✓</span>
                              <span>Apple Pay</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-1">✓</span>
                              <span>Google Pay</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-green-600 mr-1">✓</span>
                              <span>PayPal</span>
                            </div>
                          </div>
                          <p className="text-xs text-green-700 mt-2">
                            Aggiungerai i tuoi metodi di pagamento al momento della prenotazione.
                          </p>
                        </div>
                      </div>
                    )}


                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="••••••••"
                        {...registerForm.register("password")}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Conferma Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...registerForm.register("confirmPassword")}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="acceptTerms"
                          onCheckedChange={(checked) => 
                            registerForm.setValue("acceptTerms", !!checked)
                          }
                          className="mt-1"
                        />
                        <label htmlFor="acceptTerms" className="text-sm leading-5">
                          Accetto i{" "}
                          <Link href="/condizioni-servizio">
                            <a className="text-ocean-blue hover:underline font-medium" target="_blank">
                              Termini e Condizioni d'uso
                            </a>
                          </Link>
                          {" "}e confermo di aver letto la{" "}
                          <a href="/privacy-policy" className="text-ocean-blue hover:underline font-medium" target="_blank">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {registerForm.formState.errors.acceptTerms && (
                        <p className="text-sm text-red-500 ml-6">
                          {registerForm.formState.errors.acceptTerms.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-ocean-blue hover:bg-blue-600"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrazione in corso..." : "Registrati"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-ocean-blue to-deep-navy">
        <div 
          className="flex-1 flex items-center justify-center relative"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/80 to-deep-navy/80"></div>
          <div className="relative text-center text-white p-8">
            <img src={seabooLogo} alt="SeaBoo" className="h-16 w-16 mx-auto mb-6 object-contain" />
            <h2 className="text-4xl font-bold mb-4">
              Benvenuto in SeaBoo
            </h2>
            <p className="text-xl text-blue-100 max-w-md">
              La piattaforma leader per il noleggio di imbarcazioni in Italia.
              Scopri il mare come mai prima d'ora.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
