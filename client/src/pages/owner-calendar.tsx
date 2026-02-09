import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Ship } from "lucide-react";

export default function OwnerCalendar() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: bookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
  });
  const bookings = bookingsData?.bookings || [];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getBookingsForDay = (day: number) => {
    const date = new Date(year, month, day);
    return bookings.filter((b: any) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return date >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) && 
             date <= new Date(end.getFullYear(), end.getMonth(), end.getDate()) &&
             b.status !== 'cancelled';
    });
  };

  const today = new Date();
  const isToday = (day: number) => 
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayBookings = getBookingsForDay(day);
                const hasBookings = dayBookings.length > 0;
                const hasPending = dayBookings.some((b: any) => b.status === 'pending');
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`h-10 rounded-lg text-sm font-medium relative transition-colors ${
                      isSelected ? 'bg-ocean-blue text-white' :
                      isToday(day) ? 'bg-blue-100 text-ocean-blue font-bold' :
                      'hover:bg-gray-100'
                    }`}
                  >
                    {day}
                    {hasBookings && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        hasPending ? 'bg-coral' : 
                        isSelected ? 'bg-white' : 'bg-ocean-blue'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedDay && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {selectedDay} {currentMonth.toLocaleDateString('it-IT', { month: 'long' })}
            </h3>
            {selectedBookings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Ship className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Nessuna prenotazione</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {selectedBookings.map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Ship className="h-5 w-5 text-ocean-blue" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{booking.boatName || 'Prenotazione'}</p>
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
        )}

        {!selectedDay && (
          <div className="text-center text-gray-400 text-sm mt-4">
            Tocca un giorno per vedere le prenotazioni
          </div>
        )}
      </div>
    </div>
  );
}
