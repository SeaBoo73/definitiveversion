import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Clock, CheckCircle, XCircle, Loader } from "lucide-react";

export function TestBookingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error' | 'running'>>({});

  const { data: boats = [] } = useQuery({
    queryKey: ['/api/boats']
  });

  const createTestBooking = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Booking failed');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      setTestResults(prev => ({ ...prev, booking: 'success' }));
      toast({
        title: "Test Prenotazione Riuscito",
        description: "Prenotazione test creata con successo",
      });
    },
    onError: (error) => {
      setTestResults(prev => ({ ...prev, booking: 'error' }));
      toast({
        title: "Test Fallito",
        description: `Errore: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const { data: userBookings = [] } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!user
  });

  const testFunctions = [
    {
      id: 'auth',
      name: 'Test Autenticazione',
      description: 'Verifica login e sessione utente',
      test: async () => {
        setTestResults(prev => ({ ...prev, auth: 'running' }));
        try {
          const response = await fetch('/api/user');
          const userResponse = await response.json();
          if (response.ok && userResponse && userResponse.email) {
            setTestResults(prev => ({ ...prev, auth: 'success' }));
            return `✅ Utente autenticato: ${userResponse.email}`;
          } else {
            setTestResults(prev => ({ ...prev, auth: 'error' }));
            return '❌ Nessun utente autenticato';
          }
        } catch (error: any) {
          setTestResults(prev => ({ ...prev, auth: 'error' }));
          return `❌ Errore autenticazione: ${error.message}`;
        }
      }
    },
    {
      id: 'boats',
      name: 'Test Caricamento Barche',
      description: 'Verifica API barche',
      test: async () => {
        setTestResults(prev => ({ ...prev, boats: 'running' }));
        try {
          const response = await fetch('/api/boats');
          const boatsResponse = await response.json();
          if (response.ok && boatsResponse && boatsResponse.length > 0) {
            setTestResults(prev => ({ ...prev, boats: 'success' }));
            return `✅ ${boatsResponse.length} barche caricate`;
          } else {
            setTestResults(prev => ({ ...prev, boats: 'error' }));
            return '❌ Nessuna barca trovata';
          }
        } catch (error: any) {
          setTestResults(prev => ({ ...prev, boats: 'error' }));
          return `❌ Errore caricamento barche: ${error.message}`;
        }
      }
    },
    {
      id: 'booking',
      name: 'Test Prenotazione',
      description: 'Crea una prenotazione test',
      test: async () => {
        if (!user) {
          setTestResults(prev => ({ ...prev, booking: 'error' }));
          return '❌ Login richiesto per prenotare';
        }
        
        if (boats.length === 0) {
          setTestResults(prev => ({ ...prev, booking: 'error' }));
          return '❌ Nessuna barca disponibile';
        }

        setTestResults(prev => ({ ...prev, booking: 'running' }));
        
        const testBookingData = {
          boatId: boats[0].id,
          startDate: "2025-08-15",
          endDate: "2025-08-17",
          skipperRequired: false,
          fuelIncluded: true,
          additionalServices: ["WiFi"],
          totalPrice: 450,
          commission: 67.5
        };

        try {
          await createTestBooking.mutateAsync(testBookingData);
          return '✅ Prenotazione test creata';
        } catch (error: any) {
          return `❌ Errore prenotazione: ${error.message}`;
        }
      }
    },
    {
      id: 'notifications',
      name: 'Test Notifiche',
      description: 'Verifica sistema notifiche',
      test: async () => {
        setTestResults(prev => ({ ...prev, notifications: 'running' }));
        try {
          const response = await fetch('/api/notifications');
          const notificationsResponse = await response.json();
          if (response.ok) {
            setTestResults(prev => ({ ...prev, notifications: 'success' }));
            return `✅ Sistema notifiche funzionante (${notificationsResponse?.length || 0} notifiche)`;
          } else {
            setTestResults(prev => ({ ...prev, notifications: 'error' }));
            return '❌ Sistema notifiche non disponibile';
          }
        } catch (error: any) {
          setTestResults(prev => ({ ...prev, notifications: 'error' }));
          return `❌ Errore notifiche: ${error.message}`;
        }
      }
    },
    {
      id: 'ai',
      name: 'Test IA Assistant',
      description: 'Verifica funzionalità IA',
      test: async () => {
        setTestResults(prev => ({ ...prev, ai: 'running' }));
        try {
          const aiResponse = await fetch('/api/ai/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: "Test raccomandazioni",
              context: { location: "Roma", guests: 4 }
            })
          });
          
          if (aiResponse.ok) {
            setTestResults(prev => ({ ...prev, ai: 'success' }));
            return '✅ IA Assistant funzionante';
          } else {
            setTestResults(prev => ({ ...prev, ai: 'error' }));
            return '❌ IA Assistant non disponibile (API key richiesta)';
          }
        } catch (error: any) {
          setTestResults(prev => ({ ...prev, ai: 'error' }));
          return `❌ Errore IA: ${error.message}`;
        }
      }
    }
  ];

  const [testOutput, setTestOutput] = useState<Record<string, string>>({});

  const runTest = async (testFunction: any) => {
    const result = await testFunction.test();
    setTestOutput(prev => ({ ...prev, [testFunction.id]: result }));
  };

  const runAllTests = async () => {
    for (const test of testFunctions) {
      await runTest(test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running': return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Test Sistema SeaBoo
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{boats.length}</div>
              <div className="text-sm text-muted-foreground">Barche Disponibili</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userBookings.length}</div>
              <div className="text-sm text-muted-foreground">Prenotazioni Utente</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {user ? user.role : 'Guest'}
              </div>
              <div className="text-sm text-muted-foreground">Stato Utente</div>
            </div>
          </div>

          {user ? (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                ✅ Autenticato come: <strong>{user.email}</strong> ({user.role})
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800">
                ⚠️ Non autenticato. <a href="/auth" className="underline">Effettua il login</a> per testare le prenotazioni.
              </p>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <Button onClick={runAllTests} className="flex-1">
              Esegui Tutti i Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Functions */}
      <div className="space-y-4">
        {testFunctions.map((test) => (
          <Card key={test.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults[test.id])}
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => runTest(test)}
                  disabled={testResults[test.id] === 'running'}
                >
                  {testResults[test.id] === 'running' ? 'Running...' : 'Test'}
                </Button>
              </div>
              
              {testOutput[test.id] && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm font-mono">
                  {testOutput[test.id]}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      {userBookings.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Prenotazioni Recenti</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {userBookings.slice(0, 3).map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Prenotazione #{booking.id}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Barca ID: {booking.boatId}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                    <div className="text-lg font-bold">€{booking.totalPrice}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}