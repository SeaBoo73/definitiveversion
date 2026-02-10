import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConversationList } from '@/components/messaging/conversation-list';
import { ChatInterface } from '@/components/messaging/chat-interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function MessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [location, setLocation] = useLocation();

  // Query per ottenere l'utente corrente
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Non autorizzato');
      return response.json();
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Accesso Richiesto</h2>
              <p className="text-muted-foreground">
                Effettua l'accesso per utilizzare il sistema di messaggistica
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back to Home Button */}
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
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sistema di Messaggistica</h1>
        <p className="text-muted-foreground">
          Comunica in tempo reale con proprietari di barche e altri utenti
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Lista Conversazioni */}
        <div className="lg:col-span-1">
          <ConversationList
            onSelectConversation={setSelectedConversationId}
            currentUserId={user.id}
            selectedConversationId={selectedConversationId}
          />
        </div>

        {/* Interfaccia Chat */}
        <div className="lg:col-span-2">
          {selectedConversationId ? (
            <ChatInterface
              conversationId={selectedConversationId}
              currentUserId={user.id}
              onClose={() => setSelectedConversationId(null)}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">I tuoi messaggi</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Seleziona una conversazione per visualizzare i messaggi.
                    Le conversazioni vengono create automaticamente quando effettui una prenotazione o invii una richiesta a un noleggiatore.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}