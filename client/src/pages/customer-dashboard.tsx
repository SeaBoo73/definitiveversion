import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Booking, Boat } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ChatButton } from "@/components/chat-button";
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Star,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Mail,
  Phone,
  Ship,
  TrendingUp,
  ArrowLeft,
  Bell,
  Anchor
} from "lucide-react";
import { differenceInHours } from "date-fns";
import { ReviewForm, ReviewCard } from "@/components/review-form";
import type { Review } from "@shared/schema";

function MyReviewsSection() {
  const { data: myReviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews/my-reviews'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (myReviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna recensione</h3>
          <p className="text-gray-600">Non hai ancora scritto nessuna recensione. Dopo una prenotazione completata, potrai lasciare un feedback!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {myReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Get tab from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  const initialTab = tabFromUrl || 'bookings';

  // Check for success parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    if (urlParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      // Remove the parameter from URL
      setLocation('/customer-dashboard');
    }
  }, [location, setLocation]);

  // Fetch user's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings", { customerId: user?.id }],
    enabled: !!user,
  });

  // Check for bookings starting within 24 hours and show reminder
  useEffect(() => {
    if (bookings.length > 0) {
      const now = new Date();
      const reminderKey = 'seaboo_reminder_shown';
      const lastShown = localStorage.getItem(reminderKey);
      const today = format(now, 'yyyy-MM-dd');
      
      // Only show once per day
      if (lastShown === today) return;
      
      // Find confirmed bookings starting within the next 24 hours
      const bookingStartingSoon = bookings.find(booking => {
        if (booking.status !== 'confirmed') return false;
        const startDate = new Date(booking.startDate);
        const hoursUntilStart = differenceInHours(startDate, now);
        return hoursUntilStart > 0 && hoursUntilStart <= 24;
      });
      
      if (bookingStartingSoon) {
        setUpcomingBooking(bookingStartingSoon);
        setShowReminderDialog(true);
        localStorage.setItem(reminderKey, today);
      }
    }
  }, [bookings]);

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/user/delete-account", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Account eliminato",
        description: "Il tuo account è stato eliminato con successo",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'account",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  // TODO: Fetch user's favorites (table not yet created)
  const favorites: any[] = [];
  const favoritesLoading = false;

  // TODO: Fetch boats for favorites (disabled until favorites table exists)
  const boats: Boat[] = [];

  const getBookingStatusBadge = (status: string, endDate?: Date | string) => {
    const now = new Date();
    const bookingEndDate = endDate ? new Date(endDate) : null;
    const isPastBooking = bookingEndDate && bookingEndDate < now;
    
    if (isPastBooking && (status === "pending" || status === "confirmed")) {
      return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Scaduta</Badge>;
    }
    
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

  const favoriteBoats = boats.filter(boat => 
    favorites.some(fav => fav.boatId === boat.id)
  );

  const totalSpent = bookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const upcomingBookings = bookings.filter(b => 
    b.status === "confirmed" && new Date(b.startDate) > new Date()
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso richiesto</h1>
          <p className="text-gray-600 mt-2">Devi effettuare l'accesso per visualizzare questa pagina.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Reminder Dialog for bookings starting within 24 hours */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-ocean-blue/10 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-ocean-blue" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              La tua avventura sta per iniziare!
            </DialogTitle>
            <DialogDescription className="text-center">
              {upcomingBooking && (
                <div className="mt-4 space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Anchor className="h-5 w-5 text-ocean-blue" />
                      <span className="font-semibold text-ocean-blue">Prenotazione #{upcomingBooking.id}</span>
                    </div>
                    <p className="text-gray-700">
                      Inizia il <strong>{format(new Date(upcomingBooking.startDate), "dd MMMM yyyy 'alle' HH:mm", { locale: it })}</strong>
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Porta un documento d'identità valido
                    </p>
                    <p className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Verifica la patente nautica (se richiesta)
                    </p>
                    <p className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Controlla le condizioni meteo
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-center">
            <Button 
              onClick={() => setShowReminderDialog(false)}
              className="bg-ocean-blue hover:bg-ocean-blue/90"
            >
              Ho capito, grazie!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
        
        {showSuccessMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Pagamento completato con successo! La tua prenotazione è confermata.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ciao, {user.firstName || user.username}!</h1>
          <p className="text-gray-600 mt-2">Gestisci le tue prenotazioni e scopri nuove avventure</p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="border-coral text-coral hover:bg-coral hover:text-white"
              onClick={() => setLocation("/diventa-noleggiatore")}
            >
              Vuoi diventare noleggiatore?
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ship className="h-8 w-8 text-ocean-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prenotazioni totali</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-seafoam" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prossime prenotazioni</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Preferiti</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-coral" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Spesa totale</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={initialTab} className="space-y-6">
          <TabsList className="flex overflow-x-auto">
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="favorites">Preferiti</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="messages">Messaggi</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Le mie prenotazioni</h2>
            
            {bookingsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold">Prenotazione #{booking.id}</h3>
                            {getBookingStatusBadge(booking.status || 'pending', booking.endDate)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-medium">
                                {format(new Date(booking.startDate), "dd MMM", { locale: it })} - {format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Totale pagato</p>
                              <p className="font-medium">€{booking.totalPrice}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Creata il</p>
                              <p className="font-medium">
                                {booking.createdAt && format(new Date(booking.createdAt), "dd MMM yyyy", { locale: it })}
                              </p>
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700"><strong>Note:</strong> {booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <ChatButton bookingId={booking.id} />
                          {booking.status === "completed" && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setReviewBookingId(booking.id)}
                              data-testid={`button-review-booking-${booking.id}`}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Recensione</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Ship className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna prenotazione</h3>
                  <p className="text-gray-600 mb-4">Non hai ancora effettuato nessuna prenotazione</p>
                  <Button className="bg-ocean-blue hover:bg-blue-600">
                    Esplora imbarcazioni
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Imbarcazioni preferite</h2>
            
            {favoritesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favoriteBoats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteBoats.map((boat) => (
                  <Card key={boat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={boat.images?.[boat.coverImage || 0] || boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&h=250"}
                        alt={boat.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-3 right-3 w-8 h-8 p-0 bg-white rounded-full"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{boat.name}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {boat.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Fino a {boat.capacity} persone
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-900">€{boat.pricePerDay}</span>
                          <span className="text-gray-600 text-sm"> al giorno</span>
                        </div>
                        <Button size="sm" className="bg-ocean-blue hover:bg-blue-600">
                          Prenota
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun preferito</h3>
                  <p className="text-gray-600 mb-4">Aggiungi imbarcazioni ai tuoi preferiti per trovarle facilmente</p>
                  <Button className="bg-ocean-blue hover:bg-blue-600">
                    Esplora imbarcazioni
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Le mie recensioni</h2>
            
            <MyReviewsSection />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Il mio profilo</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Informazioni personali</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nome completo</p>
                      <p className="font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.username}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Telefono</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Account verificato</p>
                      <p className="font-medium">{user.verified ? "Sì" : "No"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setLocation('/profilo')}
                  >
                    Modifica profilo
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full"
                        data-testid="button-delete-account"
                      >
                        Elimina account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Questa azione non può essere annullata. Eliminerà permanentemente il tuo
                            account e rimuoverà tutti i tuoi dati dai nostri server.
                          </p>
                          <p className="font-semibold text-red-600">
                            Tutte le tue prenotazioni e dati personali
                            verranno eliminati definitivamente.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-testid="button-cancel-delete">
                          Annulla
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                          data-testid="button-confirm-delete"
                          disabled={deleteAccountMutation.isPending}
                        >
                          {deleteAccountMutation.isPending ? "Eliminazione..." : "Sì, elimina il mio account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Messaggi</h2>
            
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun messaggio</h3>
                <p className="text-gray-600">I messaggi con i proprietari delle imbarcazioni appariranno qui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={reviewBookingId !== null} onOpenChange={(open) => !open && setReviewBookingId(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scrivi una recensione</DialogTitle>
            <DialogDescription>
              Condividi la tua esperienza per aiutare altri utenti
            </DialogDescription>
          </DialogHeader>
          {reviewBookingId && (
            <ReviewForm 
              bookingId={reviewBookingId} 
              onSuccess={() => setReviewBookingId(null)}
              onCancel={() => setReviewBookingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
