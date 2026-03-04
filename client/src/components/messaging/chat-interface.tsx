import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageSquare, Ship, Anchor, Compass, X, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { apiRequest, getApiUrl } from '@/lib/queryClient';

interface MessageData {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  senderName?: string;
  senderEmail?: string;
}

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

interface ChatInterfaceProps {
  conversationId: number;
  currentUserId: number;
  onClose?: () => void;
  isOwner?: boolean;
}

export function ChatInterface({ conversationId, currentUserId, onClose, isOwner }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<MessageData[]>({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    queryFn: async () => {
      const response = await fetch(getApiUrl(`/api/conversations/${conversationId}/messages`), { credentials: 'include' });
      if (!response.ok) throw new Error('Errore nel caricamento messaggi');
      return response.json();
    },
    refetchInterval: 2000,
  });

  const { data: conversation } = useQuery<ConversationData>({
    queryKey: ['/api/conversation-detail', conversationId],
    queryFn: async () => {
      const convos = await fetch(getApiUrl('/api/user/conversations'), { credentials: 'include' });
      const list = await convos.json();
      return list.find((c: ConversationData) => c.id === conversationId);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        senderId: currentUserId,
        conversationId,
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      setSendError(null);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversationId, 'messages'] });
    },
    onError: (error: any) => {
      setSendError(error?.message || "Errore nell'invio del messaggio");
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

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
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {getReferenceIcon(conversation?.referenceType)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {conversation?.referenceName || `Conversazione #${conversationId}`}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {conversation?.referenceType && (
                  <Badge variant="secondary" className="text-xs">
                    {getReferenceLabel(conversation.referenceType)}
                  </Badge>
                )}
                {conversation?.bookingId && (
                  <Badge variant="outline" className="text-xs">
                    Prenotazione #{conversation.bookingId}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {(!messages || messages.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nessun messaggio ancora</p>
                <p className="text-sm">
                  {isOwner
                    ? 'Attendi il messaggio del cliente o scrivi per primo'
                    : 'Scrivi un messaggio per contattare il proprietario'}
                </p>
              </div>
            )}
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${message.senderId === currentUserId ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {message.senderName?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {message.senderName || 'Utente'}
                    </p>
                    <div className={`rounded-lg p-3 ${
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.createdAt), { 
                        addSuffix: true, 
                        locale: it 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          {sendError && (
            <Alert variant="destructive" className="mb-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{sendError}</AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => { setNewMessage(e.target.value); setSendError(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Scrivi un messaggio..."
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
