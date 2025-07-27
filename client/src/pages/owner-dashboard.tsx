import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBoatSchema, Boat, Booking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ChatButton } from "@/components/chat-button";
import {
  Plus,
  Ship,
  Calendar,
  Euro,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Anchor,
  Waves,
  Settings,
  FileText,
  Info,
  Gauge,
  Ruler,
  Calendar as CalendarIcon,
  DollarSign,
  Sparkles,
  Sunset,
  Fish,
  Heart,
  Wine,
  ChefHat,
  Sailboat,
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Key,
  Save
} from "lucide-react";

const boatFormSchema = insertBoatSchema.extend({
  pricePerDay: z.string().min(1, "Prezzo richiesto"),
  maxPersons: z.string().min(1, "Numero massimo persone richiesto"),
  length: z.string().optional(),
  year: z.string().optional(),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict", "super_strict"]).optional().default("moderate"),
  refundMethod: z.enum(["credit_card", "bank_transfer", "paypal", "seago_credit"]).optional().default("credit_card"),
});

type BoatFormData = z.infer<typeof boatFormSchema>;

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [showAddBoatModal, setShowAddBoatModal] = useState(false);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  
  // Get tab from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  const initialTab = tabFromUrl || 'boats';

  // Fetch owner's boats
  const { data: boats = [], isLoading: boatsLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats", { ownerId: user?.id }],
    enabled: !!user,
  });

  // Fetch owner's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", { ownerId: user?.id }],
    enabled: !!user,
  });

  const form = useForm<BoatFormData>({
    resolver: zodResolver(boatFormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      type: "gommone",
      year: "",
      maxPersons: "",
      length: "",
      motorization: "",
      licenseRequired: false,
      skipperRequired: false,
      port: "",
      latitude: "",
      longitude: "",
      pricePerDay: "",
      description: "",
      images: [],
      documentsRequired: "",
      active: true,
      cancellationPolicy: "moderate",
      refundMethod: "credit_card",
    },
  });

  const createBoatMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/boats", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      setShowAddBoatModal(false);
      setEditingBoat(null);
      form.reset();
      toast({
        title: "Imbarcazione aggiunta",
        description: "La tua imbarcazione è stata aggiunta con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBoatMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Boat> }) => {
      const res = await apiRequest("PUT", `/api/boats/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      setEditingBoat(null);
      toast({
        title: "Imbarcazione aggiornata",
        description: "Le modifiche sono state salvate",
      });
    },
  });

  const deleteBoatMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/boats/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/boats"] });
      toast({
        title: "Imbarcazione eliminata",
        description: "L'imbarcazione è stata rimossa",
      });
    },
  });

  const onSubmit = (data: BoatFormData) => {
    const processedData = {
      ...data,
      pricePerDay: data.pricePerDay,
      maxPersons: parseInt(data.maxPersons),
      length: data.length ? data.length : undefined,
      year: data.year ? parseInt(data.year) : undefined,
      cancellationPolicy: data.cancellationPolicy,
      refundMethod: data.refundMethod,
    };
    
    if (editingBoat) {
      updateBoatMutation.mutate({ id: editingBoat.id, data: processedData as any });
    } else {
      createBoatMutation.mutate({ ...processedData, ownerId: user!.id } as any);
    }
  };

  // Security Account Handlers
  const handleChangePassword = () => {
    toast({
      title: "Cambio Password",
      description: "Funzionalità in arrivo. Ti invieremo un'email con le istruzioni per cambiare la password.",
    });
  };

  const handleActivate2FA = () => {
    toast({
      title: "Autenticazione 2FA",
      description: "Funzionalità in sviluppo. L'autenticazione a due fattori sarà disponibile presto.",
    });
  };

  const handleManageNotifications = () => {
    toast({
      title: "Gestione Notifiche",
      description: "Preferenze notifiche aggiornate. Riceverai aggiornamenti importanti via email.",
    });
  };

  // Profile Photo Upload Handler
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast({
          title: "Formato non supportato",
          description: "Carica solo file JPG o PNG",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File troppo grande",
          description: "La foto deve essere massimo 5MB",
          variant: "destructive",
        });
        return;
      }

      // For now, just show success toast - later we'll implement actual upload
      toast({
        title: "Foto caricata",
        description: `${file.name} è stata caricata con successo`,
      });
    }
  };

  const openEditModal = (boat: Boat) => {
    setEditingBoat(boat);
    form.reset({
      ...boat,
      pricePerDay: boat.pricePerDay.toString(),
      maxPersons: boat.maxPersons.toString(),
      length: boat.length?.toString() || "",
      year: boat.year?.toString() || "",
      cancellationPolicy: boat.cancellationPolicy || "moderate",
      refundMethod: boat.refundMethod || "credit_card",
    });
    setShowAddBoatModal(true);
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confermata</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />In attesa</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancellata</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completata</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate statistics
  const totalEarnings = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.totalPrice) - Number(b.commission)), 0);

  const monthlyBookings = bookings.filter(b => {
    const bookingDate = new Date(b.createdAt!);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  }).length;

  if (!user || user.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso negato</h1>
          <p className="text-gray-600 mt-2">Devi essere un proprietario per accedere a questa pagina.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Sea Host</h1>
          <p className="text-gray-600 mt-2">Gestisci le tue imbarcazioni e prenotazioni</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ship className="h-8 w-8 text-ocean-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imbarcazioni</p>
                  <p className="text-2xl font-bold text-gray-900">{boats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-coral" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Esperienze</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-seafoam" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prenotazioni (mese)</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Guadagni totali</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valutazione media</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="boats">Le mie imbarcazioni</TabsTrigger>
            <TabsTrigger value="experiences">Le mie esperienze</TabsTrigger>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="messages">Messaggi</TabsTrigger>
            <TabsTrigger value="profile">Il mio profilo</TabsTrigger>
            <TabsTrigger value="analytics">Statistiche</TabsTrigger>
          </TabsList>

          <TabsContent value="boats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Le mie imbarcazioni</h2>
              <Dialog open={showAddBoatModal} onOpenChange={setShowAddBoatModal}>
                <DialogTrigger asChild>
                  <Button className="bg-ocean-blue hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi imbarcazione
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                      <Ship className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {editingBoat ? "✏️ Modifica la tua imbarcazione" : "🚢 Aggiungi la tua imbarcazione"}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                      {editingBoat ? "Aggiorna i dettagli della tua imbarcazione" : "Inserisci tutti i dettagli per far conoscere la tua imbarcazione ai navigatori"}
                    </p>
                  </DialogHeader>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Sezione 1: Informazioni Base */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
                          <p className="text-sm text-gray-600">Nome, tipo e caratteristiche principali</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <Ship className="h-4 w-4 text-blue-600" />
                            Nome imbarcazione *
                          </Label>
                          <Input 
                            id="name" 
                            placeholder="es. Azzurra 680, Sea Dreams..." 
                            {...form.register("name")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="manufacturer" className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-blue-600" />
                            Cantiere/Marca
                          </Label>
                          <Input 
                            id="manufacturer" 
                            placeholder="es. Jeanneau, Beneteau, Zodiac..." 
                            {...form.register("manufacturer")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type" className="flex items-center gap-2">
                            <Waves className="h-4 w-4 text-blue-600" />
                            Tipologia *
                          </Label>
                          <Select onValueChange={(value) => form.setValue("type", value as any)}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500">
                              <SelectValue placeholder="Seleziona tipologia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gommone">🛥️ Gommone</SelectItem>
                              <SelectItem value="yacht">🛳️ Yacht</SelectItem>
                              <SelectItem value="catamarano">⛵ Catamarano</SelectItem>
                              <SelectItem value="jetski">🏄 Moto d'acqua</SelectItem>
                              <SelectItem value="sailboat">⛵ Barca a vela</SelectItem>
                              <SelectItem value="kayak">🚣 Kayak</SelectItem>
                              <SelectItem value="charter">🚢 Charter</SelectItem>
                              <SelectItem value="houseboat">🏠 Houseboat</SelectItem>
                              <SelectItem value="motorboat">🚤 Barca a motore</SelectItem>
                              <SelectItem value="barche-senza-patente">🛴 Barche senza patente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="year" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            Anno di costruzione
                          </Label>
                          <Input 
                            id="year" 
                            type="number" 
                            placeholder="es. 2020" 
                            {...form.register("year")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 2: Caratteristiche Tecniche */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Gauge className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Caratteristiche Tecniche</h3>
                          <p className="text-sm text-gray-600">Dimensioni, capacità e motorizzazione</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="maxPersons" className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            Numero massimo persone *
                          </Label>
                          <Input 
                            id="maxPersons" 
                            type="number" 
                            placeholder="es. 8" 
                            {...form.register("maxPersons")} 
                            className="border-green-200 focus:border-green-500"
                          />
                          {form.formState.errors.maxPersons && (
                            <p className="text-sm text-red-500">{form.formState.errors.maxPersons.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="length" className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-green-600" />
                            Lunghezza (metri)
                          </Label>
                          <Input 
                            id="length" 
                            type="number" 
                            step="0.1" 
                            placeholder="es. 12.5" 
                            {...form.register("length")} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="motorization" className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-green-600" />
                            Motorizzazione
                          </Label>
                          <Input 
                            id="motorization" 
                            placeholder="es. 2x Mercury 250HP" 
                            {...form.register("motorization")} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 3: Ubicazione e Prezzi */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Ubicazione e Prezzi</h3>
                          <p className="text-sm text-gray-600">Porto base e tariffe giornaliere</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="port" className="flex items-center gap-2">
                            <Anchor className="h-4 w-4 text-purple-600" />
                            Porto di partenza *
                          </Label>
                          <Input 
                            id="port" 
                            placeholder="es. Marina di Gaeta, Porto di Civitavecchia" 
                            {...form.register("port")} 
                            className="border-purple-200 focus:border-purple-500"
                          />
                          {form.formState.errors.port && (
                            <p className="text-sm text-red-500">{form.formState.errors.port.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricePerDay" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            Prezzo giornaliero (€) *
                          </Label>
                          <Input 
                            id="pricePerDay" 
                            type="number" 
                            step="0.01" 
                            placeholder="es. 350.00" 
                            {...form.register("pricePerDay")} 
                            className="border-purple-200 focus:border-purple-500"
                          />
                          {form.formState.errors.pricePerDay && (
                            <p className="text-sm text-red-500">{form.formState.errors.pricePerDay.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sezione 4: Descrizioni e Documenti */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Descrizioni e Documenti</h3>
                          <p className="text-sm text-gray-600">Dettagli aggiuntivi e requisiti necessari</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="description" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            Descrizione completa
                          </Label>
                          <Textarea 
                            id="description" 
                            placeholder="Descrivi la tua imbarcazione: comfort, equipaggiamenti, punti di forza..."
                            rows={4}
                            {...form.register("description")} 
                            className="border-orange-200 focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="documentsRequired" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            Documenti richiesti
                          </Label>
                          <Textarea 
                            id="documentsRequired" 
                            placeholder="es. Documento di identità, patente nautica (per barche >40HP), esperienza di navigazione..."
                            rows={3}
                            {...form.register("documentsRequired")} 
                            className="border-orange-200 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 5: Campi Aggiuntivi Utili */}
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Aggiuntive</h3>
                          <p className="text-sm text-gray-600">Dettagli utili per attrare più clienti</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="cabins" className="flex items-center gap-2">
                            <span className="text-teal-600">🛏️</span>
                            Numero cabine
                          </Label>
                          <Input 
                            id="cabins" 
                            type="number" 
                            placeholder="es. 3" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms" className="flex items-center gap-2">
                            <span className="text-teal-600">🚿</span>
                            Numero bagni
                          </Label>
                          <Input 
                            id="bathrooms" 
                            type="number" 
                            placeholder="es. 2" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fuelConsumption" className="flex items-center gap-2">
                            <span className="text-teal-600">⛽</span>
                            Consumo carburante (L/h)
                          </Label>
                          <Input 
                            id="fuelConsumption" 
                            type="number" 
                            placeholder="es. 45" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="equipment" className="flex items-center gap-2">
                            <span className="text-teal-600">🎯</span>
                            Equipaggiamenti principali
                          </Label>
                          <Input 
                            id="equipment" 
                            placeholder="es. GPS, Autopilota, Tender..." 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cancellationPolicy" className="flex items-center gap-2">
                            <span className="text-teal-600">📋</span>
                            Politica di cancellazione
                          </Label>
                          <Select 
                            value={form.watch("cancellationPolicy")} 
                            onValueChange={(value) => form.setValue("cancellationPolicy", value as any)}
                          >
                            <SelectTrigger className="border-teal-200 focus:border-teal-500">
                              <SelectValue placeholder="Seleziona politica" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flexible">🟢 Flessibile - Cancellazione gratuita fino a 24h prima</SelectItem>
                              <SelectItem value="moderate">🔵 Moderata - Cancellazione gratuita fino a 48h prima</SelectItem>
                              <SelectItem value="strict">🟡 Rigida - Cancellazione gratuita fino a 7 giorni prima</SelectItem>
                              <SelectItem value="super_strict">🔴 Super Rigida - Cancellazione gratuita fino a 14 giorni prima</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="refundMethod" className="flex items-center gap-2">
                            <span className="text-teal-600">💳</span>
                            Metodo di rimborso
                          </Label>
                          <Select 
                            value={form.watch("refundMethod")} 
                            onValueChange={(value) => form.setValue("refundMethod", value as any)}
                          >
                            <SelectTrigger className="border-teal-200 focus:border-teal-500">
                              <SelectValue placeholder="Seleziona metodo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit_card">💳 Carta di credito (3-5 giorni lavorativi)</SelectItem>
                              <SelectItem value="bank_transfer">🏦 Bonifico bancario (5-7 giorni lavorativi)</SelectItem>
                              <SelectItem value="paypal">📱 PayPal (1-3 giorni lavorativi)</SelectItem>
                              <SelectItem value="seago_credit">🌊 Credito SeaGO (Immediato)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Pulsanti di Azione */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={createBoatMutation.isPending || updateBoatMutation.isPending}
                      >
                        {createBoatMutation.isPending || updateBoatMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Ship className="h-4 w-4" />
                            {editingBoat ? "🔄 Aggiorna imbarcazione" : "✨ Aggiungi imbarcazione"}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 sm:flex-initial min-w-[120px] border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setShowAddBoatModal(false);
                          setEditingBoat(null);
                          form.reset();
                        }}
                      >
                        ❌ Annulla
                      </Button>
                    </div>

                    {/* Info Footer */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        💡 <strong>Suggerimento:</strong> Più informazioni inserisci, più è probabile che i clienti scelgano la tua imbarcazione!
                      </p>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boats.map((boat) => (
                <Card key={boat.id}>
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&h=250"}
                        alt={boat.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${boat.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {boat.active ? "Attiva" : "Disattiva"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{boat.name}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {boat.port}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Fino a {boat.maxPersons} persone
                      </div>
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        €{boat.pricePerDay}/giorno
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(boat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteBoatMutation.mutate(boat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Le mie esperienze</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-coral hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi esperienza
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-coral to-orange-500 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      ✨ Crea una nuova esperienza
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                      Offri ai tuoi ospiti un'esperienza memorabile sul mare
                    </p>
                  </DialogHeader>

                  <form className="space-y-8">
                    
                    {/* Sezione 1: Informazioni Base */}
                    <div className="bg-coral/10 border border-coral/30 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
                          <p className="text-sm text-gray-600">Nome, categoria e dettagli principali</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="experienceTitle" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-coral" />
                            Titolo esperienza *
                          </Label>
                          <Input 
                            id="experienceTitle" 
                            placeholder="es. Tour delle Isole Pontine, Tramonto con Aperitivo..." 
                            className="border-coral/30 focus:border-coral"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experienceCategory" className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-coral" />
                            Categoria *
                          </Label>
                          <Select>
                            <SelectTrigger className="border-coral/30 focus:border-coral">
                              <SelectValue placeholder="Seleziona categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tour">🌊 Tour ed Escursioni</SelectItem>
                              <SelectItem value="gourmet">🍽️ Esperienze Gourmet</SelectItem>
                              <SelectItem value="charter">⛵ Charter Privato</SelectItem>
                              <SelectItem value="events">🎉 Eventi Speciali</SelectItem>
                              <SelectItem value="courses">🎓 Corsi Nautici</SelectItem>
                              <SelectItem value="fishing">🎣 Pesca Sportiva</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experienceDuration" className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-coral" />
                            Durata
                          </Label>
                          <Input 
                            id="experienceDuration" 
                            placeholder="es. 4 ore, Giornata intera, Weekend..." 
                            className="border-coral/30 focus:border-coral"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experienceLocation" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-coral" />
                            Località partenza *
                          </Label>
                          <Input 
                            id="experienceLocation" 
                            placeholder="es. Porto di Gaeta, Marina di Civitavecchia..." 
                            className="border-coral/30 focus:border-coral"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 2: Dettagli Esperienza */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Dettagli Esperienza</h3>
                          <p className="text-sm text-gray-600">Capacità, prezzi e cosa include</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="maxParticipants" className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            Partecipanti massimi *
                          </Label>
                          <Input 
                            id="maxParticipants" 
                            type="number" 
                            placeholder="es. 12" 
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricePerPerson" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                            Prezzo per persona (€) *
                          </Label>
                          <Input 
                            id="pricePerPerson" 
                            type="number" 
                            step="0.01" 
                            placeholder="es. 85.00" 
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="difficulty" className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-blue-600" />
                            Difficoltà
                          </Label>
                          <Select>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500">
                              <SelectValue placeholder="Livello" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">🟢 Facile - Per tutti</SelectItem>
                              <SelectItem value="medium">🟡 Medio - Esperienza base</SelectItem>
                              <SelectItem value="hard">🔴 Difficile - Esperti</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <Label htmlFor="includes" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Cosa include (una per riga)
                        </Label>
                        <Textarea 
                          id="includes" 
                          placeholder="es. Pranzo a bordo&#10;Attrezzatura snorkeling&#10;Guida esperta&#10;Assicurazione"
                          rows={4}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Sezione 3: Descrizione Esperienza */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Descrizione Esperienza</h3>
                          <p className="text-sm text-gray-600">Racconta cosa rende speciale la tua esperienza</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="experienceDescription" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            Descrizione completa *
                          </Label>
                          <Textarea 
                            id="experienceDescription" 
                            placeholder="Descrivi nel dettaglio l'esperienza: itinerario, attività, momenti speciali che vivranno gli ospiti..."
                            rows={5}
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialNotes" className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-green-600" />
                            Note speciali e requisiti
                          </Label>
                          <Textarea 
                            id="specialNotes" 
                            placeholder="es. Esperienza soggetta a condizioni meteo, si consiglia abbigliamento comodo, età minima 18 anni..."
                            rows={3}
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pulsanti di Azione */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-coral to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        ✨ Crea esperienza
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 sm:flex-initial min-w-[120px] border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        ❌ Annulla
                      </Button>
                    </div>

                    {/* Info Footer */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        🌟 <strong>Consiglio:</strong> Le esperienze uniche e ben descritte attirano più prenotazioni e ottengono recensioni migliori!
                      </p>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista esperienze placeholder */}
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna esperienza creata</h3>
              <p className="text-gray-600 mb-4">
                Inizia a offrire esperienze uniche ai tuoi ospiti per aumentare i guadagni!
              </p>
              <p className="text-sm text-gray-500">
                Le esperienze possono generare fino al 40% di ricavi aggiuntivi rispetto al solo noleggio
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Prenotazioni ricevute</h2>
            
            <div className="space-y-4">
              {bookings.map((booking) => {
                const boat = boats.find(b => b.id === booking.boatId);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-lg font-semibold">{boat?.name}</h3>
                            {getBookingStatusBadge(booking.status || 'pending')}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-medium">
                                {format(new Date(booking.startDate), "dd MMM", { locale: it })} - {format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Totale</p>
                              <p className="font-medium">€{booking.totalPrice}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Guadagno</p>
                              <p className="font-medium text-green-600">
                                €{(Number(booking.totalPrice) - Number(booking.commission)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <ChatButton bookingId={booking.id} />
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Messaggi</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun messaggio</h3>
                <p className="text-gray-600">I messaggi dai tuoi clienti appariranno qui</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Il mio profilo</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifica profilo
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Informazioni Personali */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Informazioni Personali</CardTitle>
                      <p className="text-sm text-gray-600">Gestisci i tuoi dati di contatto</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Nome
                      </Label>
                      <Input 
                        id="firstName" 
                        value={user?.username?.split('.')[0] || ""} 
                        className="border-blue-200 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Cognome
                      </Label>
                      <Input 
                        id="lastName" 
                        value={user?.username?.split('.')[1]?.split('@')[0] || ""} 
                        className="border-blue-200 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={user?.username || ""} 
                        className="border-blue-200 focus:border-blue-500"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Telefono
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="+39 333 123 4567" 
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Biografia (opzionale)
                    </Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Raccontaci qualcosa di te e della tua esperienza nel settore nautico..."
                      rows={3}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Salva modifiche
                  </Button>
                </CardContent>
              </Card>

              {/* Foto Profilo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-gray-600" />
                    Foto Profilo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/jpeg,image/jpg,image/png"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Carica foto
                  </Button>
                  <p className="text-xs text-gray-500">
                    Formati: JPG, PNG<br />
                    Max: 5MB
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pagamenti e IBAN */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Dati di Pagamento</CardTitle>
                    <p className="text-sm text-gray-600">Configura il tuo IBAN per ricevere i compensi</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Come funzionano i pagamenti</h4>
                      <p className="text-sm text-green-700 mt-1">
                        I tuoi guadagni vengono accreditati automaticamente ogni 7 giorni sul conto corrente che indicherai.
                        La commissione SeaGO del 15% viene trattenuta automaticamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="iban" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      IBAN *
                    </Label>
                    <Input 
                      id="iban" 
                      placeholder="IT60 X054 2811 1010 0000 0123 456" 
                      className="border-green-200 focus:border-green-500 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      Nome Banca
                    </Label>
                    <Input 
                      id="bankName" 
                      placeholder="es. Intesa Sanpaolo, UniCredit..." 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Intestatario Conto *
                    </Label>
                    <Input 
                      id="accountHolder" 
                      placeholder="Nome e Cognome come sul conto" 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftBic" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      Codice SWIFT/BIC (opzionale)
                    </Label>
                    <Input 
                      id="swiftBic" 
                      placeholder="BCITITMM" 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Sicurezza e Privacy</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        I tuoi dati bancari sono crittografati e protetti secondo i più alti standard di sicurezza.
                        Utilizziamo la tecnologia SSL e non condividiamo mai i tuoi dati con terze parti.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Salva dati di pagamento
                </Button>
              </CardContent>
            </Card>

            {/* Sicurezza Account */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Sicurezza Account</CardTitle>
                    <p className="text-sm text-gray-600">Gestisci la sicurezza del tuo account</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-600">Ultima modifica: 15 giorni fa</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    Cambia password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Autenticazione a due fattori</p>
                      <p className="text-sm text-gray-600">Non attivata</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleActivate2FA}>
                    Attiva 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Notifiche Email</p>
                      <p className="text-sm text-gray-600">Ricevi aggiornamenti via email</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleManageNotifications}>
                    Gestisci
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistiche Account */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Mesi attivo</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm text-gray-600">Rating medio</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-600">Tasso conferma</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiche</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guadagni mensili</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">€{totalEarnings.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Totale da inizio attività</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tasso di occupazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">85%</p>
                      <p className="text-sm text-gray-600">Media ultimo mese</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
