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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Anchor, Users, Euro, Shield, Star, Clock, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ownerRegistrationSchema = z.object({
  firstName: z.string().min(2, "Nome richiesto"),
  lastName: z.string().min(2, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono valido richiesto"),
  city: z.string().min(2, "Città richiesta"),
  boatExperience: z.string().min(10, "Descrivi la tua esperienza"),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini"),
  acceptCommission: z.boolean().refine(val => val === true, "Devi accettare la commissione del 15%"),
});

type OwnerRegistrationForm = z.infer<typeof ownerRegistrationSchema>;

export default function DiventaNoleggiatorePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"info" | "form">("info");

  const form = useForm<OwnerRegistrationForm>({
    resolver: zodResolver(ownerRegistrationSchema),
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: OwnerRegistrationForm) => {
      return apiRequest("POST", "/api/become-owner", data);
    },
    onSuccess: () => {
      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo entro 24 ore per completare la registrazione.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
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
                Condividi la passione per il mare e guadagna fino al 85% su ogni prenotazione.
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
                  Mantieni l'<strong>85% di ogni prenotazione</strong>. 
                  SeaGO trattiene solo il 15% che viene pagato dal cliente.
                </p>
                <Badge className="bg-green-100 text-green-800">
                  Il cliente paga la commissione
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
                  Zero rischi
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Clientela Qualificata</h3>
                <p className="text-gray-600 mb-4">
                  Accesso a migliaia di utenti verificati che cercano esperienze nautiche.
                </p>
                <Badge className="bg-purple-100 text-purple-800">
                  Sempre prenotato
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-8">Come funziona</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-2">Registrati</h4>
                <p className="text-sm text-gray-600">
                  Compila il modulo e carica i dettagli della tua barca
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-2">Verifica</h4>
                <p className="text-sm text-gray-600">
                  Il nostro team verifica i documenti in 24 ore
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-2">Pubblica</h4>
                <p className="text-sm text-gray-600">
                  La tua barca diventa visibile a migliaia di utenti
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  €
                </div>
                <h4 className="font-semibold mb-2">Guadagna</h4>
                <p className="text-sm text-gray-600">
                  Ricevi pagamenti sicuri entro 24h dalla prenotazione
                </p>
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 mt-12">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Commissione trasparente: solo il 15%
                </h3>
                <p className="text-green-700 mb-4">
                  <strong>Importante:</strong> Il 15% di commissione viene pagato direttamente dal cliente, 
                  non viene detratto dai tuoi guadagni.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Esempio pratico:</p>
                  <div className="space-y-1 text-sm">
                    <div>• Prezzo tua barca: €300/giorno</div>
                    <div>• Commissione SeaGO (15%): €45 (pagata dal cliente)</div>
                    <div>• Prezzo finale cliente: €345</div>
                    <div className="font-bold text-green-600">• Tu ricevi: €300 (100% del tuo prezzo)</div>
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
              Compila i tuoi dati per diventare parte della community SeaGO
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Cognome</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                      <FormLabel>Telefono</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città (dove si trova la barca)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="boatExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Esperienza nautica e dettagli della barca</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrivi la tua esperienza, tipo di barca, anno, caratteristiche..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="acceptCommission"
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
                            Accetto la commissione del 15% pagata dal cliente
                          </FormLabel>
                          <p className="text-xs text-gray-600">
                            La commissione del 15% viene aggiunta al prezzo finale e pagata dal cliente. 
                            Tu ricevi il 100% del prezzo che imposti.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            Inclusi: assicurazione, politiche di cancellazione, 
                            standard di sicurezza e qualità del servizio.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    {registrationMutation.isPending ? "Invio..." : "Invia richiesta"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}