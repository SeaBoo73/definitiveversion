import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Calendar, 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient as qc } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OwnerAvailabilityManagerProps {
  boatId: number;
}

interface BoatAvailability {
  id: number;
  boatId: number;
  startDate: string;
  endDate: string;
  status: 'available' | 'blocked' | 'booked';
  priceOverride?: number;
  createdAt: string;
}

export function OwnerAvailabilityManager({ boatId }: OwnerAvailabilityManagerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [existingAvailability, setExistingAvailability] = useState<BoatAvailability | null>(null);
  const [dayPrice, setDayPrice] = useState<string>('');
  
  const { toast } = useToast();

  const { data: boat } = useQuery<{ name: string }>({
    queryKey: ['/api/boats', boatId]
  });

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  
  const { data: availabilities = [], isLoading, refetch } = useQuery<BoatAvailability[]>({
    queryKey: ['/api/boats', boatId, 'availability', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const url = `/api/boats/${boatId}/availability?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch availability');
      return res.json();
    }
  });

  const setDayStatusMutation = useMutation({
    mutationFn: async ({ date, status, priceOverride }: { date: string; status: string; priceOverride?: number }) => {
      const res = await apiRequest('POST', '/api/availability/set-day', {
        boatId,
        date,
        status,
        priceOverride
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Aggiornato",
        description: "Stato della giornata aggiornato."
      });
      await refetch();
      setShowDayDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento.",
        variant: "destructive"
      });
    }
  });

  const clearDayMutation = useMutation({
    mutationFn: async ({ date }: { date: string }) => {
      const res = await apiRequest('POST', '/api/availability/clear-day', {
        boatId,
        date
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Rimosso",
        description: "Stato della giornata rimosso."
      });
      await refetch();
      setShowDayDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella rimozione.",
        variant: "destructive"
      });
    }
  });

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getAvailabilityForDate = (date: Date): BoatAvailability | null => {
    for (const item of availabilities) {
      if (!item.startDate || !item.endDate) continue;
      try {
        const itemStart = typeof item.startDate === 'string' ? parseISO(item.startDate) : new Date(item.startDate);
        const itemEnd = typeof item.endDate === 'string' ? parseISO(item.endDate) : new Date(item.endDate);
        const normalizedStart = new Date(itemStart.getFullYear(), itemStart.getMonth(), itemStart.getDate());
        const normalizedEnd = new Date(itemEnd.getFullYear(), itemEnd.getMonth(), itemEnd.getDate());
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd) {
          return item;
        }
      } catch {
        continue;
      }
    }
    return null;
  };

  const getDayClass = (date: Date): string => {
    const avail = getAvailabilityForDate(date);
    let baseClass = "min-h-[70px] p-2 border border-gray-200 cursor-pointer relative hover:border-blue-400 transition-colors rounded ";
    
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return baseClass + "bg-gray-100 text-gray-400 cursor-not-allowed ";
    }
    
    if (avail) {
      if (avail.status === 'booked') return baseClass + "bg-purple-100 text-purple-800 border-purple-300 ";
      if (avail.status === 'blocked') return baseClass + "bg-red-100 text-red-800 border-red-300 ";
      if (avail.status === 'available') return baseClass + "bg-green-100 text-green-800 border-green-300 ";
    }
    
    return baseClass + "bg-white hover:bg-gray-50 ";
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) return;
    const avail = getAvailabilityForDate(date);
    setClickedDate(date);
    setExistingAvailability(avail);
    setDayPrice(avail?.priceOverride ? String(avail.priceOverride) : '');
    setShowDayDialog(true);
  };

  const handleSetStatus = (status: string) => {
    if (!clickedDate) return;
    const priceVal = dayPrice ? parseFloat(dayPrice) : undefined;
    setDayStatusMutation.mutate({
      date: clickedDate.toISOString().split('T')[0],
      status,
      priceOverride: priceVal && !isNaN(priceVal) ? priceVal : undefined
    });
  };

  const handleClearDay = () => {
    if (!clickedDate) return;
    clearDayMutation.mutate({
      date: clickedDate.toISOString().split('T')[0]
    });
  };

  const isPending = setDayStatusMutation.isPending || clearDayMutation.isPending;

  const statusLabel = (status: string) => {
    if (status === 'available') return 'Disponibile';
    if (status === 'blocked') return 'Bloccato';
    if (status === 'booked') return 'Prenotato';
    return status;
  };

  const firstDayOfWeek = startOfMonth(currentMonth).getDay();
  const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestione Disponibilità</h2>
        <p className="text-gray-600">
          {boat?.name} - Tocca un giorno per impostarne lo stato
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Calendario</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: it })}
              </span>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 text-sm mb-4 p-3 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Disponibile</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Bloccato</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
              <span>Prenotato</span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Caricamento...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-100 rounded">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: emptyDays }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px]"></div>
              ))}

              {monthDays.map(date => {
                const avail = getAvailabilityForDate(date);
                const displayPrice = avail?.status === 'available' ? (avail.priceOverride || (boat as any)?.pricePerDay) : null;
                
                return (
                  <div
                    key={date.toISOString()}
                    className={getDayClass(date)}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="text-sm font-semibold">{format(date, 'd')}</div>
                    {avail && (
                      <div className="text-[9px] mt-0.5 font-medium">
                        {avail.status === 'available' && 'Disp.'}
                        {avail.status === 'blocked' && 'Blocc.'}
                        {avail.status === 'booked' && 'Pren.'}
                      </div>
                    )}
                    {displayPrice && (
                      <div className="text-[10px] text-green-700 font-medium">
                        €{Number(displayPrice).toFixed(0)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {clickedDate ? format(clickedDate, 'd MMMM yyyy', { locale: it }) : ''}
            </DialogTitle>
          </DialogHeader>
          {clickedDate && (
            <div className="space-y-4">
              {existingAvailability && (
                <p className="text-sm text-gray-500">
                  Stato attuale: <strong>{statusLabel(existingAvailability.status)}</strong>
                </p>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium">Prezzo giornaliero (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Lascia vuoto per prezzo base"
                  value={dayPrice}
                  onChange={(e) => setDayPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Imposta stato:</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={existingAvailability?.status === 'available' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleSetStatus('available')}
                    disabled={isPending}
                  >
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    Disponibile
                  </Button>
                  <Button
                    variant={existingAvailability?.status === 'blocked' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => handleSetStatus('blocked')}
                    disabled={isPending}
                  >
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    Bloccato
                  </Button>
                </div>
              </div>

              {existingAvailability && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-500"
                  onClick={handleClearDay}
                  disabled={isPending}
                >
                  Rimuovi stato
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
