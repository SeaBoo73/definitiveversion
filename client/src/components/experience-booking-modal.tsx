import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Users,
  Shield,
  AlertCircle,
  X
} from "lucide-react";
import { useLocation } from "wouter";

interface ExperienceBookingModalProps {
  experience: any;
  onClose: () => void;
}

export function ExperienceBookingModal({ experience, onClose }: ExperienceBookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"dates" | "details" | "payment">("dates");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [numParticipants, setNumParticipants] = useState(1);
  const [notes, setNotes] = useState("");

  const { data: availability } = useQuery<any[]>({
    queryKey: ['/api/experiences', experience.id, 'availability'],
    queryFn: async () => {
      const res = await fetch(`/api/experiences/${experience.id}/availability`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const blockedDates = new Set<string>();
  if (availability) {
    availability.forEach((a: any) => {
      if (a.status === 'blocked' || a.status === 'booked') {
        const start = new Date(a.startDate);
        const end = new Date(a.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          blockedDates.add(d.toISOString().split('T')[0]);
        }
      }
    });
  }

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.has(dateStr);
  };

  const pricePerPerson = parseFloat(String(experience.pricePerPerson) || '0');
  const basePrice = pricePerPerson * numParticipants;
  const platformFee = Math.round(basePrice * 0.15);
  const totalPrice = basePrice + platformFee;

  const handleContinue = () => {
    if (step === "dates") {
      if (!selectedDate) {
        toast({
          title: "Seleziona una data",
          description: "Devi selezionare una data per continuare.",
          variant: "destructive",
        });
        return;
      }
      if (isDateBlocked(selectedDate)) {
        toast({
          title: "Data non disponibile",
          description: "La data selezionata non è disponibile. Scegli una data diversa.",
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
      setLocation(`/checkout?type=experience&amount=${totalPrice}&name=${encodeURIComponent(experience.name)}&date=${selectedDate!.toISOString()}&participants=${numParticipants}`);
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
            <span>Prenota {experience.name}</span>
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

          {step === "dates" && (
            <Card>
              <CardHeader>
                <CardTitle>Seleziona la data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data dell'esperienza</Label>
                  <input
                    type="date"
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                    value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const d = new Date(e.target.value + 'T00:00:00');
                      if (isDateBlocked(d)) return;
                      setSelectedDate(d);
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-blue-800">
                      Data selezionata: <span className="font-semibold">{format(selectedDate, "PPP", { locale: it })}</span>
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Partecipanti</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Max {experience.maxParticipants}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setNumParticipants(Math.max(1, numParticipants - 1))}
                      disabled={numParticipants <= 1}
                    >
                      -
                    </Button>
                    <span className="text-lg font-bold w-6 text-center">{numParticipants}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setNumParticipants(Math.min(experience.maxParticipants, numParticipants + 1))}
                      disabled={numParticipants >= experience.maxParticipants}
                    >
                      +
                    </Button>
                  </div>
                </div>
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
                    placeholder="Richieste speciali, allergie, preferenze..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Informazioni importanti:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Cancellazione gratuita fino a 24 ore prima</li>
                        <li>• Documento di identità richiesto</li>
                        <li>• Durata esperienza: {experience.duration} ore</li>
                        <li>• Pagamento sicuro con Stripe</li>
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
                  <span>€{pricePerPerson.toFixed(2)} x {numParticipants} {numParticipants === 1 ? "persona" : "persone"}</span>
                  <span>€{basePrice.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Totale</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-3 pt-3 border-t shrink-0">
          {step !== "dates" && (
            <Button variant="outline" onClick={goBack} className="flex-1">
              Indietro
            </Button>
          )}
          <Button
            onClick={handleContinue}
            className="flex-1 bg-coral hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:hover:scale-100"
            disabled={step === "dates" && !selectedDate || step === "details" && !user}
          >
            {step === "dates" && "Continua"}
            {step === "details" && !user && "Accedi per continuare"}
            {step === "details" && user && "Procedi al pagamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
