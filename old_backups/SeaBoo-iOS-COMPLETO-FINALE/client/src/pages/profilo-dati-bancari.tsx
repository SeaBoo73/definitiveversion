import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CreditCard, Banknote, Shield, CheckCircle, Edit, Save } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const bankingDataSchema = z.object({
  iban: z.string().optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  paymentPreference: z.string().default("stripe"),
  taxCode: z.string().optional(),
  vatNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("Italy"),
});

type BankingData = z.infer<typeof bankingDataSchema>;

export default function ProfiloDatiBancariPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BankingData>({
    resolver: zodResolver(bankingDataSchema),
    defaultValues: {
      iban: user?.iban || "",
      bankName: user?.bankName || "",
      accountHolderName: user?.accountHolderName || "",
      paymentPreference: user?.paymentPreference || "stripe",
      taxCode: user?.taxCode || "",
      vatNumber: user?.vatNumber || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "Italy",
    },
  });

  const updateBankingMutation = useMutation({
    mutationFn: async (data: BankingData) => {
      const response = await fetch(`/api/users/${user?.id}/banking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update banking data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Dati aggiornati",
        description: "I tuoi dati bancari sono stati aggiornati con successo.",
      });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BankingData) => {
    updateBankingMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso richiesto</h1>
          <p className="text-gray-600 mb-6">Devi essere autenticato per visualizzare questa pagina.</p>
          <Link href="/auth">
            <Button>Accedi</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (user.role !== "owner") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso negato</h1>
          <p className="text-gray-600 mb-6">Questa sezione è disponibile solo per i proprietari di barche.</p>
          <Link href="/profilo">
            <Button>Torna al profilo</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/profilo">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna al profilo
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dati Bancari</h1>
          <p className="text-gray-600">
            Gestisci le tue informazioni bancarie per ricevere i pagamenti dai noleggi
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Informazioni Bancarie
                  </CardTitle>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={updateBankingMutation.isPending}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salva
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifica
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* IBAN Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Dati del Conto</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="iban">IBAN</Label>
                        <Input
                          id="iban"
                          placeholder="IT60 X054 2811 1010 0000 0123 456"
                          disabled={!isEditing}
                          {...form.register("iban")}
                          data-testid="input-iban"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Nome Banca</Label>
                        <Input
                          id="bankName"
                          placeholder="Es. UniCredit, Intesa Sanpaolo"
                          disabled={!isEditing}
                          {...form.register("bankName")}
                          data-testid="input-bank-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Intestatario Conto</Label>
                        <Input
                          id="accountHolderName"
                          placeholder="Nome e cognome del titolare"
                          disabled={!isEditing}
                          {...form.register("accountHolderName")}
                          data-testid="input-account-holder"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tax Information */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium text-gray-900">Informazioni Fiscali</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxCode">Codice Fiscale</Label>
                        <Input
                          id="taxCode"
                          placeholder="RSSMRA80A01H501X"
                          disabled={!isEditing}
                          {...form.register("taxCode")}
                          data-testid="input-tax-code"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vatNumber">Partita IVA (opzionale)</Label>
                        <Input
                          id="vatNumber"
                          placeholder="12345678901"
                          disabled={!isEditing}
                          {...form.register("vatNumber")}
                          data-testid="input-vat-number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium text-gray-900">Indirizzo</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Indirizzo</Label>
                        <Input
                          id="address"
                          placeholder="Via Roma 123"
                          disabled={!isEditing}
                          {...form.register("address")}
                          data-testid="input-address"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Città</Label>
                          <Input
                            id="city"
                            placeholder="Milano"
                            disabled={!isEditing}
                            {...form.register("city")}
                            data-testid="input-city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">CAP</Label>
                          <Input
                            id="postalCode"
                            placeholder="20100"
                            disabled={!isEditing}
                            {...form.register("postalCode")}
                            data-testid="input-postal-code"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Paese</Label>
                        <Select
                          value={form.watch("country")}
                          onValueChange={(value) => form.setValue("country", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger data-testid="select-country">
                            <SelectValue placeholder="Seleziona paese" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Italy">Italia</SelectItem>
                            <SelectItem value="Switzerland">Svizzera</SelectItem>
                            <SelectItem value="France">Francia</SelectItem>
                            <SelectItem value="Austria">Austria</SelectItem>
                            <SelectItem value="Germany">Germania</SelectItem>
                            <SelectItem value="Spain">Spagna</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Preference */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium text-gray-900">Preferenza Pagamento</h3>
                    <div className="space-y-2">
                      <Label htmlFor="paymentPreference">Metodo Preferito</Label>
                      <Select
                        value={form.watch("paymentPreference")}
                        onValueChange={(value) => form.setValue("paymentPreference", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger data-testid="select-payment-preference">
                          <SelectValue placeholder="Seleziona metodo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe (Consigliato)</SelectItem>
                          <SelectItem value="bank_transfer">Bonifico Bancario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        disabled={updateBankingMutation.isPending}
                        data-testid="button-save-banking"
                      >
                        {updateBankingMutation.isPending ? "Salvando..." : "Salva Modifiche"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        data-testid="button-cancel-banking"
                      >
                        Annulla
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Shield className="mr-2 h-5 w-5" />
                  Sicurezza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Dati Crittografati</p>
                    <p className="text-gray-600">Le tue informazioni bancarie sono protette con crittografia SSL</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Conformità PCI</p>
                    <p className="text-gray-600">Standard internazionali per la sicurezza dei pagamenti</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Pagamenti Sicuri</p>
                    <p className="text-gray-600">Ricevi i tuoi guadagni in modo sicuro e puntuale</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Banknote className="mr-2 h-5 w-5" />
                  Pagamenti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-2">Come funziona:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• I pagamenti vengono elaborati automaticamente</li>
                    <li>• Ricevi l'85% del prezzo di noleggio</li>
                    <li>• Bonifici settimanali ogni venerdì</li>
                    <li>• Tracciamento completo nelle statistiche</li>
                  </ul>
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