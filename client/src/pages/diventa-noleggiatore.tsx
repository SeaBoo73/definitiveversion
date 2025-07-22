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
  // Personal Info
  firstName: z.string().min(2, "Nome richiesto"),
  lastName: z.string().min(2, "Cognome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono valido richiesto"),
  serviceCategories: z.array(z.string()).optional(),
  
  // Boat Details
  boatName: z.string().min(2, "Nome dell'imbarcazione richiesto"),
  boatType: z.string().min(2, "Tipo di imbarcazione richiesto"),
  boatBrand: z.string().min(2, "Marca/Cantiere richiesto"),
  boatModel: z.string().min(1, "Modello richiesto"),
  boatYear: z.string().min(4, "Anno di costruzione richiesto"),
  boatLength: z.string().min(1, "Lunghezza richiesta"),
  boatCapacity: z.string().min(1, "Capacità richiesta"),
  boatCabins: z.string().optional(),
  boatBathrooms: z.string().optional(),
  
  // Harbor Info
  harborName: z.string().min(2, "Nome del porto richiesto"),
  harborAddress: z.string().min(5, "Indirizzo del porto richiesto"),
  
  // Equipment
  boatEquipment: z.string().min(20, "Elenca gli equipaggiamenti di sicurezza"),
  boatAmenities: z.string().optional(),
  
  // Documentation
  boatLicense: z.string().min(2, "Numero di matricola richiesto"),
  insuranceCompany: z.string().min(2, "Compagnia assicurativa richiesta"),
  insuranceExpiry: z.string().min(1, "Scadenza assicurazione richiesta"),
  
  // Commercial
  dailyPrice: z.string().min(1, "Prezzo giornaliero richiesto"),
  licenseRequired: z.string().min(1, "Seleziona requisiti patente"),
  
  // Additional Info
  ownerExperience: z.string().min(20, "Descrivi la tua esperienza nautica"),
  specialNotes: z.string().optional(),
  availabilityNotes: z.string().optional(),
  
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini"),
});

type OwnerRegistrationForm = z.infer<typeof ownerRegistrationSchema>;

