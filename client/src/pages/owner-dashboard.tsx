import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
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
  Clock
} from "lucide-react";

const boatFormSchema = insertBoatSchema.extend({
  pricePerDay: z.string().min(1, "Prezzo richiesto"),
  maxPersons: z.string().min(1, "Numero massimo persone richiesto"),
  length: z.string().optional(),
  year: z.string().optional(),
});

type BoatFormData = z.infer<typeof boatFormSchema>;

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddBoatModal, setShowAddBoatModal] = useState(false);
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);

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
    },
  });

  const createBoatMutation = useMutation({
    mutationFn: async (data: BoatFormData) => {
      const boatData = {
        ...data,
        pricePerDay: data.pricePerDay,
        maxPersons: parseInt(data.maxPersons),
        length: data.length ? data.length : undefined,
        year: data.year ? parseInt(data.year) : undefined,
        ownerId: user!.id,
      };
      const res = await apiRequest("POST", "/api/boats", boatData);
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
    if (editingBoat) {
      updateBoatMutation.mutate({ id: editingBoat.id, data: data as any });
    } else {
      createBoatMutation.mutate(data);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Host</h1>
          <p className="text-gray-600 mt-2">Gestisci le tue imbarcazioni e prenotazioni</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <Euro className="h-8 w-8 text-coral" />
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

        <Tabs defaultValue="boats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="boats">Le mie imbarcazioni</TabsTrigger>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="messages">Messaggi</TabsTrigger>
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingBoat ? "Modifica imbarcazione" : "Aggiungi nuova imbarcazione"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome imbarcazione *</Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                          <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">Cantiere/Marca</Label>
                        <Input id="manufacturer" {...form.register("manufacturer")} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Tipologia *</Label>
                        <Select onValueChange={(value) => form.setValue("type", value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipologia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gommone">Gommone</SelectItem>
                            <SelectItem value="yacht">Yacht</SelectItem>
                            <SelectItem value="catamarano">Catamarano</SelectItem>
                            <SelectItem value="jetski">Moto d'acqua</SelectItem>
                            <SelectItem value="sailboat">Barca a vela</SelectItem>
                            <SelectItem value="kayak">Kayak</SelectItem>
                            <SelectItem value="charter">Charter</SelectItem>
                            <SelectItem value="houseboat">Houseboat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Anno di costruzione</Label>
                        <Input id="year" type="number" {...form.register("year")} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxPersons">Numero massimo persone *</Label>
                        <Input id="maxPersons" type="number" {...form.register("maxPersons")} />
                        {form.formState.errors.maxPersons && (
                          <p className="text-sm text-red-500">{form.formState.errors.maxPersons.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Lunghezza (metri)</Label>
                        <Input id="length" type="number" step="0.1" {...form.register("length")} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="motorization">Motorizzazione</Label>
                        <Input id="motorization" {...form.register("motorization")} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="port">Porto di partenza *</Label>
                        <Input id="port" {...form.register("port")} />
                        {form.formState.errors.port && (
                          <p className="text-sm text-red-500">{form.formState.errors.port.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pricePerDay">Prezzo giornaliero (€) *</Label>
                        <Input id="pricePerDay" type="number" step="0.01" {...form.register("pricePerDay")} />
                        {form.formState.errors.pricePerDay && (
                          <p className="text-sm text-red-500">{form.formState.errors.pricePerDay.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrizione</Label>
                      <Textarea id="description" {...form.register("description")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentsRequired">Documenti richiesti</Label>
                      <Textarea 
                        id="documentsRequired" 
                        placeholder="es. Documento di identità, patente nautica..."
                        {...form.register("documentsRequired")} 
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        type="submit" 
                        className="bg-ocean-blue hover:bg-blue-600"
                        disabled={createBoatMutation.isPending || updateBoatMutation.isPending}
                      >
                        {editingBoat ? "Aggiorna" : "Aggiungi"} imbarcazione
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddBoatModal(false);
                          setEditingBoat(null);
                          form.reset();
                        }}
                      >
                        Annulla
                      </Button>
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
                            {getBookingStatusBadge(booking.status)}
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
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
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
