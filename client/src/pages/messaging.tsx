import { useState } from 'react';
import { ConversationList } from '@/components/messaging/conversation-list';
import { ChatInterface } from '@/components/messaging/chat-interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function MessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue mx-auto mb-4"></div>
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          onClick={() => setLocation("/profilo")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna al profilo
        </Button>
      </div>
      
      <div className="mb-6 pb-40">
        <h1 className="text-3xl font-bold mb-2">Sistema di Messaggistica</h1>
        <p className="text-muted-foreground">
          Comunica in tempo reale con proprietari di barche e altri utenti
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Lista Conversazioni */}
        <div>
          <ConversationList
            onSelectConversation={setSelectedConversationId}
            currentUserId={user.id}
            selectedConversationId={selectedConversationId}
          />
        </div>

        {/* Interfaccia Chat */}
        {selectedConversationId && (
          <div>
            <ChatInterface
              conversationId={selectedConversationId}
              currentUserId={user.id}
              onClose={() => setSelectedConversationId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}