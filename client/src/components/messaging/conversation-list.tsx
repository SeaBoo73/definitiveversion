import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare, Ship, Anchor, Compass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

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

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
  currentUserId: number;
  selectedConversationId?: number;
}

export function ConversationList({ 
  onSelectConversation, 
  currentUserId, 
  selectedConversationId 
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: conversations, isLoading } = useQuery<ConversationData[]>({
    queryKey: ['/api/user/conversations'],
    refetchInterval: 5000,
  });

  const filteredConversations = conversations?.filter((conv) =>
    conv.referenceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.bookingId && `#${conv.bookingId}`.includes(searchTerm))
  ) || [];

  const getReferenceIcon = (type?: string | null) => {
    switch (type) {
      case 'boat': return <Ship className="w-4 h-4" />;
      case 'mooring': return <Anchor className="w-4 h-4" />;
      case 'experience': return <Compass className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
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

  const getConversationTitle = (conv: ConversationData) => {
    if (conv.referenceName) return conv.referenceName;
    if (conv.bookingId) return `Prenotazione #${conv.bookingId}`;
    return 'Conversazione';
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Messaggi</span>
          </CardTitle>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cerca conversazioni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nessuna conversazione trovata</p>
              <p className="text-sm">I messaggi saranno collegati alle tue prenotazioni e richieste</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedConversationId === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {getReferenceIcon(conversation.referenceType)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {getConversationTitle(conversation)}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastMessageAt), { 
                            addSuffix: true, 
                            locale: it 
                          })}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getReferenceLabel(conversation.referenceType)}
                        </Badge>
                        {conversation.bookingId && (
                          <Badge variant="outline" className="text-xs">
                            Prenotazione #{conversation.bookingId}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
