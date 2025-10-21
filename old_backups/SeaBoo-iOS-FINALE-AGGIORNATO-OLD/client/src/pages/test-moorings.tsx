import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Phone, Radio, Euro, Wifi, Fuel, Car, Utensils } from "lucide-react";
import { insertMooringSchema, insertMooringBookingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

// Form schemas
const addMooringSchema = insertMooringSchema.extend({
  services: z.object({
    elettricita: z.boolean().optional(),
    acqua: z.boolean().optional(),
    wifi: z.boolean().optional(),
    carburante: z.boolean().optional(),
    videosorveglianza: z.boolean().optional(),
    cantiere: z.boolean().optional(),
    ristorante: z.boolean().optional(),
    parcheggio: z.boolean().optional(),
    servizio_tender: z.boolean().optional(),
    assistenza: z.boolean().optional(),
    ormeggio_assistito: z.boolean().optional(),
  }).optional(),
});

const bookMooringSchema = insertMooringBookingSchema.extend({
  startDate: z.date(),
  endDate: z.date(),
  boatLength: z.number().min(1).max(50),
  totalPrice: z.number().min(1),
});

interface Mooring {
  id: number;
  managerId: number;
  name: string;
  port: string;
  location: string;
  type: 'pontile' | 'boa' | 'ancora' | 'gavitello';
  maxLength: string;
  maxBeam: string;
  depth: string;
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  latitude: string;
  longitude: string;
  services: any;
  description: string;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactVHF: string;
  rating: string;
  reviewCount: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

function TestMoorings() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    port: "",
  });

  // Fetch moorings
  const { data: moorings = [], isLoading: mooringsLoading } = useQuery<Mooring[]>({
    queryKey: ["/api/moorings", filters],
    enabled: true,
  });

  // Add mooring form
  const addMooringForm = useForm({
    resolver: zodResolver(addMooringSchema),
    defaultValues: {
      name: "",
      port: "",
      location: "",
      type: "pontile" as const,
      maxLength: 15,
      maxBeam: 4.5,
      depth: 3.5,
      pricePerDay: 65,
      pricePerWeek: 420,
      pricePerMonth: 1600,
      latitude: 42.0935,
      longitude: 11.7965,
      description: "",
      contactName: "",
      contactPhone: "",
      contactVHF: "",
      services: {
        elettricita: true,
        acqua: true,
        wifi: false,
        carburante: false,
        videosorveglianza: false,
        cantiere: false,
        ristorante: false,
        parcheggio: false,
        servizio_tender: false,
        assistenza: true,
        ormeggio_assistito: false,
      },
    },
  });

  // Book mooring form
  const bookMooringForm = useForm({
    resolver: zodResolver(bookMooringSchema),
    defaultValues: {
      mooringId: 0,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      boatLength: 12,
      boatName: "",
      boatType: "",
      totalPrice: 0,
      specialRequests: "",
      notes: "",
    },
  });

  // Create mooring mutation
  const createMooringMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/moorings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Ormeggio creato",
        description: "Il nuovo ormeggio è stato aggiunto con successo.",
      });
      addMooringForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/moorings"] });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile creare l'ormeggio. Controlla di essere autenticato.",
        variant: "destructive",
      });
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/mooring-bookings", "POST", data),
    onSuccess: () => {
      toast({
        title: "Prenotazione creata",
        description: "La prenotazione dell'ormeggio è stata creata con successo.",
      });
      bookMooringForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile creare la prenotazione. Controlla di essere autenticato.",
        variant: "destructive",
      });
    },
  });

  const onAddMooring = (data: any) => {
    createMooringMutation.mutate(data);
  };

  const onBookMooring = (data: any) => {
    createBookingMutation.mutate(data);
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'carburante': return <Fuel className="h-4 w-4" />;
      case 'parcheggio': return <Car className="h-4 w-4" />;
      case 'ristorante': return <Utensils className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pontile': return 'bg-blue-100 text-blue-800';
      case 'boa': return 'bg-green-100 text-green-800';
      case 'gavitello': return 'bg-purple-100 text-purple-800';
      case 'ancora': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Test Sistema Ormeggi SeaBoo</h1>
        <p className="text-muted-foreground">
          Test completo delle funzionalità: visualizzazione, creazione, prenotazione e pagamento ormeggi
        </p>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista Ormeggi</TabsTrigger>
          <TabsTrigger value="add">Aggiungi Ormeggio</TabsTrigger>
          <TabsTrigger value="book">Prenota Ormeggio</TabsTrigger>
        </TabsList>

        {/* Lista ormeggi */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtri Ricerca</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type-filter">Tipo Ormeggio</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tutti i tipi</SelectItem>
                    <SelectItem value="pontile">Pontile</SelectItem>
                    <SelectItem value="boa">Boa</SelectItem>
                    <SelectItem value="gavitello">Gavitello</SelectItem>
                    <SelectItem value="ancora">Ancora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location-filter">Località</Label>
                <Input
                  placeholder="Es. Roma, Gaeta..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="port-filter">Porto</Label>
                <Input
                  placeholder="Es. Marina di..."
                  value={filters.port}
                  onChange={(e) => setFilters({...filters, port: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {mooringsLoading ? (
            <div className="text-center py-8">Caricamento ormeggi...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moorings.map((mooring) => (
                <Card key={mooring.id} className="overflow-hidden">
                  {mooring.images?.[0] && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={mooring.images[0]}
                        alt={mooring.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{mooring.name}</h3>
                      {mooring.featured && (
                        <Badge variant="default">In evidenza</Badge>
                      )}
                    </div>
                    
                    <Badge className={`mb-2 ${getTypeColor(mooring.type)}`}>
                      {mooring.type.charAt(0).toUpperCase() + mooring.type.slice(1)}
                    </Badge>

                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mooring.port}, {mooring.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {mooring.contactName} - {mooring.contactPhone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Radio className="h-4 w-4" />
                        VHF {mooring.contactVHF}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm mb-4">
                      <div>Lunghezza max: {mooring.maxLength}m</div>
                      <div>Larghezza max: {mooring.maxBeam}m</div>
                      <div>Profondità: {mooring.depth}m</div>
                    </div>

                    {mooring.services && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {Object.entries(mooring.services)
                          .filter(([_, enabled]) => enabled)
                          .map(([service, _]) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {getServiceIcon(service)}
                              <span className="ml-1">{service.replace('_', ' ')}</span>
                            </Badge>
                          ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-semibold">
                          <Euro className="h-4 w-4" />
                          {mooring.pricePerDay}/giorno
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {mooring.pricePerWeek}/settimana
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Rating: {mooring.rating}</div>
                        <div className="text-xs text-muted-foreground">
                          {mooring.reviewCount} recensioni
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                      {mooring.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Aggiungi ormeggio */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Aggiungi Nuovo Ormeggio</CardTitle>
              <CardDescription>
                Crea un nuovo ormeggio come gestore/proprietario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addMooringForm.handleSubmit(onAddMooring)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Ormeggio</Label>
                    <Input
                      {...addMooringForm.register("name")}
                      placeholder="Es. Pontile Marina Roma A1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select onValueChange={(value) => addMooringForm.setValue("type", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pontile">Pontile</SelectItem>
                        <SelectItem value="boa">Boa</SelectItem>
                        <SelectItem value="gavitello">Gavitello</SelectItem>
                        <SelectItem value="ancora">Ancora</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="port">Porto</Label>
                    <Input
                      {...addMooringForm.register("port")}
                      placeholder="Es. Marina di Civitavecchia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Località</Label>
                    <Input
                      {...addMooringForm.register("location")}
                      placeholder="Es. Civitavecchia, Roma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="maxLength">Lunghezza Max (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...addMooringForm.register("maxLength", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxBeam">Larghezza Max (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...addMooringForm.register("maxBeam", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth">Profondità (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...addMooringForm.register("depth", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pricePerDay">Prezzo/Giorno (€)</Label>
                    <Input
                      type="number"
                      {...addMooringForm.register("pricePerDay", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerWeek">Prezzo/Settimana (€)</Label>
                    <Input
                      type="number"
                      {...addMooringForm.register("pricePerWeek", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pricePerMonth">Prezzo/Mese (€)</Label>
                    <Input
                      type="number"
                      {...addMooringForm.register("pricePerMonth", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactName">Nome Contatto</Label>
                    <Input
                      {...addMooringForm.register("contactName")}
                      placeholder="Es. Marco Rossi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Telefono</Label>
                    <Input
                      {...addMooringForm.register("contactPhone")}
                      placeholder="Es. +39 333 1234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactVHF">Canale VHF</Label>
                    <Input
                      {...addMooringForm.register("contactVHF")}
                      placeholder="Es. Ch 09"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    {...addMooringForm.register("description")}
                    placeholder="Descrivi l'ormeggio, i servizi inclusi e le caratteristiche..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Servizi Disponibili</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {[
                      'elettricita', 'acqua', 'wifi', 'carburante',
                      'videosorveglianza', 'cantiere', 'ristorante', 'parcheggio',
                      'servizio_tender', 'assistenza', 'ormeggio_assistito'
                    ].map((service) => (
                      <label key={service} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...addMooringForm.register(`services.${service}` as any)}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">
                          {service.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={createMooringMutation.isPending}
                  className="w-full"
                >
                  {createMooringMutation.isPending ? "Creando..." : "Crea Ormeggio"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prenota ormeggio */}
        <TabsContent value="book">
          <Card>
            <CardHeader>
              <CardTitle>Prenota Ormeggio</CardTitle>
              <CardDescription>
                Testa il processo di prenotazione e pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={bookMooringForm.handleSubmit(onBookMooring)} className="space-y-6">
                <div>
                  <Label htmlFor="mooringId">Seleziona Ormeggio</Label>
                  <Select onValueChange={(value) => bookMooringForm.setValue("mooringId", Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Scegli un ormeggio" />
                    </SelectTrigger>
                    <SelectContent>
                      {moorings.map((mooring) => (
                        <SelectItem key={mooring.id} value={mooring.id.toString()}>
                          <span className="text-gray-900">{mooring.name} - €{mooring.pricePerDay}/giorno</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data Inizio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookMooringForm.watch("startDate") ? 
                            format(bookMooringForm.watch("startDate"), "dd/MM/yyyy") : 
                            "Seleziona data"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookMooringForm.watch("startDate")}
                          onSelect={(date) => date && bookMooringForm.setValue("startDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>Data Fine</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookMooringForm.watch("endDate") ? 
                            format(bookMooringForm.watch("endDate"), "dd/MM/yyyy") : 
                            "Seleziona data"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookMooringForm.watch("endDate")}
                          onSelect={(date) => date && bookMooringForm.setValue("endDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boatLength">Lunghezza Barca (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...bookMooringForm.register("boatLength", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalPrice">Prezzo Totale (€)</Label>
                    <Input
                      type="number"
                      {...bookMooringForm.register("totalPrice", { valueAsNumber: true })}
                      placeholder="Calcola automaticamente o inserisci manualmente"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="boatName">Nome Barca (opzionale)</Label>
                    <Input
                      {...bookMooringForm.register("boatName")}
                      placeholder="Es. Luna Rossa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="boatType">Tipo Barca (opzionale)</Label>
                    <Input
                      {...bookMooringForm.register("boatType")}
                      placeholder="Es. Barca a vela, Motoscafo"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Richieste Speciali</Label>
                  <Textarea
                    {...bookMooringForm.register("specialRequests")}
                    placeholder="Eventuali richieste particolari..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Note</Label>
                  <Textarea
                    {...bookMooringForm.register("notes")}
                    placeholder="Note aggiuntive..."
                    rows={2}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={createBookingMutation.isPending}
                  className="w-full"
                >
                  {createBookingMutation.isPending ? "Prenotando..." : "Crea Prenotazione"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TestMooringsWithStripe() {
  return (
    <Elements stripe={stripePromise}>
      <TestMoorings />
    </Elements>
  );
}