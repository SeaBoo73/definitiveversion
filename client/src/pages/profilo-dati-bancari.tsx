import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { ArrowLeft, CreditCard, Banknote, Shield, CheckCircle, Edit, Save } from "lucide-react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BankingData {
  iban: string;
  bankName: string;
  accountHolder: string;
  swiftBic: string;
}

export default function ProfiloDatiBancariPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Banking data state
  const [bankingData, setBankingData] = useState<BankingData>({
    iban: "",
    bankName: "",
    accountHolder: "",
    swiftBic: "",
  });

  // Fetch profile data from database
  const { data: fullProfile } = useQuery<{
    iban: string | null;
    ibanMasked: string | null;
    bankName: string | null;
    accountHolder: string | null;
    accountHolderMasked: string | null;
    swiftBic: string | null;
  }>({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  // Update state when profile loads
  useEffect(() => {
    if (fullProfile) {
      setBankingData({
        iban: fullProfile.iban || "",
        bankName: fullProfile.bankName || "",
        accountHolder: fullProfile.accountHolder || "",
        swiftBic: fullProfile.swiftBic || "",
      });
    }
  }, [fullProfile]);

  const updateBankingMutation = useMutation({
    mutationFn: async (data: BankingData) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Dati aggiornati",
        description: "I tuoi dati bancari sono stati salvati in modo sicuro con crittografia AES-256.",
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

  const handleSave = () => {
    updateBankingMutation.mutate(bankingData);
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
                <div className="space-y-6">
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
                          value={isEditing ? bankingData.iban : (fullProfile?.ibanMasked || "")}
                          onChange={(e) => setBankingData({ ...bankingData, iban: e.target.value })}
                          data-testid="input-iban"
                          className={!isEditing && fullProfile?.ibanMasked ? "font-mono tracking-wider" : ""}
                        />
                        {!isEditing && fullProfile?.ibanMasked && (
                          <p className="text-xs text-gray-500">IBAN parzialmente nascosto per sicurezza</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Nome Banca</Label>
                        <Input
                          id="bankName"
                          placeholder="Es. UniCredit, Intesa Sanpaolo"
                          disabled={!isEditing}
                          value={bankingData.bankName}
                          onChange={(e) => setBankingData({ ...bankingData, bankName: e.target.value })}
                          data-testid="input-bank-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Intestatario Conto</Label>
                        <Input
                          id="accountHolder"
                          placeholder="Nome e cognome del titolare"
                          disabled={!isEditing}
                          value={isEditing ? bankingData.accountHolder : (fullProfile?.accountHolderMasked || "")}
                          onChange={(e) => setBankingData({ ...bankingData, accountHolder: e.target.value })}
                          data-testid="input-account-holder"
                        />
                        {!isEditing && fullProfile?.accountHolderMasked && (
                          <p className="text-xs text-gray-500">Nome parzialmente nascosto per sicurezza</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="swiftBic">Codice SWIFT/BIC (opzionale)</Label>
                        <Input
                          id="swiftBic"
                          placeholder="BCITITMM"
                          disabled={!isEditing}
                          value={bankingData.swiftBic}
                          onChange={(e) => setBankingData({ ...bankingData, swiftBic: e.target.value })}
                          data-testid="input-swift-bic"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Crittografia AES-256</p>
                        <p className="text-sm text-green-700">
                          I tuoi dati bancari vengono crittografati con algoritmo AES-256-GCM prima di essere salvati nel database. 
                          Solo tu puoi visualizzarli.
                        </p>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="button"
                        onClick={handleSave}
                        disabled={updateBankingMutation.isPending}
                        data-testid="button-save-banking"
                      >
                        {updateBankingMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
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
                </div>
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