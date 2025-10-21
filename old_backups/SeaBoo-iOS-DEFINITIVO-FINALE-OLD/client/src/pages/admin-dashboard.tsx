import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Boat, User, Booking } from "@shared/schema";
import { 
  Users, 
  Anchor, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Shield,
  Search,
  Settings
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all data for admin dashboard
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user && user.role === "admin",
  });

  const { data: boats = [], isLoading: boatsLoading } = useQuery<Boat[]>({
    queryKey: ["/api/boats"],
    enabled: !!user && user.role === "admin",
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user && user.role === "admin",
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Accesso negato</h1>
          <p className="text-gray-600 mt-2">Non hai i permessi per accedere a questa pagina.</p>
          <Button asChild className="mt-4">
            <Link href="/">Torna alla homepage</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Statistics
  const totalUsers = users.length;
  const activeBoats = boats.filter(boat => boat.active).length;
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(booking => 
    booking.createdAt && new Date(booking.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: "Utenti Totali",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Barche Attive",
      value: activeBoats,
      icon: Anchor,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Prenotazioni",
      value: totalBookings,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Prenotazioni Oggi",
      value: todayBookings,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Amministrazione
          </h1>
          <p className="text-gray-600">
            Pannello di controllo per la gestione della piattaforma SeaBoo
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Visualizza metriche dettagliate e analytics della piattaforma
              </p>
              <Button asChild className="w-full">
                <Link href="/admin-performance">Centro Performance</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Report e analisi avanzate sui dati della piattaforma
              </p>
              <Button asChild className="w-full">
                <Link href="/analytics">Visualizza Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Emergenze</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Sistema di gestione emergenze e sicurezza marittima
              </p>
              <Button asChild className="w-full">
                <Link href="/emergency-system">Sistema Emergenze</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Utenti</TabsTrigger>
            <TabsTrigger value="boats">Imbarcazioni</TabsTrigger>
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Utenti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === "admin" ? "default" : user.role === "owner" ? "secondary" : "outline"}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.active !== false ? "default" : "destructive"}>
                          {user.active !== false ? "Attivo" : "Sospeso"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="boats">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Imbarcazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {boats.slice(0, 10).map((boat) => (
                    <div key={boat.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{boat.name}</p>
                        <p className="text-sm text-gray-600">{boat.type} • {boat.port}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">€{boat.pricePerDay}/giorno</Badge>
                        <Badge variant={boat.active !== false ? "default" : "secondary"}>
                          {boat.active !== false ? "Attiva" : "Inattiva"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Prenotazioni</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 10).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Prenotazione #{booking.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">€{booking.totalPrice}</Badge>
                        <Badge variant={
                          booking.status === "confirmed" ? "default" : 
                          booking.status === "pending" ? "secondary" : 
                          "destructive"
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <MobileNavigation />
    </div>
  );
}