import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { it } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Shield,
  AlertCircle,
  X
} from "lucide-react";
import { useLocation } from "wouter";

interface MooringBookingModalProps {
  mooring: any;
  onClose: () => void;
}

const mooringBookingFormSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  notes: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "La data di fine deve essere successiva alla data di inizio",
  path: ["endDate"],
});

type MooringBookingFormData = z.infer<typeof mooringBookingFormSchema>;

export function MooringBookingModal({ mooring, onClose }: MooringBookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"dates" | "details" | "payment">("dates");

  const { data: availability } = useQuery<any[]>({
    queryKey: ['/api/moorings', mooring.id, 'availability'],
    queryFn: async () => {
      const res = await fetch(`/api/moorings/${mooring.id}/availability`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const blockedDates = new Set<string>();
  if (availability) {
    availability.forEach((a: any) => {
      if (a.available === false || a.status === 'blocked' || a.status === 'booked') {
        const dateStr = a.date ? new Date(a.date).toISOString().split('T')[0] : null;
        if (dateStr) {
          blockedDates.add(dateStr);
        } else if (a.startDate && a.endDate) {
          const start = new Date(a.startDate);
          const end = new Date(a.endDate);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            blockedDates.add(d.toISOString().split('T')[0]);
          }
        }
      }
    });
  }

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.has(dateStr);
  };

  const isRangeAvailable = (from: Date, to: Date) => {
    for (let d = new Date(from); d < to; d.setDate(d.getDate() + 1)) {
      if (isDateBlocked(new Date(d))) return false;
    }
    return true;
  };

  const form = useForm<MooringBookingFormData>({
    resolver: zodResolver(mooringBookingFormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      notes: "",
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const days = startDate && endDate ? differenceInDays(endDate, startDate) : 1;
  const basePrice = Number(mooring.pricePerDay) * days;
  const platformFee = Math.round(basePrice * 0.15);
  const totalPrice = basePrice + platformFee;

  const createBookingMutation = useMutation({
    mutationFn: async (data: MooringBookingFormData) => {
      if (!user?.id) {
        throw new Error("Utente non autenticato");
      }
      const bookingData = {
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        notes: data.notes,
        customerId: Number(user.id),
        mooringId: Number(mooring.id),
        totalPrice: totalPrice.toString(),
        commission: platformFee.toString(),
      };
      const res = await apiRequest("POST", "/api/mooring-bookings", bookingData);
      return await res.json();
    },
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mooring-bookings"] });
      toast({
        title: "Prenotazione creata",
        description: "Ora procedi con il pagamento",
      });
      const checkIn = form.getValues("startDate").toISOString();
      const checkOut = form.getValues("endDate").toISOString();
      setLocation(`/checkout?type=mooring&bookingId=${booking.id}&amount=${totalPrice}&name=${encodeURIComponent(mooring.name)}&startDate=${checkIn}&endDate=${checkOut}`);
    },
    onError: (error) => {
      toast({
        title: "Errore nella prenotazione",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MooringBookingFormData) => {
    if (step === "dates") {
      if (!isRangeAvailable(data.startDate, data.endDate)) {
        toast({
          title: "Date non disponibili",
          description: "Alcune date selezionate non sono disponibili. Scegli date diverse.",
          variant: "destructive",
        });
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (!user) {
        toast({
          title: "Accesso richiesto",
          description: "Devi effettuare l'accesso per completare la prenotazione",
          variant: "destructive",
        });
        setLocation("/auth");
        return;
      }
      createBookingMutation.mutate(data);
    }
  };

  const goBack = () => {
    if (step === "details") {
      setStep("dates");
    } else if (step === "payment") {
      setStep("details");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col" style={{ display: 'flex' }}>
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Prenota {mooring.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 min-h-0 pr-1 -mr-1">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === "dates" ? "text-ocean-blue" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === "dates" ? "bg-ocean-blue text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="ml-2 text-sm">Date</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step === "details" ? "text-ocean-blue" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === "details" ? "bg-ocean-blue text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="ml-2 text-sm">Dettagli</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${step === "payment" ? "text-ocean-blue" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === "payment" ? "bg-ocean-blue text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="ml-2 text-sm">Pagamento</span>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === "dates" && (
              <Card>
                <CardHeader>
                  <CardTitle>Seleziona le date</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check-in</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: it }) : "Seleziona data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => form.setValue("startDate", date!)}
                            disabled={(date) => date < new Date() || isDateBlocked(date)}
                            modifiers={{
                              blocked: (date) => isDateBlocked(date),
                            }}
                            modifiersClassNames={{
                              blocked: 'line-through text-red-300 opacity-50',
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Check-out</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP", { locale: it }) : "Seleziona data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => form.setValue("endDate", date!)}
                            disabled={(date) => date <= startDate || isDateBlocked(date)}
                            modifiers={{
                              blocked: (date) => isDateBlocked(date),
                            }}
                            modifiersClassNames={{
                              blocked: 'line-through text-red-300 opacity-50',
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {form.formState.errors.endDate && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {form.formState.errors.endDate.message}
                    </div>
                  )}

                  {days > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Durata: {days} {days === 1 ? "giorno" : "giorni"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "details" && (
              <Card>
                <CardHeader>
                  <CardTitle>Dettagli prenotazione</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Accesso richiesto</p>
                          <p>Devi effettuare l'accesso per completare la prenotazione.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notes">Note aggiuntive (opzionale)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Richieste speciali, dimensioni barca, preferenze..."
                      {...form.register("notes")}
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">Informazioni importanti:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Cancellazione gratuita fino a 24 ore prima</li>
                          <li>• Documento di identità richiesto all'arrivo</li>
                          <li>• Rispettare le regole del porto</li>
                          <li>• I servizi aggiuntivi potrebbero avere costi extra</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Riepilogo prezzo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>€{mooring.pricePerDay} x {days} {days === 1 ? "giorno" : "giorni"}</span>
                    <span>€{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commissione SeaBoo (15%)</span>
                    <span>€{platformFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Totale</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </form>
        </div>

        <div className="flex space-x-3 pt-3 border-t shrink-0">
          {step !== "dates" && (
            <Button variant="outline" onClick={goBack} className="flex-1">
              Indietro
            </Button>
          )}
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="flex-1 bg-coral hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100"
            disabled={createBookingMutation.isPending}
          >
            {step === "dates" && "Continua"}
            {step === "details" && !user && "Accedi per continuare"}
            {step === "details" && user && (createBookingMutation.isPending ? "Creazione..." : "Procedi al pagamento")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}