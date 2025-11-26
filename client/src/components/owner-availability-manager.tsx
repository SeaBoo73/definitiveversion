import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { 
  Calendar, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient as qc } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const availabilitySchema = z.object({
  startDate: z.string().min(1, "Data inizio obbligatoria"),
  endDate: z.string().min(1, "Data fine obbligatoria"),
  status: z.enum(['available', 'blocked', 'booked']).default('available'),
  priceOverride: z.preprocess(
    (val) => val === '' || val === undefined ? undefined : Number(val),
    z.number().optional()
  )
});

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
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<BoatAvailability | null>(null);
  
  const { toast } = useToast();
  const queryClient = qc;

  const form = useForm<z.infer<typeof availabilitySchema>>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      status: 'available' as const,
      startDate: '',
      endDate: '',
      priceOverride: undefined
    }
  });

  // Fetch boat info
  const { data: boat } = useQuery<{ name: string }>({
    queryKey: ['/api/boats', boatId]
  });

  // Fetch availability data for current month
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

  // Create availability mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/availability', {
        ...data,
        boatId
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Disponibilità creata",
        description: "La disponibilità è stata aggiunta con successo."
      });
      // Force refetch to ensure calendar updates
      await refetch();
      setShowCreateDialog(false);
      form.reset();
      setSelectedStartDate(null);
      setSelectedEndDate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione della disponibilità.",
        variant: "destructive"
      });
    }
  });

  // Update availability mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PATCH', `/api/availability/${id}`, {
        status,
        boatId
      });
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Disponibilità aggiornata",
        description: "Lo stato è stato modificato con successo."
      });
      await refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento della disponibilità.",
        variant: "destructive"
      });
    }
  });

  // Delete availability mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/availability/${id}?boatId=${boatId}`);
      return res.json();
    },
    onSuccess: async () => {
      toast({
        title: "Disponibilità eliminata",
        description: "La disponibilità è stata rimossa con successo."
      });
      // Force refetch to ensure calendar updates
      await refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'eliminazione della disponibilità.",
        variant: "destructive"
      });
    }
  });

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Get availability slots that overlap with a given date
  const getAvailabilityForDate = (date: Date): BoatAvailability[] => {
    return availabilities.filter((item: BoatAvailability) => {
      // Skip items with invalid dates
      if (!item.startDate || !item.endDate) return false;
      
      try {
        // Handle both Date objects and strings
        const itemStart = typeof item.startDate === 'string' ? parseISO(item.startDate) : new Date(item.startDate);
        const itemEnd = typeof item.endDate === 'string' ? parseISO(item.endDate) : new Date(item.endDate);
        
        // Normalize to start of day for proper comparison
        const normalizedStart = new Date(itemStart.getFullYear(), itemStart.getMonth(), itemStart.getDate());
        const normalizedEnd = new Date(itemEnd.getFullYear(), itemEnd.getMonth(), itemEnd.getDate());
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
      } catch (error) {
        console.error('Error parsing availability dates:', error, item);
        return false;
      }
    });
  };

  const getDayClass = (date: Date): string => {
    const availabilityInfo = getAvailabilityForDate(date);
    const isSelected = selectedStartDate && selectedEndDate && 
      !isBefore(date, selectedStartDate) && !isAfter(date, selectedEndDate);
    const isHovered = hoveredDate && selectedStartDate && !selectedEndDate &&
      !isBefore(date, selectedStartDate) && !isAfter(date, hoveredDate);
    
    let baseClass = "min-h-[80px] p-2 border border-gray-200 cursor-pointer relative hover:border-blue-400 transition-colors ";
    
    if (isBefore(date, new Date())) {
      baseClass += "bg-gray-100 text-gray-400 cursor-not-allowed ";
    } else if (isSelected) {
      baseClass += "bg-blue-500 text-white border-blue-600 ";
    } else if (isHovered) {
      baseClass += "bg-blue-200 border-blue-400 ";
    } else if (availabilityInfo.length > 0) {
      const hasAvailable = availabilityInfo.some(a => a.status === 'available');
      const hasBlocked = availabilityInfo.some(a => a.status === 'blocked');
      const hasBooked = availabilityInfo.some(a => a.status === 'booked');
      
      if (hasBooked) {
        baseClass += "bg-purple-100 text-purple-800 ";
      } else if (hasBlocked) {
        baseClass += "bg-red-100 text-red-800 ";
      } else if (hasAvailable) {
        baseClass += "bg-green-100 text-green-800 ";
      }
    } else {
      baseClass += "bg-white hover:bg-gray-50 ";
    }
    
    return baseClass;
  };

  const handleDateClick = (date: Date) => {
    if (isBefore(date, new Date())) return;

    const availabilityInfo = getAvailabilityForDate(date);
    
    // If there's an existing availability, open edit dialog
    if (availabilityInfo.length > 0) {
      setSelectedAvailability(availabilityInfo[0]);
      setShowEditDialog(true);
      return;
    }

    if (!selectedStartDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (!selectedEndDate) {
      if (isBefore(date, selectedStartDate)) {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      } else {
        setSelectedEndDate(date);
      }
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const handleDateHover = (date: Date) => {
    if (selectedStartDate && !selectedEndDate && !isBefore(date, selectedStartDate)) {
      setHoveredDate(date);
    }
  };

  const handleCreateAvailability = () => {
    if (selectedStartDate && selectedEndDate) {
      form.setValue('startDate', selectedStartDate.toISOString().split('T')[0]);
      form.setValue('endDate', selectedEndDate.toISOString().split('T')[0]);
      setShowCreateDialog(true);
    } else {
      toast({
        title: "Seleziona le date",
        description: "Seleziona una data di inizio e una data di fine sul calendario.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  const selectedDays = selectedStartDate && selectedEndDate ? 
    Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestione Disponibilità</h2>
          <p className="text-gray-600">
            {boat?.name} - Seleziona le date disponibili per il noleggio
          </p>
        </div>
        <Button onClick={handleCreateAvailability}>
          <Plus className="w-4 h-4 mr-2" />
          Aggiungi Disponibilità
        </Button>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Calendario Disponibilità</span>
              {selectedDays > 0 && (
                <Badge variant="secondary">
                  {selectedDays} giorn{selectedDays === 1 ? 'o' : 'i'} selezionat{selectedDays === 1 ? 'o' : 'i'}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: it })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
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
          </div>

          {/* Calendar Grid */}
          {isLoading ? (
            <div className="text-center py-12">Caricamento...</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-100 rounded">
                  {day}
                </div>
              ))}
              
              {monthDays.map(date => {
                const availabilityInfo = getAvailabilityForDate(date);
                const availableSlot = availabilityInfo.find(a => a.status === 'available');
                const displayPrice = availableSlot?.priceOverride || (boat as any)?.pricePerDay;
                
                return (
                  <div
                    key={date.toISOString()}
                    className={getDayClass(date)}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => handleDateHover(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    data-testid={`calendar-day-${format(date, 'yyyy-MM-dd')}`}
                  >
                    <div className="text-sm font-semibold">{format(date, 'd')}</div>
                    {availableSlot && displayPrice && (
                      <div className="text-[10px] text-green-700 font-medium mt-1">
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

      {/* Create Availability Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Disponibilità</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data inizio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data fine</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-end-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponibile</SelectItem>
                        <SelectItem value="blocked">Bloccato</SelectItem>
                        <SelectItem value="booked">Prenotato</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceOverride"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo personalizzato (€/giorno) - Opzionale</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Lascia vuoto per usare il prezzo base"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        data-testid="input-price-override"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  data-testid="button-cancel"
                >
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  data-testid="button-create-availability"
                >
                  {createMutation.isPending ? "Creazione..." : "Crea Disponibilità"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Availability Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Disponibilità</DialogTitle>
          </DialogHeader>
          {selectedAvailability && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p><strong>Dal:</strong> {format(parseISO(selectedAvailability.startDate), 'd MMMM yyyy', { locale: it })}</p>
                <p><strong>Al:</strong> {format(parseISO(selectedAvailability.endDate), 'd MMMM yyyy', { locale: it })}</p>
                <p><strong>Stato attuale:</strong> {
                  selectedAvailability.status === 'blocked' ? 'Bloccato' :
                  selectedAvailability.status === 'booked' ? 'Prenotato' : 'Disponibile'
                }</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cambia stato:</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedAvailability.status === 'available' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedAvailability.id, status: 'available' });
                      setShowEditDialog(false);
                    }}
                    disabled={updateMutation.isPending}
                    data-testid="button-set-available"
                  >
                    Disponibile
                  </Button>
                  <Button
                    variant={selectedAvailability.status === 'blocked' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedAvailability.id, status: 'blocked' });
                      setShowEditDialog(false);
                    }}
                    disabled={updateMutation.isPending}
                    data-testid="button-set-blocked"
                  >
                    Bloccato
                  </Button>
                  <Button
                    variant={selectedAvailability.status === 'booked' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => {
                      updateMutation.mutate({ id: selectedAvailability.id, status: 'booked' });
                      setShowEditDialog(false);
                    }}
                    disabled={updateMutation.isPending}
                    data-testid="button-set-booked"
                  >
                    Prenotato
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteMutation.mutate(selectedAvailability.id);
                    setShowEditDialog(false);
                  }}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete-availability"
                >
                  Elimina
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  data-testid="button-close-edit"
                >
                  Chiudi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
