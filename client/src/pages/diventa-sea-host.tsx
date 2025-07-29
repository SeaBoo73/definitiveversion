import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Anchor, Ship, Euro, Shield, Phone, Mail, FileText, Calendar, MapPin } from "lucide-react";

const seaHostRegistrationSchema = z.object({
  firstName: z.string().min(2, "Nome richiesto"),
  lastName: z.string().min(2, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono richiesto"),
  boatName: z.string().min(2, "Nome imbarcazione richiesto"),
  boatType: z.string().min(1, "Tipo imbarcazione richiesto"),
  boatManufacturer: z.string().min(2, "Cantiere/Marca richiesto"),
  boatYear: z.number().min(1980, "Anno non valido").max(new Date().getFullYear(), "Anno non valido"),
  boatLength: z.number().min(3, "Lunghezza minima 3 metri").max(50, "Lunghezza massima 50 metri"),
  homePort: z.string().min(2, "Porto di base richiesto"),
  pricePerDay: z.number().min(50, "Prezzo minimo €50/giorno"),
  description: z.string().min(50, "Descrizione di almeno 50 caratteri"),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini"),
  acceptCommission: z.boolean().refine(val => val === true, "Devi accettare la commissione")
});

type SeaHostRegistrationForm = z.infer<typeof seaHostRegistrationSchema>;

export default function DiventaSeaHostPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<SeaHostRegistrationForm>({
    resolver: zodResolver(seaHostRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      boatName: "",
      boatType: "",
      boatManufacturer: "",
      boatYear: 2020,
      boatLength: 10,
      homePort: "",
      pricePerDay: 150,
      description: "",
      acceptTerms: false,
      acceptCommission: false
    }
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: SeaHostRegistrationForm) => {
      const response = await fetch("/api/sea-host/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Errore nella registrazione");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrazione completata!",
        description: "Benvenuto nella community SeaGO. Riceverai una conferma via email.",
      });
      setTimeout(() => {
        setLocation("/owner-dashboard");
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Errore nella registrazione",
        description: error.message || "Si è verificato un errore. Riprova.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SeaHostRegistrationForm) => {
    registrationMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full p-4">
              <Anchor className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Diventa Sea Host SeaGO</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trasforma la tua passione per il mare in un'opportunità di guadagno. 
            Unisciti alla community di proprietari più grande d'Italia.
          </p>
        </div>

        {/* Vantaggi Principali */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Euro className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-900">Guadagni Extra</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">€12.500</div>
              <p className="text-gray-600">guadagno medio annuale</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-900">Sicurezza Totale</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">100%</div>
              <p className="text-gray-600">assicurazione coperta</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Ship className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-900">Gestione Facile</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600">assistenza dedicata</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><Mail className="h-5 w-5" /> Informazioni Personali</>}
              {currentStep === 2 && <><Ship className="h-5 w-5" /> Dettagli Imbarcazione</>}
              {currentStep === 3 && <><FileText className="h-5 w-5" /> Termini e Condizioni</>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Iniziamo con i tuoi dati di contatto"}
              {currentStep === 2 && "Parlaci della tua imbarcazione"}
              {currentStep === 3 && "Ultimi dettagli per completare la registrazione"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      placeholder="Il tuo nome"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Cognome *</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      placeholder="Il tuo cognome"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="la-tua-email@example.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      {...form.register("phone")}
                      placeholder="+39 123 456 7890"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Boat Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="boatName">Nome Imbarcazione *</Label>
                      <Input
                        id="boatName"
                        {...form.register("boatName")}
                        placeholder="es. Stella Marina"
                      />
                      {form.formState.errors.boatName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.boatName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="boatType">Tipo Imbarcazione *</Label>
                      <select
                        id="boatType"
                        {...form.register("boatType")}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Seleziona tipo</option>
                        <option value="yacht">Yacht</option>
                        <option value="sailboat">Barca a vela</option>
                        <option value="motorboat">Barca a motore</option>
                        <option value="catamaran">Catamarano</option>
                        <option value="gommone">Gommone</option>
                        <option value="jetski">Moto d'acqua</option>
                      </select>
                      {form.formState.errors.boatType && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.boatType.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="boatManufacturer">Cantiere/Marca *</Label>
                      <Input
                        id="boatManufacturer"
                        {...form.register("boatManufacturer")}
                        placeholder="es. Azimut, Jeanneau"
                      />
                      {form.formState.errors.boatManufacturer && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.boatManufacturer.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="boatYear">Anno *</Label>
                      <Input
                        id="boatYear"
                        type="number"
                        {...form.register("boatYear", { valueAsNumber: true })}
                        min="1980"
                        max={new Date().getFullYear()}
                      />
                      {form.formState.errors.boatYear && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.boatYear.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="boatLength">Lunghezza (m) *</Label>
                      <Input
                        id="boatLength"
                        type="number"
                        step="0.1"
                        {...form.register("boatLength", { valueAsNumber: true })}
                        min="3"
                        max="50"
                      />
                      {form.formState.errors.boatLength && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.boatLength.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="homePort">Porto di Base *</Label>
                      <Input
                        id="homePort"
                        {...form.register("homePort")}
                        placeholder="es. Marina di Civitavecchia"
                      />
                      {form.formState.errors.homePort && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.homePort.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="pricePerDay">Prezzo al giorno (€) *</Label>
                      <Input
                        id="pricePerDay"
                        type="number"
                        {...form.register("pricePerDay", { valueAsNumber: true })}
                        min="50"
                        placeholder="150"
                      />
                      {form.formState.errors.pricePerDay && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.pricePerDay.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrizione Imbarcazione *</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Descrivi la tua imbarcazione, i suoi punti di forza e cosa la rende speciale..."
                      className="h-24"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Terms */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Commission Info */}
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="text-amber-800 flex items-center gap-2">
                        <Euro className="h-5 w-5" />
                        Commissioni SeaGO
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-amber-700">
                      <div className="mb-4">
                        <div className="text-2xl font-bold mb-2">15% di commissione</div>
                        <p className="text-sm">
                          SeaGO trattiene il 15% su ogni prenotazione per coprire:
                        </p>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                          <li>Assicurazione completa della tua imbarcazione</li>
                          <li>Marketing e visibilità sulla piattaforma</li>
                          <li>Assistenza clienti 24/7</li>
                          <li>Gestione pagamenti e fatturazione</li>
                          <li>Supporto tecnico dedicato</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Terms Acceptance */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={form.watch("acceptTerms")}
                        onCheckedChange={(checked) => form.setValue("acceptTerms", checked as boolean)}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                        Accetto i <Button variant="link" className="p-0 h-auto text-blue-600">termini di servizio</Button> e la 
                        <Button variant="link" className="p-0 h-auto text-blue-600 ml-1">privacy policy</Button> di SeaGO
                      </Label>
                    </div>
                    {form.formState.errors.acceptTerms && (
                      <p className="text-red-500 text-sm">{form.formState.errors.acceptTerms.message}</p>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptCommission"
                        checked={form.watch("acceptCommission")}
                        onCheckedChange={(checked) => form.setValue("acceptCommission", checked as boolean)}
                      />
                      <Label htmlFor="acceptCommission" className="text-sm leading-relaxed">
                        Accetto la commissione del 15% su ogni prenotazione e comprendo che verrà trattenuta automaticamente da SeaGO
                      </Label>
                    </div>
                    {form.formState.errors.acceptCommission && (
                      <p className="text-red-500 text-sm">{form.formState.errors.acceptCommission.message}</p>
                    )}
                  </div>

                  {/* Benefits Reminder */}
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-green-800 mb-2">I tuoi vantaggi come Sea Host:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>✓ Pagamenti sicuri e puntuali ogni settimana</li>
                        <li>✓ Visibilità su migliaia di potenziali clienti</li>
                        <li>✓ Supporto marketing professionale gratuito</li>
                        <li>✓ Assicurazione completa inclusa</li>
                        <li>✓ Dashboard dedicata per gestire tutto</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Indietro
                </Button>
                
                <div className="flex gap-2">
                  {currentStep < 3 ? (
                    <Button type="button" onClick={nextStep}>
                      Continua
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={registrationMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600"
                    >
                      {registrationMutation.isPending ? "Registrazione..." : "Completa Registrazione"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Hai bisogno di aiuto?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Il nostro team è qui per supportarti durante tutto il processo
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                  <Phone className="h-4 w-4 mr-2" />
                  +39 06 123 4567
                </Button>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  host@seago.it
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}