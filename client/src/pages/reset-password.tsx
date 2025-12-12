import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Anchor, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (!tokenParam) {
      setIsValidating(false);
      setIsValid(false);
      setErrorMessage("Link non valido");
      return;
    }
    
    setToken(tokenParam);
    
    // Verify token
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password/${tokenParam}`);
        const data = await response.json();
        
        if (data.valid) {
          setIsValid(true);
        } else {
          setErrorMessage(data.error || "Link non valido o scaduto");
        }
      } catch (error) {
        setErrorMessage("Errore durante la verifica del link");
      } finally {
        setIsValidating(false);
      }
    };
    
    verifyToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Errore",
        description: "La password deve avere almeno 6 caratteri",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non coincidono",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/reset-password', {
        token,
        password,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSuccess(true);
        toast({
          title: "Password aggiornata",
          description: "Ora puoi accedere con la tua nuova password",
        });
      } else {
        toast({
          title: "Errore",
          description: data.error || "Impossibile aggiornare la password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center">
              <Anchor className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle>Reimposta Password</CardTitle>
          <CardDescription>
            {isValidating ? "Verifica in corso..." : 
             isSuccess ? "Password aggiornata con successo" :
             isValid ? "Crea una nuova password per il tuo account" :
             "Link non valido"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidating ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
            </div>
          ) : isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                La tua password è stata aggiornata con successo.
              </p>
              <Link href="/auth">
                <Button className="w-full bg-ocean-blue hover:bg-blue-600">
                  Vai al Login
                </Button>
              </Link>
            </div>
          ) : isValid ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nuova Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Almeno 6 caratteri"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-new-password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Conferma Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ripeti la password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  data-testid="input-confirm-password"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-ocean-blue hover:bg-blue-600"
                disabled={isSubmitting}
                data-testid="button-reset-password"
              >
                {isSubmitting ? "Aggiornamento in corso..." : "Aggiorna Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">
                {errorMessage}
              </p>
              <Link href="/auth">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Torna al Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
