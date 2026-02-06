import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Redirect, Link, useLocation } from "wouter";
import { Anchor, ArrowLeft, Eye, EyeOff } from "lucide-react";
import seabooLogo from "@assets/WhatsApp Image 2025-08-19 at 12.38.33_1757318764148.jpeg";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getApiUrl } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(1, "Password richiesta"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email non valida"),
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
  
  // Check if we're running in Capacitor (native iOS app)
  const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check URL parameters for initial tab
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    return tabParam === 'register' ? 'register' : 'login';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const role = (roleParam === 'owner') ? "owner" as const : "customer" as const;
    
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

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast({
        title: "Errore",
        description: "Inserisci la tua email",
        variant: "destructive",
      });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/forgot-password', { email: forgotPasswordEmail });
      const data = await response.json();
      
      setForgotPasswordSent(true);
      toast({
        title: "Email inviata",
        description: "Se l'email esiste, riceverai un link per reimpostare la password",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const onRegister = (data: RegisterData) => {
    const { confirmPassword, acceptTerms, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  const [isPollingAuth, setIsPollingAuth] = useState(false);
  const pollIdRef = useRef<string | null>(null);
  const pollingActiveRef = useRef(false);

  const checkPollResult = useCallback(async (pollId: string): Promise<boolean> => {
    try {
      const pollUrl = getApiUrl(`/api/auth/mobile-poll/${pollId}`);
      console.log('Polling auth status for:', pollId, 'at:', pollUrl);
      const res = await fetch(pollUrl, {
        credentials: 'include'
      });

      if (res.status === 404 || res.status === 410) {
        console.log('Poll expired or not found');
        pollingActiveRef.current = false;
        pollIdRef.current = null;
        localStorage.removeItem('seaboo_pending_poll');
        setIsPollingAuth(false);
        toast({
          title: "Errore",
          description: "Sessione di login scaduta. Riprova.",
          variant: "destructive",
        });
        return true;
      }

      const data = await res.json();
      console.log('Poll result:', data.status);

      if (data.status === 'completed' && data.user) {
        pollingActiveRef.current = false;
        pollIdRef.current = null;
        localStorage.removeItem('seaboo_pending_poll');
        setIsPollingAuth(false);
        console.log('Mobile auth success:', data.user.email);
        localStorage.setItem('seaboo_user', JSON.stringify(data.user));

        const { queryClient } = await import('@/lib/queryClient');
        queryClient.setQueryData(['/api/user'], data.user);
        queryClient.invalidateQueries({ queryKey: ['/api/user'] });

        toast({
          title: "Accesso completato!",
          description: `Benvenuto, ${data.user.firstName || data.user.email}!`,
        });

        window.location.href = '/';
        return true;
      }
    } catch (e) {
      console.log('Poll network error, will retry');
    }
    return false;
  }, [toast]);

  useEffect(() => {
    const savedPoll = localStorage.getItem('seaboo_pending_poll');
    if (savedPoll) {
      try {
        const { pollId, timestamp } = JSON.parse(savedPoll);
        const elapsed = Date.now() - timestamp;
        if (elapsed < 10 * 60 * 1000) {
          console.log('Resuming poll from localStorage:', pollId);
          pollIdRef.current = pollId;
          pollingActiveRef.current = true;
          setIsPollingAuth(true);
          checkPollResult(pollId);
        } else {
          localStorage.removeItem('seaboo_pending_poll');
        }
      } catch (e) {
        localStorage.removeItem('seaboo_pending_poll');
      }
    }
  }, [checkPollResult]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pollIdRef.current && pollingActiveRef.current) {
        console.log('App foregrounded, checking poll immediately');
        checkPollResult(pollIdRef.current);
      }
    };

    const handleResume = () => {
      if (pollIdRef.current && pollingActiveRef.current) {
        console.log('App resumed, checking poll immediately');
        checkPollResult(pollIdRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('resume', handleResume);
    window.addEventListener('focus', handleResume);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('resume', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [checkPollResult]);

  useEffect(() => {
    if (!isPollingAuth || !pollIdRef.current) return;

    const startTime = Date.now();
    const maxDuration = 5 * 60 * 1000;

    const interval = setInterval(async () => {
      if (Date.now() - startTime > maxDuration) {
        clearInterval(interval);
        pollingActiveRef.current = false;
        pollIdRef.current = null;
        localStorage.removeItem('seaboo_pending_poll');
        setIsPollingAuth(false);
        toast({
          title: "Timeout",
          description: "Il login ha impiegato troppo tempo. Riprova.",
          variant: "destructive",
        });
        return;
      }

      if (pollIdRef.current && pollingActiveRef.current) {
        const done = await checkPollResult(pollIdRef.current);
        if (done) clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPollingAuth, checkPollResult, toast]);

  const handleGoogleSignIn = async () => {
    const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor !== undefined;
    const isAndroid = isCapacitor && (window as any).Capacitor?.getPlatform?.() === 'android';

    if (isAndroid) {
      try {
        const pollStartUrl = getApiUrl('/api/auth/mobile-poll-start');
        console.log('Starting mobile poll at:', pollStartUrl);
        const pollRes = await fetch(pollStartUrl);
        const { pollId } = await pollRes.json();

        pollIdRef.current = pollId;
        pollingActiveRef.current = true;
        localStorage.setItem('seaboo_pending_poll', JSON.stringify({ pollId, timestamp: Date.now() }));

        setIsPollingAuth(true);
        toast({
          title: "Accesso Google",
          description: "Completa il login nel browser. Tornerai automaticamente all'app.",
        });

        const googleAuthUrl = getApiUrl(`/api/auth/google?mobile=android&pollId=${pollId}`);
        console.log('Opening Google auth URL:', googleAuthUrl);
        window.open(googleAuthUrl, '_system');

      } catch (error) {
        console.error('Error starting Google Sign In:', error);
        pollingActiveRef.current = false;
        pollIdRef.current = null;
        localStorage.removeItem('seaboo_pending_poll');
        setIsPollingAuth(false);
        toast({
          title: "Errore",
          description: "Impossibile avviare il login con Google. Riprova.",
          variant: "destructive",
        });
      }
    } else {
      window.location.href = getApiUrl('/api/auth/google');
    }
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
          
          // For iOS native, only scopes are needed - no clientId or redirectURI
          const options = {
            scopes: 'email name',
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
          
          console.log('🍎 Apple raw data:', { appleUserId, rawEmail, cleanAppleId });
          console.log('🍎 Generated email:', email);
          console.log('🍎 Names:', { givenName, familyName });
          
          // Call dedicated Apple Sign In endpoint
          const appleAuthData = {
            email,
            appleUserId,
            firstName: givenName || undefined,
            lastName: familyName || undefined,
          };
          
          console.log('🔵 Calling /api/auth/apple with:', appleAuthData);
          
          try {
            const response = await apiRequest('POST', '/api/auth/apple', appleAuthData);
            const data = await response.json();
            
            console.log('✅ Apple auth successful:', data);
            
            // Show success message
            toast({
              title: "Accesso effettuato!",
              description: "Benvenuto su SeaBoo",
            });
            
            // Reload page to update auth state
            window.location.href = '/';
          } catch (error: any) {
            console.error('❌ Apple auth failed:', error);
            toast({
              title: "Errore Apple Sign In",
              description: error.message || "Impossibile completare l'accesso con Apple",
              variant: "destructive",
            });
          }
          
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
          // Initialize Apple Sign In
          console.log('📝 Initializing Apple SDK...');
          await window.AppleID.auth.init({
            clientId: 'it.seaboo.web',
            scope: 'name email',
            redirectURI: window.location.origin + '/auth/apple/callback',
            usePopup: true
          });
          
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
                      <div className="relative">
                        <Input
                          id="password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...loginForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          data-testid="button-toggle-login-password"
                        >
                          {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-ocean-blue hover:underline"
                        data-testid="link-forgot-password"
                      >
                        Password dimenticata?
                      </button>
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

                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                      disabled={appleLoginMutation.isPending}
                      onClick={handleAppleSignIn}
                      data-testid="button-apple-signin"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      {appleLoginMutation.isPending ? "Accesso in corso..." : "Continua con Apple"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                      onClick={handleGoogleSignIn}
                      disabled={isPollingAuth}
                      data-testid="button-google-signin"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isPollingAuth ? "Attendo login nel browser..." : "Continua con Google"}
                    </Button>
                  </div>
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
                      <Label htmlFor="phone">Telefono</Label>
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
                            registerForm.watch("role") === "customer" 
                              ? "border-ocean-blue bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => registerForm.setValue("role", "customer")}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              registerForm.watch("role") === "customer" 
                                ? "border-ocean-blue bg-ocean-blue" 
                                : "border-gray-300"
                            }`}>
                              {registerForm.watch("role") === "customer" && (
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
                    {registerForm.watch("role") === "customer" && (
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
                      <div className="relative">
                        <Input
                          id="registerPassword"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...registerForm.register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          data-testid="button-toggle-register-password"
                        >
                          {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Conferma Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...registerForm.register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
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
                          <Link href="/condizioni-servizio" className="text-ocean-blue hover:underline font-medium" target="_blank">
                            Termini e Condizioni d'uso
                          </Link>
                          {" "}e confermo di aver letto la{" "}
                          <Link href="/privacy-policy" className="text-ocean-blue hover:underline font-medium" target="_blank">
                            Privacy Policy
                          </Link>
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
                      data-testid="button-register"
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
              La piattaforma leader per il noleggio di imbarcazioni e ormeggi.
              Scopri il mare come mai prima d'ora.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Password dimenticata</DialogTitle>
            <DialogDescription>
              Inserisci la tua email e ti invieremo un link per reimpostare la password.
            </DialogDescription>
          </DialogHeader>
          {!forgotPasswordSent ? (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  data-testid="input-forgot-email"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                  }}
                >
                  Annulla
                </Button>
                <Button
                  className="flex-1 bg-ocean-blue hover:bg-blue-600"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordLoading}
                  data-testid="button-send-reset"
                >
                  {forgotPasswordLoading ? "Invio in corso..." : "Invia link"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600">
                Se l'email esiste nel nostro sistema, riceverai un link per reimpostare la password.
              </p>
              <Button
                className="w-full bg-ocean-blue hover:bg-blue-600"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                  setForgotPasswordSent(false);
                }}
              >
                Chiudi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
