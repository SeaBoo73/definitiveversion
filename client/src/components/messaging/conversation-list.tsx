import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const typeConfig: Record<string, { label: string; icon: JSX.Element; avatarBg: string; avatarText: string; badgeBg: string; badgeText: string; selectedBg: string; hoverBg: string }> = {
  boat: {
    label: 'Imbarcazione',
    icon: <Ship className="w-4 h-4" />,
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    selectedBg: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-50/60',
  },
  mooring: {
    label: 'Ormeggio',
    icon: <Anchor className="w-4 h-4" />,
    avatarBg: 'bg-teal-100',
    avatarText: 'text-teal-600',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-700',
    selectedBg: 'bg-teal-50',
    hoverBg: 'hover:bg-teal-50/60',
  },
  experience: {
    label: 'Esperienza',
    icon: <Compass className="w-4 h-4" />,
    avatarBg: 'bg-orange-100',
    avatarText: 'text-orange-600',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-700',
    selectedBg: 'bg-orange-50',
    hoverBg: 'hover:bg-orange-50/60',
  },
};

const defaultConfig = {
  label: 'Messaggio',
  icon: <MessageSquare className="w-4 h-4" />,
  avatarBg: 'bg-gray-100',
  avatarText: 'text-gray-600',
  badgeBg: 'bg-gray-100',
  badgeText: 'text-gray-700',
  selectedBg: 'bg-gray-50',
  hoverBg: 'hover:bg-gray-50',
};

const getConversationTitle = (conv: ConversationData) => {
  if (conv.referenceName) return conv.referenceName;
  if (conv.bookingId) return `Prenotazione #${conv.bookingId}`;
  return 'Conversazione';
};

export function ConversationList({
  onSelectConversation,
  currentUserId,
  selectedConversationId,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: conversations, isLoading } = useQuery<ConversationData[]>({
    queryKey: ['/api/user/conversations'],
    refetchInterval: 5000,
  });

  const filteredConversations =
    conversations?.filter(
      (conv) =>
        conv.referenceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.bookingId && `#${conv.bookingId}`.includes(searchTerm))
    ) || [];

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
              {filteredConversations.map((conversation) => {
                const cfg = typeConfig[conversation.referenceType || ''] || defaultConfig;
                const isSelected = selectedConversationId === conversation.id;
                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors border ${cfg.hoverBg} ${
                      isSelected
                        ? `${cfg.selectedBg} border-current/20`
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.avatarBg} ${cfg.avatarText}`}>
                        {cfg.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate">
                            {getConversationTitle(conversation)}
                          </h4>
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                              addSuffix: true,
                              locale: it,
                            })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                          {conversation.bookingId && (
                            <span className="text-xs text-muted-foreground">
                              Prenotazione #{conversation.bookingId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
