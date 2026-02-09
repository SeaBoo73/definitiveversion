import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useOwnerMode } from "@/hooks/use-owner-mode";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  CalendarDays, 
  Ship, 
  Bell, 
  Clock, 
  ChevronRight,
  ArrowLeftRight
} from "lucide-react";

export default function OwnerHome() {
  const { user } = useAuth();
  const { exitOwnerMode } = useOwnerMode();
  const [, navigate] = useLocation();

  const { data: bookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
  });

  const { data: boatsData } = useQuery<{ boats: any[] }>({
    queryKey: ["/api/owner/boats"],
  });

  const bookings = bookingsData?.bookings || [];
  const boats = boatsData?.boats || [];

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const todayBookings = bookings.filter((b: any) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    return today >= start && today <= end && b.status !== 'cancelled';
  });

  const upcomingBookings = bookings.filter((b: any) => {
    const start = new Date(b.startDate);
    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7 && b.status !== 'cancelled';
  });

  const pendingBookings = bookings.filter((b: any) => b.status === 'pending');

  const monthRevenue = bookings.filter((b: any) => {
    const d = new Date(b.startDate);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && b.status === 'completed';
  }).reduce((sum: number, b: any) => sum + (b.totalPrice * 0.85), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Ciao, {user?.firstName || 'Noleggiatore'}
          </h1>
          <p className="text-gray-500 text-sm">
            {today.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-coral/10 border-coral/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-coral">{todayBookings.length}</p>
              <p className="text-xs text-gray-600">Oggi</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-ocean-blue">{upcomingBookings.length}</p>
              <p className="text-xs text-gray-600">Prossimi 7gg</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">€{monthRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-600">Mese</p>
            </CardContent>
          </Card>
        </div>

        {pendingBookings.length > 0 && (
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-5 w-5 text-coral" />
                <h3 className="font-semibold text-gray-900">Da confermare ({pendingBookings.length})</h3>
              </div>
              {pendingBookings.slice(0, 3).map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-orange-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{booking.boatName || 'Prenotazione'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-coral">€{booking.totalPrice}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-ocean-blue" />
            Attivita di oggi
          </h3>
          {todayBookings.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Ship className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Nessuna attivita per oggi</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Ship className="h-5 w-5 text-ocean-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.boatName || 'Prenotazione attiva'}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
                          </p>
                          <p className="text-xs text-gray-500">{booking.guests} ospiti</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confermata' :
                           booking.status === 'pending' ? 'In attesa' :
                           booking.status}
                        </span>
                        <p className="text-sm font-semibold mt-1">€{booking.totalPrice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {upcomingBookings.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-ocean-blue" />
              Prossime prenotazioni
            </h3>
            <div className="space-y-3">
              {upcomingBookings.slice(0, 5).map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{booking.boatName || 'Prenotazione'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">€{booking.totalPrice}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Ship className="h-5 w-5 text-ocean-blue" />
            Le tue imbarcazioni
          </h3>
          <div className="space-y-2">
            {boats.slice(0, 5).map((boat: any) => (
              <Card key={boat.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {boat.imageUrl ? (
                        <img src={boat.imageUrl} alt={boat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Ship className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{boat.name}</p>
                      <p className="text-xs text-gray-500">{boat.location}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    boat.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {boat.available ? 'Disponibile' : 'Non disponibile'}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => { exitOwnerMode(); navigate('/'); }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-coral hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
      >
        <ArrowLeftRight className="h-5 w-5" />
        Modalita ospite
      </button>
    </div>
  );
}
