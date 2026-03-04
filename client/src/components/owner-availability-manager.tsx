import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, parseISO } from "date-fns";
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
  const [selStart, setSelStart] = useState<Date | null>(null);
  const [selEnd, setSelEnd] = useState<Date | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dayPrice, setDayPrice] = useState<string>('');
  const [endDateStr, setEndDateStr] = useState<string>('');
  
  const { toast } = useToast();

  const { data: boat } = useQuery<{ name: string }>({
    queryKey: ['/api/boats', boatId]
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const { data: availabilities = [], isLoading, refetch } = useQuery<BoatAvailability[]>({
    queryKey: ['/api/boats', boatId, 'availability', monthStart.toISOString(), monthEnd.toISOString()],
    queryFn: async () => {
      const url = `/api/boats/${boatId}/availability?startDate=${monthStart.toISOString()}&endDate=${monthEnd.toISOString()}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch availability');
      return res.json();
    }
  });

  const setRangeStatusMutation = useMutation({
    mutationFn: async ({ startDate, endDate, status, priceOverride }: { startDate: string; endDate: string; status: string; priceOverride?: number }) => {
      const res = await apiRequest('POST', '/api/availability/set-range', {
        boatId,
        startDate,
        endDate,
        status,
        priceOverride
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Aggiornato",
        description: "Disponibilità aggiornata."
      });
      await refetch();
      setShowDialog(false);
      setSelStart(null);
      setSelEnd(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento.",
        variant: "destructive"
      });
    }
  });

  const clearRangeMutation = useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      const res = await apiRequest('POST', '/api/availability/clear-range', {
        boatId,
        startDate,
        endDate
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Rimosso",
        description: "Stato rimosso."
      });
      await refetch();
      setShowDialog(false);
      setSelStart(null);
      setSelEnd(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella rimozione.",
        variant: "destructive"
      });
    }
  });

  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailabilityForDate = (date: Date): BoatAvailability | null => {
    for (const item of availabilities) {
      if (!item.startDate || !item.endDate) continue;
      try {
        const itemStart = typeof item.startDate === 'string' ? parseISO(item.startDate) : new Date(item.startDate);
        const itemEnd = typeof item.endDate === 'string' ? parseISO(item.endDate) : new Date(item.endDate);
        const nStart = new Date(itemStart.getFullYear(), itemStart.getMonth(), itemStart.getDate());
        const nEnd = new Date(itemEnd.getFullYear(), itemEnd.getMonth(), itemEnd.getDate());
        const nDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        if (nDate >= nStart && nDate <= nEnd) return item;
      } catch { continue; }
    }
    return null;
  };

  const isInSelection = (date: Date): boolean => {
    if (!selStart) return false;
    const end = selEnd || selStart;
    return !isBefore(date, selStart) && !isAfter(date, end);
  };

  const getDayClass = (date: Date): string => {
    const avail = getAvailabilityForDate(date);
    let base = "min-h-[70px] p-2 border border-gray-200 cursor-pointer relative hover:border-blue-400 transition-colors rounded ";
    
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return base + "bg-gray-100 text-gray-400 cursor-not-allowed ";
    }

    if (isInSelection(date)) {
      return base + "bg-blue-500 text-white border-blue-600 ";
    }
    
    if (avail) {
      if (avail.status === 'booked') return base + "bg-purple-100 text-purple-800 border-purple-300 ";
      if (avail.status === 'blocked') return base + "bg-red-100 text-red-800 border-red-300 ";
      if (avail.status === 'available') return base + "bg-green-100 text-green-800 border-green-300 ";
    }
    
    return base + "bg-white hover:bg-gray-50 ";
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) return;
    const avail = getAvailabilityForDate(date);
    setSelStart(date);
    setSelEnd(null);
    setDayPrice(avail?.priceOverride ? String(avail.priceOverride) : '');
    setEndDateStr(format(date, 'yyyy-MM-dd'));
    setShowDialog(true);
  };

  const handleSetStatus = (status: string) => {
    if (!selStart) return;
    const endDate = endDateStr ? new Date(endDateStr + 'T12:00:00') : selStart;
    const effectiveEnd = isAfter(endDate, selStart) ? endDate : selStart;
    setSelEnd(effectiveEnd);
    const priceVal = dayPrice ? parseFloat(dayPrice) : undefined;
    setRangeStatusMutation.mutate({
      startDate: selStart.toISOString().split('T')[0],
      endDate: effectiveEnd.toISOString().split('T')[0],
      status,
      priceOverride: priceVal && !isNaN(priceVal) ? priceVal : undefined
    });
  };

  const handleClear = () => {
    if (!selStart) return;
    const endDate = endDateStr ? new Date(endDateStr + 'T12:00:00') : selStart;
    const effectiveEnd = isAfter(endDate, selStart) ? endDate : selStart;
    setSelEnd(effectiveEnd);
    clearRangeMutation.mutate({
      startDate: selStart.toISOString().split('T')[0],
      endDate: effectiveEnd.toISOString().split('T')[0]
    });
  };

  const isPending = setRangeStatusMutation.isPending || clearRangeMutation.isPending;

  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gestione Disponibilità</h2>
        <p className="text-gray-600">
          {boat?.name} — Tocca un giorno per gestirlo
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
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
              <span>Selezionato</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold text-green-700">€</span>
              <span>Prezzo base</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-semibold text-orange-600">€</span>
              <span>Prezzo personalizzato</span>
            </div>
          </div>

          {selStart && !selEnd && !showDialog && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              Tocca lo stesso giorno per confermare, oppure un altro giorno per selezionare un intervallo
            </div>
          )}

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
                const isPast = isBefore(date, new Date()) && !isSameDay(date, new Date());
                const basePrice = (boat as any)?.pricePerDay;
                const dayPriceValue = avail?.priceOverride || basePrice;
                
                return (
                  <div
                    key={date.toISOString()}
                    className={getDayClass(date)}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="text-sm font-semibold">{format(date, 'd')}</div>
                    {avail && !isInSelection(date) && (
                      <div className="text-[9px] mt-0.5 font-medium">
                        {avail.status === 'available' && 'Disp.'}
                        {avail.status === 'blocked' && 'Blocc.'}
                        {avail.status === 'booked' && 'Pren.'}
                      </div>
                    )}
                    {dayPriceValue && !isInSelection(date) && !isPast && (
                      <div className={`text-[10px] font-semibold ${avail?.priceOverride ? 'text-orange-600' : 'text-green-700'}`}>
                        €{Number(dayPriceValue).toFixed(0)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) { setSelStart(null); setSelEnd(null); }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {selStart ? format(selStart, 'd MMMM yyyy', { locale: it }) : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Data inizio</label>
                <div className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700">
                  {selStart ? format(selStart, 'dd/MM/yyyy') : '—'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600">Data fine</label>
                <input
                  type="date"
                  value={endDateStr}
                  min={selStart ? format(selStart, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                  variant="outline"
                  className="w-full justify-start border-green-200 hover:bg-green-50"
                  onClick={() => handleSetStatus('available')}
                  disabled={isPending}
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  Disponibile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-200 hover:bg-red-50"
                  onClick={() => handleSetStatus('blocked')}
                  disabled={isPending}
                >
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  Bloccato
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full text-gray-500 text-sm"
              onClick={handleClear}
              disabled={isPending}
            >
              Rimuovi stato
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
