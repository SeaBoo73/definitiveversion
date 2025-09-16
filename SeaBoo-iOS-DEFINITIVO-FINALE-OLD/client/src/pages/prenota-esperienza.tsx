import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Link, useRoute, useLocation } from "wouter";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Euro,
  CreditCard,
  CheckCircle2,
  Info
} from "lucide-react";

export default function PrenotaEsperienza() {
  const [match, params] = useRoute("/prenota-esperienza/:tipo");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const tipo = params?.tipo || "";

  // Form state
  const [dataPrenotazione, setDataPrenotazione] = useState<Date>();
  const [numeroPersone, setNumeroPersone] = useState("2");
  const [orario, setOrario] = useState("");
  const [porto, setPorto] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const esperienze = {
    "tramonto": {
      title: "Tramonti in barca",
      description: "Gita al tramonto con aperitivo a bordo",
      durata: "3 ore",
      prezzo: 89,
      maxPersone: 12,
      orari: ["17:30", "18:00", "18:30"],
      porti: ["Civitavecchia", "Gaeta", "Anzio", "Terracina", "Formia", "Ponza", "Napoli", "Salerno", "Sorrento", "Amalfi", "Positano", "Capri", "Ischia", "Procida"]
    },
    "tour-isole": {
      title: "Tour delle isole nascoste",
      description: "Esplorazione di calette e baie accessibili solo via mare",
      durata: "8 ore",
      prezzo: 159,
      maxPersone: 12,
      orari: ["08:30", "09:00"],
      porti: ["Ponza", "Ventotene", "Formia", "Napoli", "Salerno", "Capri", "Ischia", "Procida", "Amalfi", "Positano", "Agropoli", "Palinuro", "Marina di Camerota"]
    }
  };

  const esperienza = esperienze[tipo as keyof typeof esperienze];

  useEffect(() => {
    if (!esperienza) {
      navigate("/esperienze");
    }
  }, [esperienza, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataPrenotazione || !orario || !porto || !nome || !cognome || !email) {
      toast({
        title: "Campi mancanti",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create experience booking
      const bookingData = {
        tipo: esperienza.title,
        data: format(dataPrenotazione, "yyyy-MM-dd"),
        orario,
        porto,
        numeroPersone: parseInt(numeroPersone),
        prezzoTotale: esperienza.prezzo * parseInt(numeroPersone),
        cliente: {
          nome,
          cognome,
          email
        },
        note
      };

      // Create Stripe payment intent for experience
      const response = await fetch('/api/create-experience-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Errore nella creazione del pagamento');
      }

      const { clientSecret, bookingId } = await response.json();

      // Redirect to payment page with booking details
      navigate(`/checkout-esperienza?client_secret=${clientSecret}&booking_id=${bookingId}`);

    } catch (error) {
      console.error('Errore prenotazione:', error);
      toast({
        title: "Errore prenotazione",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!esperienza) {
    return null;
  }

  const prezzoTotale = esperienza.prezzo * parseInt(numeroPersone);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Back Button */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            <Link href={`/esperienza/${tipo}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              ← Torna ai dettagli
            </Link>
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Prenota la tua esperienza</h1>
          <p className="text-blue-100 text-lg">{esperienza.title} - {esperienza.description}</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli prenotazione</CardTitle>
                <CardDescription>
                  Compila tutti i campi per prenotare la tua esperienza
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Data e Orario */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data">Data prenotazione *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataPrenotazione ? format(dataPrenotazione, "dd MMMM yyyy", { locale: it }) : "Seleziona data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataPrenotazione}
                            onSelect={setDataPrenotazione}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="orario">Orario partenza *</Label>
                      <Select value={orario} onValueChange={setOrario}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona orario" />
                        </SelectTrigger>
                        <SelectContent>
                          {esperienza.orari.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Porto e Persone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="porto">Porto di partenza *</Label>
                      <Select value={porto} onValueChange={setPorto}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona porto" />
                        </SelectTrigger>
                        <SelectContent>
                          {esperienza.porti.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="persone">Numero persone *</Label>
                      <Select value={numeroPersone} onValueChange={setNumeroPersone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: esperienza.maxPersone }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "persona" : "persone"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Dati Cliente */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dati del cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                          id="nome"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Il tuo nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cognome">Cognome *</Label>
                        <Input
                          id="cognome"
                          value={cognome}
                          onChange={(e) => setCognome(e.target.value)}
                          placeholder="Il tuo cognome"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tua@email.com"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="note">Note aggiuntive</Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Eventuali richieste particolari, allergie alimentari, ecc."
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-coral hover:bg-orange-600 text-white text-lg py-3"
                    disabled={loading}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {loading ? "Elaborazione..." : "Procedi al pagamento"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Riepilogo prenotazione</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{esperienza.durata}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{numeroPersone} {parseInt(numeroPersone) === 1 ? "persona" : "persone"}</span>
                  </div>
                  {porto && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{porto}</span>
                    </div>
                  )}
                  {dataPrenotazione && orario && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {format(dataPrenotazione, "dd/MM/yyyy", { locale: it })} - {orario}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Totale</span>
                    <span className="text-coral">€{prezzoTotale}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    €{esperienza.prezzo} × {numeroPersone} {parseInt(numeroPersone) === 1 ? "persona" : "persone"}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Cancellazione gratuita 24h prima</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Conferma immediata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Pagamento sicuro</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Pagamento sicuro</p>
                      <p>I tuoi dati sono protetti con crittografia SSL</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}