import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Ship, Anchor, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/messaging/chat-interface";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface ConversationData {
  id: number;
  bookingId?: number | null;
  customerId: number;
  ownerId: number;
  referenceType?: string | null;
  referenceId?: number | null;
  referenceName?: string | null;
  createdAt: string;
  lastMessageAt: string;
}

export default function OwnerMessages() {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const { data: conversations, isLoading } = useQuery<ConversationData[]>({
    queryKey: ["/api/user/conversations"],
    refetchInterval: 15000,
  });

  const getReferenceIcon = (type?: string | null) => {
    switch (type) {
      case 'boat': return <Ship className="h-5 w-5 text-ocean-blue" />;
      case 'mooring': return <Anchor className="h-5 w-5 text-ocean-blue" />;
      case 'experience': return <Compass className="h-5 w-5 text-ocean-blue" />;
      default: return <MessageCircle className="h-5 w-5 text-ocean-blue" />;
    }
  };

  const getReferenceLabel = (type?: string | null) => {
    switch (type) {
      case 'boat': return 'Imbarcazione';
      case 'mooring': return 'Ormeggio';
      case 'experience': return 'Esperienza';
      default: return 'Messaggio';
    }
  };

  if (selectedConversationId && user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-40">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedConversationId(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai messaggi
          </Button>
          <ChatInterface 
            conversationId={selectedConversationId} 
            currentUserId={user.id}
            onClose={() => setSelectedConversationId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messaggi</h1>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nessun messaggio</p>
              <p className="text-gray-400 text-sm mt-1">I messaggi dei tuoi clienti appariranno qui</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card 
                key={conv.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedConversationId(conv.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getReferenceIcon(conv.referenceType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">
                          {conv.referenceName || (conv.bookingId ? `Prenotazione #${conv.bookingId}` : 'Conversazione')}
                        </p>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(conv.lastMessageAt || conv.createdAt), { addSuffix: true, locale: it })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getReferenceLabel(conv.referenceType)}
                        </Badge>
                        {conv.bookingId && (
                          <Badge variant="outline" className="text-xs">
                            Prenotazione #{conv.bookingId}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
