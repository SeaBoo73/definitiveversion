import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Boat, Booking } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Users,
  Ship,
  Calendar,
  Euro,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all boats
  const { data: boats = [], isLoading: boatsLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
    enabled: !!user && user.role === "admin",
  });

  // Fetch all bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user && user.role === "admin",
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
      const res = await apiRequest("PUT", `/api/users/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Utente aggiornato",
        description: "Le modifiche sono state salvate",
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
      toast({
        title: "Imbarcazione aggiornata",
        description: "Le modifiche sono state salvate",
      });
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso negato</h1>
          <p className="text-gray-600 mt-2">Non hai i permessi per accedere a questa pagina.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalBoats = boats.length;
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + Number(b.commission), 0);

  const monthlyBookings = bookings.filter(b => {
    const bookingDate = new Date(b.createdAt!);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  }).length;

  const activeBoats = boats.filter(b => b.active).length;
  const verifiedUsers = users.filter(u => u.verified).length;

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "owner":
        return <Badge className="bg-blue-100 text-blue-800">Proprietario</Badge>;
      case "customer":
        return <Badge className="bg-green-100 text-green-800">Cliente</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confermata</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">In attesa</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancellata</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completata</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const toggleBoatStatus = (boat: Boat) => {
    updateBoatMutation.mutate({
      id: boat.id,
      data: { active: !boat.active }
    });
  };

  const toggleUserVerification = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { verified: !user.verified }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-600 mt-2">Gestione completa della piattaforma SeaGO</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-ocean-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utenti totali</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  <p className="text-xs text-gray-500">{verifiedUsers} verificati</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ship className="h-8 w-8 text-seafoam" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imbarcazioni</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBoats}</p>
                  <p className="text-xs text-gray-500">{activeBoats} attive</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-coral" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prenotazioni</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                  <p className="text-xs text-gray-500">{monthlyBookings} questo mese</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ricavi totali</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Commissioni 15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Prenotazioni in attesa</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === "pending").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Utenti non verificati</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => !u.verified).length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Imbarcazioni inattive</h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {boats.filter(b => !b.active).length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Utenti</TabsTrigger>
            <TabsTrigger value="boats">Imbarcazioni</TabsTrigger>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="analytics">Statistiche</TabsTrigger>
            <TabsTrigger value="settings">Impostazioni</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Utenti</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cerca utenti..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtra per ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti</SelectItem>
                    <SelectItem value="customer">Clienti</SelectItem>
                    <SelectItem value="owner">Proprietari</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Verificato</TableHead>
                    <TableHead>Registrato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users
                    .filter(u => 
                      (filterStatus === "all" || u.role === filterStatus) &&
                      (searchTerm === "" || 
                       u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserVerification(user)}
                        >
                          {user.verified ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {user.createdAt && format(new Date(user.createdAt), "dd MMM yyyy", { locale: it })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="boats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Imbarcazioni</h2>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Esporta dati
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imbarcazione</TableHead>
                    <TableHead>Proprietario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Porto</TableHead>
                    <TableHead>Prezzo</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boats.map((boat) => {
                    const owner = users.find(u => u.id === boat.ownerId);
                    return (
                      <TableRow key={boat.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=50&h=50"}
                              alt={boat.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{boat.name}</p>
                              <p className="text-sm text-gray-500">{boat.manufacturer}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{owner?.username || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{boat.type}</Badge>
                        </TableCell>
                        <TableCell>{boat.port}</TableCell>
                        <TableCell>€{boat.pricePerDay}/giorno</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBoatStatus(boat)}
                          >
                            <Badge className={boat.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {boat.active ? "Attiva" : "Inattiva"}
                            </Badge>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestione Prenotazioni</h2>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Imbarcazione</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Totale</TableHead>
                    <TableHead>Commissione</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const customer = users.find(u => u.id === booking.customerId);
                    const boat = boats.find(b => b.id === booking.boatId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>#{booking.id}</TableCell>
                        <TableCell>{customer?.username || "N/A"}</TableCell>
                        <TableCell>{boat?.name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(booking.startDate), "dd MMM", { locale: it })}</p>
                            <p className="text-gray-500">{format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}</p>
                          </div>
                        </TableCell>
                        <TableCell>€{booking.totalPrice}</TableCell>
                        <TableCell className="text-green-600">€{booking.commission}</TableCell>
                        <TableCell>{getBookingStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiche e Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Ricavi mensili
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-3xl font-bold text-green-600">€{totalRevenue.toFixed(2)}</p>
                    <p className="text-gray-600">Commissioni totali</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Distribuzione utenti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Clienti</span>
                      <span>{users.filter(u => u.role === "customer").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proprietari</span>
                      <span>{users.filter(u => u.role === "owner").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin</span>
                      <span>{users.filter(u => u.role === "admin").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Impostazioni Piattaforma</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commissioni</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="commission">Percentuale commissione (%)</Label>
                    <Input id="commission" type="number" defaultValue="15" />
                  </div>
                  <Button>Aggiorna commissioni</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifiche</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email notifiche admin</Label>
                    <Input defaultValue="admin@seago.com" />
                  </div>
                  <Button>Aggiorna impostazioni</Button>
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
