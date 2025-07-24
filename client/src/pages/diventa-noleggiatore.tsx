import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Anchor, Euro, Shield, Star, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ownerRegistrationSchema = z.object({
  // Personal Info Only - Boat details will be collected later in owner dashboard
  firstName: z.string().min(2, "Nome richiesto"),
  lastName: z.string().min(2, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono valido richiesto"),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini di servizio"),
});

type OwnerRegistrationForm = z.infer<typeof ownerRegistrationSchema>;

export default function DiventaNoleggiatorePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Extract pre-filled data from URL parameters
  const getPreFilledValues = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      firstName: urlParams.get('firstName') || "",
      lastName: urlParams.get('lastName') || "",
      email: urlParams.get('email') || "",
      phone: urlParams.get('phone') || "",
      acceptTerms: false,
    };
  };

  // Check if we have pre-filled data to determine initial step
  const hasPreFilledData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('firstName') || urlParams.has('email') || urlParams.has('phone');
  };

  const [step, setStep] = useState<"info" | "form">(hasPreFilledData() ? "form" : "info");

  const form = useForm<OwnerRegistrationForm>({
    resolver: zodResolver(ownerRegistrationSchema),
    defaultValues: getPreFilledValues()
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: OwnerRegistrationForm) => {
      return apiRequest("POST", "/api/become-owner", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Registrazione completata!",
        description: data.message || "Riceverai le credenziali per accedere alla dashboard proprietario via email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      // Redirect to owner dashboard after successful registration
      setTimeout(() => {
        setLocation("/owner-dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      // Extract error message from API response
      const errorMessage = error.message || "Si è verificato un errore. Riprova.";
      
      toast({
        title: "Errore",
        description: errorMessage,
        variant: "destructive",
      });

      // If user already exists, offer login option
      if (errorMessage.includes("email esiste già")) {
        setTimeout(() => {
          toast({
            title: "Account esistente",
            description: "Se hai già un account, prova ad accedere alla dashboard proprietario.",
          });
        }, 2000);
      }
    },
  });

  const onSubmit = (data: OwnerRegistrationForm) => {
    registrationMutation.mutate(data);
  };

  if (step === "info") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ocean-blue to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <Anchor className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Diventa Noleggiatore SeaGO
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Trasforma la tua barca in una fonte di reddito. 
                Condividi la passione per il mare e ottieni guadagni elevati su ogni prenotazione.
              </p>
              <Button
                onClick={() => setStep("form")}
                size="lg"
                className="bg-white text-ocean-blue hover:bg-gray-100 text-lg px-8 py-3"
              >
                Inizia ora - È gratis
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Perché scegliere SeaGO?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-8">
                <Euro className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Guadagni Elevati</h3>
                <p className="text-gray-600 mb-4">
                  Ottieni <strong>guadagni competitivi</strong> su ogni prenotazione. 
                  La nostra struttura di commissioni è trasparente e conveniente.
                </p>
                <Badge className="bg-green-100 text-green-800">
                  Tariffe competitive
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Protezione Totale</h3>
                <p className="text-gray-600 mb-4">
                  Assicurazione inclusa, pagamenti sicuri e supporto clienti 24/7.
                </p>
                <Badge className="bg-blue-100 text-blue-800">
                  Sicurezza garantita
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Visibilità Massima</h3>
                <p className="text-gray-600 mb-4">
                  Le tue barche saranno visibili a migliaia di clienti in tutta Italia.
                </p>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Marketing incluso
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 mt-12">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Sistema di guadagni vantaggioso
                </h3>
                <p className="text-green-700 mb-4">
                  <strong>Trasparenza totale:</strong> La nostra struttura tariffaria è semplice, 
                  competitiva e ti permette di massimizzare i tuoi guadagni.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Vantaggi per i noleggiatori:</p>
                  <div className="space-y-1 text-sm">
                    <div>• Guadagni superiori rispetto alla concorrenza</div>
                    <div>• Nessun costo nascosto o spesa imprevista</div>
                    <div>• Pagamenti puntuali e sicuri</div>
                    <div className="font-bold text-green-600">• Struttura tariffaria trasparente e conveniente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setStep("form")}
              size="lg"
              className="bg-ocean-blue hover:bg-blue-600 text-lg px-8 py-3"
            >
              Inizia la registrazione
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Registrazione gratuita • Nessun costo nascosto • Supporto dedicato
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Registrazione Noleggiatore
            </CardTitle>
            <p className="text-center text-gray-600">
              Inserisci i tuoi dati base. I dettagli delle imbarcazioni li aggiungerai nella dashboard.
            </p>
          </CardHeader>
          <CardContent>
            {hasPreFilledData() && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm font-medium">
                    I tuoi dati sono stati pre-compilati dalla homepage. Verifica e completa la registrazione.
                  </p>
                </div>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Only */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">👤 Informazioni Personali</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Inserisci i tuoi dati base. I dettagli delle imbarcazioni li aggiungerai successivamente nella tua dashboard.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Mario" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cognome *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Rossi" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} placeholder="mario.rossi@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+39 333 123 4567" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Next Steps Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-3">📋 Prossimi Passi</h4>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>• Completa questa registrazione con i tuoi dati base</li>
                    <li>• Riceverai un account proprietario SeaGO</li>
                    <li>• Nella dashboard potrai aggiungere tutte le tue imbarcazioni</li>
                    <li>• Per ogni barca inserirai: dettagli tecnici, foto, prezzi e disponibilità</li>
                    <li>• Il nostro team verificherà la documentazione</li>
                    <li>• Una volta approvato, le tue barche saranno visibili ai clienti</li>
                  </ul>
                </div>

                {/* Terms */}
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Accetto i termini e condizioni di SeaGO
                        </FormLabel>
                        <p className="text-xs text-gray-600">
                          Registrandoti accetti di essere contattato per completare l'inserimento delle tue imbarcazioni e di rispettare gli standard SeaGO per il noleggio.
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("info")}
                    className="flex-1"
                  >
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    disabled={registrationMutation.isPending}
                    className="flex-1 bg-ocean-blue hover:bg-blue-600"
                  >
                    {registrationMutation.isPending ? "Invio..." : "Registrati come Noleggiatore"}
                  </Button>
                </div>
                
                <div className="text-center mt-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    Dopo la registrazione riceverai le credenziali per accedere alla dashboard proprietario dove potrai aggiungere le tue imbarcazioni.
                  </p>
                  <p className="text-xs text-gray-600">
                    Hai già un account? {" "}
                    <button
                      type="button"
                      onClick={() => setLocation("/owner-dashboard")}
                      className="text-ocean-blue hover:underline font-medium"
                    >
                      Vai alla Dashboard Proprietario
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}