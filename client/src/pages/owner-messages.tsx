import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Ship, Anchor, Compass, ArrowLeft, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/messaging/chat-interface";
import { formatDistanceToNow, format } from "date-fns";
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
  customerName?: string | null;
  customerEmail?: string | null;
  bookingStartDate?: string | null;
  bookingEndDate?: string | null;
  bookingStatus?: string | null;
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

  const getBookingStatusLabel = (status?: string | null) => {
    switch (status) {
      case 'pending': return 'In attesa';
      case 'confirmed': return 'Confermata';
      case 'cancelled': return 'Annullata';
      case 'completed': return 'Completata';
      default: return null;
    }
  };

  const getBookingStatusColor = (status?: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return '';
    }
  };

  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

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

          {selectedConversation && (
            <div className="mb-4 bg-white rounded-xl border p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-ocean-blue flex-shrink-0" />
                <span className="font-medium">Cliente:</span>
                <span>{selectedConversation.customerName || selectedConversation.customerEmail || `#${selectedConversation.customerId}`}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {getReferenceIcon(selectedConversation.referenceType)}
                <span className="font-medium">{getReferenceLabel(selectedConversation.referenceType)}:</span>
                <span>{selectedConversation.referenceName || '—'}</span>
              </div>
              {selectedConversation.bookingStartDate && selectedConversation.bookingEndDate && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-ocean-blue flex-shrink-0" />
                  <span className="font-medium">Periodo:</span>
                  <span>
                    {format(new Date(selectedConversation.bookingStartDate), 'd MMM yyyy', { locale: it })}
                    {' — '}
                    {format(new Date(selectedConversation.bookingEndDate), 'd MMM yyyy', { locale: it })}
                  </span>
                  {selectedConversation.bookingStatus && (
                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-medium ${getBookingStatusColor(selectedConversation.bookingStatus)}`}>
                      {getBookingStatusLabel(selectedConversation.bookingStatus)}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Richiesta inviata:</span>
                <span>{formatDistanceToNow(new Date(selectedConversation.createdAt), { addSuffix: true, locale: it })}</span>
              </div>
            </div>
          )}

          <ChatInterface
            conversationId={selectedConversationId}
            currentUserId={user.id}
            onClose={() => setSelectedConversationId(null)}
            isOwner={true}
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
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {getReferenceIcon(conv.referenceType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">
                            {conv.customerName || conv.customerEmail || `Cliente #${conv.customerId}`}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.referenceName || (conv.bookingId ? `Prenotazione #${conv.bookingId}` : 'Conversazione')}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDistanceToNow(new Date(conv.lastMessageAt || conv.createdAt), { addSuffix: true, locale: it })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {getReferenceLabel(conv.referenceType)}
                        </Badge>
                        {conv.bookingId && (
                          <Badge variant="outline" className="text-xs">
                            Prenotazione #{conv.bookingId}
                          </Badge>
                        )}
                        {conv.bookingStartDate && conv.bookingEndDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(conv.bookingStartDate), 'd MMM', { locale: it })}
                            {' – '}
                            {format(new Date(conv.bookingEndDate), 'd MMM yyyy', { locale: it })}
                          </span>
                        )}
                        {conv.bookingStatus && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBookingStatusColor(conv.bookingStatus)}`}>
                            {getBookingStatusLabel(conv.bookingStatus)}
                          </span>
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