export default function DiventaNoleggiatorePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"info" | "form">("info");

  const form = useForm<OwnerRegistrationForm>({
    resolver: zodResolver(ownerRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      serviceCategories: [],
      boatName: "",
      boatType: "",
      boatBrand: "",
      boatModel: "",
      boatYear: "",
      boatLength: "",
      boatCapacity: "",
      boatCabins: "",
      boatBathrooms: "",
      harborName: "",
      harborAddress: "",
      boatEquipment: "",
      boatAmenities: "",
      boatLicense: "",
      insuranceCompany: "",
      insuranceExpiry: "",
      dailyPrice: "",
      licenseRequired: "",
      ownerExperience: "",
      specialNotes: "",
      availabilityNotes: "",
      acceptTerms: false,
    }
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

                {/* Service Categories Selection */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">🌟 Servizi Premium SeaGO</h3>
                  <p className="text-sm text-purple-700 mb-4">
                    Seleziona i servizi premium che vuoi offrire per aumentare le tue prenotazioni e guadagni
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="serviceCategories"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={field.value?.includes("experiences")}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, "experiences"]);
                                  } else {
                                    field.onChange(currentValues.filter(v => v !== "experiences"));
                                  }
                                }}
                              />
                              <div>
                                <h4 className="font-semibold text-purple-900">🎯 Esperienze Premium</h4>
                                <p className="text-xs text-purple-600">
                                  Tour guidati, escursioni speciali, eventi privati
                                </p>
                                <Badge variant="secondary" className="mt-1 text-xs">+30% guadagni</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={field.value?.includes("charter")}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, "charter"]);
                                  } else {
                                    field.onChange(currentValues.filter(v => v !== "charter"));
                                  }
                                }}
                              />
                              <div>
                                <h4 className="font-semibold text-purple-900">⛵ Charter Premium</h4>
                                <p className="text-xs text-purple-600">
                                  Servizi con skipper professionale e equipaggio
                                </p>
                                <Badge variant="secondary" className="mt-1 text-xs">+50% guadagni</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600">
                      💡 <strong>Consiglio:</strong> I proprietari che offrono servizi premium guadagnano in media il 40% in più 
                      e ricevono prenotazioni tutto l'anno, anche in bassa stagione.
                    </p>
                  </div>
                </div>

                {/* Boat Details Section */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Dettagli Imbarcazione</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="boatName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome dell'imbarcazione *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Luna del Mare" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo di imbarcazione *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Barca a vela, Motoscafo, Yacht" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="boatBrand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca/Cantiere *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Beneteau, Azimut" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modello *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Oceanis 46, Magellano 43" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anno di costruzione *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="2020" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="boatLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lunghezza (m) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="12.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacità persone *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="8" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatCabins"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N. Cabine</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="boatBathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N. Bagni</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Harbor and Location */}
                <div className="bg-green-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">⚓ Ubicazione e Porto Base</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="harborName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome del porto *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Marina di Civitavecchia" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="harborAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indirizzo del porto *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Via del Porto 123, 00053 Civitavecchia" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Equipment and Amenities */}
                <div className="bg-orange-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-orange-900 mb-4">🛠️ Equipaggiamenti e Accessori</h3>
                  
                  <FormField
                    control={form.control}
                    name="boatEquipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipaggiamenti di sicurezza *</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Elenca tutti gli equipaggiamenti di sicurezza: giubbotti salvagente, zattera, radio VHF, GPS, radar, ecoscandaglio, estintori, razzi, ecc."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="boatAmenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comfort e accessori aggiuntivi</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="es. Aria condizionata, generatore, tender, attrezzatura pesca, snorkeling, WiFi, sistema audio, cucina completa, frigorifero, doccia esterna, ecc."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Documentation */}
                <div className="bg-purple-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">📄 Documentazione e Certificazioni</h3>
                  
                  <FormField
                    control={form.control}
                    name="boatLicense"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numero di matricola/immatricolazione *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="es. IT123456789" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="insuranceCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compagnia assicurativa *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="es. Generali, UnipolSai" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="insuranceExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scadenza assicurazione *</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Commercial Details */}
                <div className="bg-indigo-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">💰 Informazioni Commerciali</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dailyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prezzo giornaliero (€) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="licenseRequired"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patente nautica richiesta *</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full p-2 border rounded-md">
                              <option value="">Seleziona...</option>
                              <option value="none">Nessuna patente</option>
                              <option value="coastal">Patente entro le 12 miglia</option>
                              <option value="unlimited">Patente senza limiti</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Owner Experience */}
                <FormField
                  control={form.control}
                  name="ownerExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>La tua esperienza nautica *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Descrivi la tua esperienza come marinaio/proprietario, anni di navigazione, zone che conosci meglio, eventuali certificazioni..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Additional Service Information */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Informazioni Aggiuntive</h3>
                  
                  <FormField
                    control={form.control}
                    name="specialNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note speciali e regole della barca</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="es. Non è permesso fumare, animali domestici benvenuti, ideale per famiglie, esperienza navigazione richiesta, ecc."
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availabilityNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilità e periodi preferiti</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="es. Disponibile tutto l'anno, preferisco noleggi di almeno 3 giorni, non disponibile ad agosto, ecc."
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-3">📋 Documentazione Richiesta (da inviare dopo la registrazione)</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Certificato di navigabilità</li>
                    <li>• Polizza assicurativa RC e corpo</li>
                    <li>• Patente nautica del proprietario</li>
                    <li>• Documento di identità</li>
                    <li>• Foto dell'imbarcazione (esterne e interne)</li>
                  </ul>
                  
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Commissione SeaGO: 15%</p>
                    <p className="text-sm text-gray-700">
                      <strong>Importante:</strong> Il 15% di commissione viene pagato direttamente dal cliente, 
                      non viene detratto dai tuoi guadagni. Tu ricevi il 100% del prezzo che hai impostato.
                    </p>
                  </div>
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
                          Inclusi: commissione 15% pagata dal cliente, assicurazione, politiche di cancellazione, standard di sicurezza e qualità del servizio
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
                    {registrationMutation.isPending ? "Invio..." : "Completa Registrazione Dettagliata"}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Cliccando "Completa Registrazione" accetti i nostri termini di servizio e la politica sulla privacy. 
                  Un nostro specialista ti contatterà entro 24 ore per finalizzare la verifica.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}