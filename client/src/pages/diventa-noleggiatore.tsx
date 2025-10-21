import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Ship, 
  Euro, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  FileText,
  CreditCard,
  Phone,
  Globe
} from "lucide-react";

export default function DiventaNoleggiatorePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCommission, setAcceptedCommission] = useState(false);
  const [acceptedRequirements, setAcceptedRequirements] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [phone, setPhone] = useState("");

  const isAlreadyOwner = user?.role === 'owner';
  const needsUpgrade = user && user.role !== 'owner';

  const upgradeToOwnerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/user/upgrade-to-owner", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upgrade completato!",
        description: "Ora sei un noleggiatore SeaBoo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setTimeout(() => {
        setLocation("/owner-dashboard");
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'upgrade",
        variant: "destructive",
      });
    },
  });

  const handleProceed = () => {
    if (!acceptedTerms || !acceptedCommission || !acceptedRequirements) {
      toast({
        title: "Attenzione",
        description: "Devi accettare tutti i termini per procedere",
        variant: "destructive",
      });
      return;
    }

    if (isAlreadyOwner) {
      // Already owner, go to dashboard
      setLocation("/owner-dashboard");
    } else if (needsUpgrade) {
      // Upgrade existing customer account
      if (!businessName || !phone) {
        toast({
          title: "Campi mancanti",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive",
        });
        return;
      }
      upgradeToOwnerMutation.mutate({
        businessName,
        businessType,
        vatNumber,
        phone
      });
    } else {
      // Not logged in, redirect to registration
      setLocation("/auth?tab=register&role=owner");
    }
  };

  const canProceed = acceptedTerms && acceptedCommission && acceptedRequirements;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <Ship className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diventa Noleggiatore SeaBoo
          </h1>
          <p className="text-gray-600 text-lg">
            Trasforma la tua imbarcazione in una fonte di reddito. Unisciti alla community di noleggiatori SeaBoo.
          </p>
        </div>

        {/* Benefits Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Vantaggi del Noleggiatore SeaBoo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Euro className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Guadagni Extra</h3>
                  <p className="text-gray-600 text-sm">Monetizza la tua barca quando non la usi. Guadagni medi di €12.500/anno.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Copertura Assicurativa</h3>
                  <p className="text-gray-600 text-sm">Protezione completa per la tua imbarcazione durante i noleggi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Clienti Verificati</h3>
                  <p className="text-gray-600 text-sm">Tutti i clienti sono verificati e valutati dalla community.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Gestione Semplice</h3>
                  <p className="text-gray-600 text-sm">Dashboard intuitiva per gestire calendario, prenotazioni e pagamenti.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Structure */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Struttura Commissioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Commissione SeaBoo</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">15%</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                SeaBoo trattiene il 15% del valore di ogni prenotazione per coprire:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Marketing e promozione della tua imbarcazione</li>
                <li>• Elaborazione pagamenti sicuri</li>
                <li>• Supporto clienti 24/7</li>
                <li>• Copertura assicurativa durante i noleggi</li>
                <li>• Manutenzione piattaforma tecnologica</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-orange-600" />
              Requisiti e Documenti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Documenti Obbligatori</h3>
                  <ul className="text-gray-600 text-sm mt-2 space-y-1">
                    <li>• Certificato di proprietà dell'imbarcazione</li>
                    <li>• Assicurazione nautica valida</li>
                    <li>• Licenza di navigazione (se richiesta)</li>
                    <li>• Documento di identità del proprietario</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Criteri di Idoneità</h3>
                  <ul className="text-gray-600 text-sm mt-2 space-y-1">
                    <li>• Imbarcazione in buone condizioni di sicurezza</li>
                    <li>• Equipaggiamenti di sicurezza conformi</li>
                    <li>• Ormeggio presso porti partner SeaBoo</li>
                    <li>• Disponibilità minima 30 giorni/anno</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Acceptance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Accettazione Condizioni</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                Accetto i{" "}
                <Link href="/termini-servizio" className="text-blue-600 hover:underline">
                  Termini di Servizio
                </Link>
                {" "}e la{" "}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                {" "}di SeaBoo
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="commission"
                checked={acceptedCommission}
                onCheckedChange={(checked) => setAcceptedCommission(checked === true)}
              />
              <label htmlFor="commission" className="text-sm text-gray-700 leading-5">
                Accetto la struttura commissionale del 15% su ogni prenotazione e comprendo che questo importo verrà trattenuto automaticamente
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="requirements"
                checked={acceptedRequirements}
                onCheckedChange={(checked) => setAcceptedRequirements(checked === true)}
              />
              <label htmlFor="requirements" className="text-sm text-gray-700 leading-5">
                Confermo di possedere tutti i documenti richiesti e che la mia imbarcazione rispetta i criteri di idoneità
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Business Info Form - Only shown if user needs to upgrade */}
        {needsUpgrade && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Informazioni Aziendali</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Completa i tuoi dati per diventare un noleggiatore SeaBoo
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome attività/azienda *</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="es. Noleggio Barche Azzurro"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    data-testid="input-business-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo attività</Label>
                  <Input
                    id="businessType"
                    type="text"
                    placeholder="es. Ditta individuale, SRL, ecc."
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    data-testid="input-business-type"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">Partita IVA</Label>
                  <Input
                    id="vatNumber"
                    type="text"
                    placeholder="es. IT12345678901"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    data-testid="input-vat-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="es. +39 333 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleProceed}
            disabled={!canProceed || upgradeToOwnerMutation.isPending}
            className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all ${
              canProceed && !upgradeToOwnerMutation.isPending
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            data-testid="button-proceed"
          >
            {upgradeToOwnerMutation.isPending 
              ? "Elaborazione..." 
              : isAlreadyOwner 
                ? "Accedi alla Dashboard"
                : needsUpgrade
                  ? "Diventa Noleggiatore"
                  : "Registrati come Noleggiatore"
            }
          </Button>
          <p className="text-gray-500 text-sm mt-3">
            {user 
              ? "Sarai reindirizzato alla tua dashboard per aggiungere la prima imbarcazione"
              : "Sarai reindirizzato alla pagina di registrazione"
            }
          </p>
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <div className="bg-gray-100 rounded-lg p-6">
            <Phone className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-2">Hai bisogno di aiuto?</h3>
            <p className="text-gray-600 text-sm mb-3">
              Il nostro team è sempre disponibile per supportarti nel processo di registrazione
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/aiuto">Centro Assistenza</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/ia">Chat IA</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}