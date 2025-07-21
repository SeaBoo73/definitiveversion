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
import { Redirect, Link } from "wouter";
import { Anchor, Waves } from "lucide-react";

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
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
      firstName: "",
      lastName: "",
      phone: "",
      acceptTerms: false,
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const onLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterData) => {
    const { confirmPassword, acceptTerms, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Anchor className="h-8 w-8 text-ocean-blue mr-2" />
              <h1 className="text-3xl font-bold text-ocean-blue">SeaGO</h1>
            </div>
            <p className="text-gray-600">Naviga verso l'avventura</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Accedi</TabsTrigger>
              <TabsTrigger value="register">Registrati</TabsTrigger>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crea un nuovo account</CardTitle>
                  <CardDescription>
                    Unisciti a SeaGO e inizia la tua avventura
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
                      <Label className="text-base font-medium">Come vuoi usare SeaGO?</Label>
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
            <Waves className="h-16 w-16 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">
              Benvenuto in SeaGO
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
