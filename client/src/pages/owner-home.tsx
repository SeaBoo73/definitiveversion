import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarDays, 
  Ship, 
  Bell, 
  Clock, 
  Users,
  MapPin,
  Calendar
} from "lucide-react";

export default function OwnerHome() {
  const { user } = useAuth();

  const { data: bookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
  });

  const { data: boatsData } = useQuery<{ boats: any[] }>({
    queryKey: ["/api/owner/boats"],
  });

  const bookings = bookingsData?.bookings || [];
  const boats = boatsData?.boats || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allUpcoming = bookings
    .filter((b: any) => {
      const start = new Date(b.startDate);
      return start >= today && b.status !== 'cancelled';
    })
    .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const activeNow = bookings.filter((b: any) => {
    const start = new Date(b.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(b.endDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end && b.status !== 'cancelled';
  });

  const pendingBookings = bookings.filter((b: any) => b.status === 'pending');

  const monthRevenue = bookings.filter((b: any) => {
    const d = new Date(b.startDate);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && b.status === 'completed';
  }).reduce((sum: number, b: any) => sum + (b.totalPrice * 0.85), 0);

  const getDaysUntil = (dateStr: string) => {
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Oggi';
    if (diff === 1) return 'Domani';
    return `Tra ${diff} giorni`;
  };

  const getBoatName = (boatId: number) => {
    const boat = boats.find((b: any) => b.id === boatId);
    return boat?.name || 'Imbarcazione';
  };

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
              <p className="text-2xl font-bold text-coral">{activeNow.length}</p>
              <p className="text-xs text-gray-600">Oggi</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-ocean-blue">{allUpcoming.length}</p>
              <p className="text-xs text-gray-600">In arrivo</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{monthRevenue > 0 ? `€${monthRevenue.toFixed(0)}` : '€0'}</p>
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
              {pendingBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-orange-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{booking.boatName || getBoatName(booking.boatId)}</p>
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

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-ocean-blue" />
            Prenotazioni in arrivo
          </h3>

          {allUpcoming.length === 0 && activeNow.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Non risultano prenotazioni imminenti</p>
                <p className="text-gray-400 text-sm mt-1">Le nuove prenotazioni appariranno qui in ordine di arrivo</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeNow.map((booking: any) => (
                <Card key={booking.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Ship className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.boatName || getBoatName(booking.boatId)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">In corso</span>
                            <span className="text-xs text-gray-500">
                              {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                          {booking.guests && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Users className="h-3 w-3" /> {booking.guests} ospiti
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-semibold">€{booking.totalPrice}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {allUpcoming.map((booking: any) => {
                const daysLabel = getDaysUntil(booking.startDate);
                const isToday = daysLabel === 'Oggi';
                const isTomorrow = daysLabel === 'Domani';

                return (
                  <Card key={booking.id} className={isToday ? 'border-l-4 border-l-coral' : isTomorrow ? 'border-l-4 border-l-orange-400' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isToday ? 'bg-red-50' : isTomorrow ? 'bg-orange-50' : 'bg-blue-50'}`}>
                            <Ship className={`h-5 w-5 ${isToday ? 'text-coral' : isTomorrow ? 'text-orange-500' : 'text-ocean-blue'}`} />
                          </div>
                          <div>
                            <p className="font-medium">{booking.boatName || getBoatName(booking.boatId)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                isToday ? 'text-coral bg-red-50' :
                                isTomorrow ? 'text-orange-600 bg-orange-50' :
                                'text-ocean-blue bg-blue-50'
                              }`}>
                                {daysLabel}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(booking.startDate).toLocaleDateString('it-IT')} - {new Date(booking.endDate).toLocaleDateString('it-IT')}
                              </span>
                            </div>
                            {booking.guests && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Users className="h-3 w-3" /> {booking.guests} ospiti
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">€{booking.totalPrice}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confermata' :
                             booking.status === 'pending' ? 'In attesa' :
                             booking.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
