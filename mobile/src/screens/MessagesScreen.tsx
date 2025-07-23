import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../services/AuthService';
import { OfflineService } from '../services/OfflineService';
import { NotificationService } from '../services/NotificationService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  boatName?: string;
  bookingId?: number;
}

export default function MessagesScreen({ navigation, route }: any) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (OfflineService.isOfflineMode()) {
        const cached = await OfflineService.getCachedMessages();
        return cached.conversations || [];
      }
      
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/conversations/user/${user?.id}`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    },
    enabled: !!user
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      
      if (OfflineService.isOfflineMode()) {
        const cached = await OfflineService.getCachedMessages();
        return cached.messages?.filter((m: Message) => m.conversationId === selectedConversation) || [];
      }
      
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/conversations/${selectedConversation}/messages`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    },
    enabled: !!selectedConversation
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedConversation) throw new Error('No conversation selected');
      
      if (OfflineService.isOfflineMode()) {
        await OfflineService.addPendingAction('message', {
          conversationId: selectedConversation,
          content,
          senderId: user?.id,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      const baseUrl = __DEV__ ? 'http://localhost:5000' : 'https://your-production-url.com';
      const response = await fetch(`${baseUrl}/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, senderId: user?.id })
      });
      if (!response.ok) throw new Error('Errore invio messaggio');
      return response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      Alert.alert('Errore', 'Impossibile inviare il messaggio');
    }
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        selectedConversation === conversation.id && styles.selectedConversation
      ]}
      onPress={() => setSelectedConversation(conversation.id)}
    >
      <View style={styles.conversationInfo}>
        <Text style={styles.participantName}>{conversation.participantName}</Text>
        {conversation.boatName && (
          <Text style={styles.boatName}>📋 {conversation.boatName}</Text>
        )}
        <Text style={styles.lastMessage} numberOfLines={2}>
          {conversation.lastMessage}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(conversation.lastMessageTime).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      {conversation.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const MessageItem = ({ message }: { message: Message }) => {
    const isOwnMessage = message.senderId === user?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.content}
        </Text>
        <Text style={styles.messageTime}>
          {new Date(message.timestamp).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
    );
  };

  if (!selectedConversation) {
    return (
      <View style={styles.container}>
        <View style={styles.conversationsHeader}>
          <Text style={styles.headerTitle}>Messaggi</Text>
          {conversations.filter(c => c.unreadCount > 0).length > 0 && (
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
              </Text>
            </View>
          )}
        </View>

        {OfflineService.isOfflineMode() && (
          <View style={styles.offlineIndicator}>
            <Icon name="cloud-off" size={16} color="#FFF" />
            <Text style={styles.offlineText}>Modalità offline - messaggi non sincronizzati</Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Caricamento conversazioni...</Text>
          </View>
        ) : conversations.length > 0 ? (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ConversationItem conversation={item} />}
            style={styles.conversationsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="message" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nessun messaggio</Text>
            <Text style={styles.emptySubtitle}>
              I tuoi messaggi con i proprietari appariranno qui
            </Text>
          </View>
        )}
      </View>
    );
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedConversation(null)}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.chatInfo}>
          <Text style={styles.chatTitle}>{selectedConv?.participantName}</Text>
          {selectedConv?.boatName && (
            <Text style={styles.chatSubtitle}>{selectedConv.boatName}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => {
            if (selectedConv?.bookingId) {
              navigation.navigate('BookingDetails', { bookingId: selectedConv.bookingId });
            }
          }}
        >
          <Icon name="info" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageItem message={item} />}
        style={styles.messagesList}
        inverted
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || sendMessageMutation.isPending) && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
        >
          <Icon 
            name={sendMessageMutation.isPending ? "hourglass-empty" : "send"} 
            size={20} 
            color="#FFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  conversationsHeader: {
    backgroundColor: '#0066CC',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  totalUnreadBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  totalUnreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offlineIndicator: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    color: '#FFF',
    fontSize: 12,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedConversation: {
    backgroundColor: '#E3F2FD',
  },
  conversationInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  boatName: {
    fontSize: 14,
    color: '#0066CC',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 10,
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatHeader: {
    backgroundColor: '#0066CC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  infoButton: {
    marginLeft: 15,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0066CC',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  ownMessageText: {
    color: '#FFF',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#0066CC',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});