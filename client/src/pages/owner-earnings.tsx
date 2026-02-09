import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  Euro, 
  TrendingUp, 
  ArrowLeft, 
  CalendarDays,
  Ship
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSummary {
  month: number;
  year: number;
  label: string;
  totalRevenue: number;
  netEarnings: number;
  bookingsCount: number;
  completedCount: number;
}

export default function OwnerEarnings() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: bookingsData, isLoading } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
  });

  const bookings = bookingsData?.bookings || [];

  const completedBookings = bookings.filter((b: any) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum: number, b: any) => sum + (b.totalPrice * 0.85), 0);
  const totalRevenue = completedBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);
  const totalCommission = totalRevenue - totalEarnings;

  const monthSummaries: MonthSummary[] = [];
  const monthMap = new Map<string, MonthSummary>();

  bookings.forEach((b: any) => {
    if (b.status === 'cancelled') return;
    const d = new Date(b.startDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    
    if (!monthMap.has(key)) {
      const monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
      ];
      monthMap.set(key, {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        totalRevenue: 0,
        netEarnings: 0,
        bookingsCount: 0,
        completedCount: 0,
      });
    }

    const summary = monthMap.get(key)!;
    summary.bookingsCount++;
    if (b.status === 'completed') {
      summary.completedCount++;
      summary.totalRevenue += b.totalPrice;
      summary.netEarnings += b.totalPrice * 0.85;
    }
  });

  monthMap.forEach(v => monthSummaries.push(v));
  monthSummaries.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profilo')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">I tuoi guadagni</h1>
            <p className="text-gray-500 text-sm">Riepilogo mensile del fatturato</p>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Euro className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Guadagno netto totale</p>
                <p className="text-3xl font-bold">€{totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-emerald-100 text-xs">Fatturato lordo</p>
                <p className="text-lg font-semibold">€{totalRevenue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-xs">Commissioni (15%)</p>
                <p className="text-lg font-semibold">€{totalCommission.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-xs">Prenotazioni</p>
                <p className="text-lg font-semibold">{completedBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-ocean-blue" />
          Riepilogo per mese
        </h3>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Caricamento...</p>
            </CardContent>
          </Card>
        ) : monthSummaries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Ship className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nessun guadagno registrato</p>
              <p className="text-gray-400 text-sm mt-1">I guadagni appariranno qui quando le prenotazioni saranno completate</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {monthSummaries.map((summary) => (
              <Card key={`${summary.year}-${summary.month}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{summary.label}</p>
                        <p className="text-xs text-gray-500">
                          {summary.completedCount} {summary.completedCount === 1 ? 'prenotazione completata' : 'prenotazioni completate'}
                          {summary.bookingsCount > summary.completedCount && ` (${summary.bookingsCount} totali)`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-700">€{summary.netEarnings.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">lordo €{summary.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
