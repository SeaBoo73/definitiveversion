import { Router } from "express";
import { z } from "zod";
import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { storage } from "../storage";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import multer from 'multer';

// Configurazione multer per upload file
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Tipi di file consentiti
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});

// Mappa per mantenere le connessioni WebSocket attive
const activeConnections = new Map<number, WebSocket[]>();

// Schema per i messaggi WebSocket
const webSocketMessageSchema = z.object({
  type: z.enum(['message', 'typing', 'read', 'reaction', 'join_conversation', 'leave_conversation']),
  conversationId: z.number().optional(),
  messageId: z.number().optional(),
  content: z.string().optional(),
  emoji: z.string().optional(),
  userId: z.number(),
});

export function setupWebSocketServer(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('Nuova connessione WebSocket');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const parsed = webSocketMessageSchema.parse(message);

        switch (parsed.type) {
          case 'message':
            await handleNewMessage(parsed, ws);
            break;
          case 'typing':
            await handleTyping(parsed, ws);
            break;
          case 'read':
            await handleMessageRead(parsed, ws);
            break;
          case 'reaction':
            await handleReaction(parsed, ws);
            break;
          case 'join_conversation':
            await handleJoinConversation(parsed, ws);
            break;
        }
      } catch (error) {
        console.error('Errore nel gestire messaggio WebSocket:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Messaggio non valido' }));
      }
    });

    ws.on('close', () => {
      // Rimuovi connessione dalla mappa
      for (const [userId, connections] of Array.from(activeConnections.entries())) {
        const index = connections.indexOf(ws);
        if (index > -1) {
          connections.splice(index, 1);
          if (connections.length === 0) {
            activeConnections.delete(userId);
          }
          break;
        }
      }
    });
  });

  return wss;
}

async function handleNewMessage(data: any, senderWs: WebSocket) {
  if (!data.conversationId || !data.content || !data.userId) return;

  try {
    // Salva il messaggio nel database
    const message = await storage.createMessage({
      conversationId: data.conversationId,
      senderId: data.userId,
      content: data.content,
      type: 'text'
    });

    // Aggiorna timestamp ultima attività conversazione
    await storage.updateConversationLastMessage(data.conversationId);

    // Ottieni i partecipanti della conversazione
    const participants = await storage.getConversationParticipants(data.conversationId);

    // Invia messaggio a tutti i partecipanti connessi
    const messageWithSender = await storage.getMessageWithDetails(message.id);
    
    participants.forEach((participant: any) => {
      const connections = activeConnections.get(participant.userId);
      if (connections) {
        connections.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'new_message',
              message: messageWithSender
            }));
          }
        });
      }
    });

    // Crea notifiche push per utenti offline
    for (const participant of participants) {
      if (participant.userId !== data.userId) {
        await storage.createChatNotification({
          userId: participant.userId,
          type: 'message',
          title: 'Nuovo messaggio',
          message: `${messageWithSender.sender.firstName}: ${data.content.substring(0, 50)}...`,
          data: JSON.stringify({ conversationId: data.conversationId, messageId: message.id })
        });
      }
    }

  } catch (error) {
    console.error('Errore nel gestire nuovo messaggio:', error);
    senderWs.send(JSON.stringify({ type: 'error', message: 'Errore nell\'invio del messaggio' }));
  }
}

async function handleTyping(data: any, senderWs: WebSocket) {
  if (!data.conversationId || !data.userId) return;

  try {
    const participants = await storage.getConversationParticipants(data.conversationId);
    
    participants.forEach((participant: any) => {
      if (participant.userId !== data.userId) {
        const connections = activeConnections.get(participant.userId);
        if (connections) {
          connections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'typing',
                conversationId: data.conversationId,
                userId: data.userId
              }));
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Errore nel gestire typing:', error);
  }
}

async function handleMessageRead(data: any, senderWs: WebSocket) {
  if (!data.messageId || !data.userId) return;

  try {
    await storage.markMessageAsRead(data.messageId, data.userId);
    
    // Notifica il mittente che il messaggio è stato letto
    const message = await storage.getMessage(data.messageId);
    if (message) {
      const senderConnections = activeConnections.get(message.senderId);
      if (senderConnections) {
        senderConnections.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_read',
              messageId: data.messageId,
              readBy: data.userId
            }));
          }
        });
      }
    }
  } catch (error) {
    console.error('Errore nel gestire message read:', error);
  }
}

async function handleReaction(data: any, senderWs: WebSocket) {
  if (!data.messageId || !data.emoji || !data.userId) return;

  try {
    await storage.addMessageReaction({
      messageId: data.messageId,
      userId: data.userId,
      emoji: data.emoji,
      createdAt: new Date()
    } as any);

    // Notifica tutti i partecipanti della conversazione
    const message = await storage.getMessage(data.messageId);
    if (message) {
      const participants = await storage.getConversationParticipants(message.conversationId);
      
      participants.forEach((participant: any) => {
        const connections = activeConnections.get(participant.userId);
        if (connections) {
          connections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'reaction_added',
                messageId: data.messageId,
                emoji: data.emoji,
                userId: data.userId
              }));
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('Errore nel gestire reaction:', error);
  }
}

async function handleJoinConversation(data: any, ws: WebSocket) {
  if (!data.userId) return;

  // Aggiungi connessione alla mappa
  if (!activeConnections.has(data.userId)) {
    activeConnections.set(data.userId, []);
  }
  activeConnections.get(data.userId)!.push(ws);

  ws.send(JSON.stringify({ type: 'connected', userId: data.userId }));
}

export function registerMessagingRoutes(app: any) {
  const router = Router();

  // Ottieni tutte le conversazioni dell'utente
  router.get('/conversations', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const conversations = await storage.getUserConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error('Errore nel recuperare conversazioni:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Ottieni messaggi di una conversazione
  router.get('/conversations/:id/messages', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const conversationId = parseInt(req.params.id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      // Verifica che l'utente sia partecipante alla conversazione
      const isParticipant = await storage.isUserInConversation(conversationId, req.user.id);
      if (!isParticipant) {
        return res.status(403).json({ message: 'Accesso negato a questa conversazione' });
      }

      const messages = await storage.getConversationMessages(conversationId, page, limit);
      res.json(messages);
    } catch (error) {
      console.error('Errore nel recuperare messaggi:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Crea una nuova conversazione
  router.post('/conversations', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation({
        ...conversationData,
        createdBy: req.user.id
      });

      // Aggiungi partecipanti alla conversazione
      if (req.body.participants && Array.isArray(req.body.participants)) {
        for (const participantId of req.body.participants) {
          await storage.addConversationParticipant({
            conversationId: conversation.id,
            userId: participantId,
            role: 'member'
          });
        }
      }

      // Aggiungi il creatore come partecipante
      await storage.addConversationParticipant({
        conversationId: conversation.id,
        userId: req.user.id,
        role: 'owner'
      });

      res.status(201).json(conversation);
    } catch (error) {
      console.error('Errore nel creare conversazione:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Invia un messaggio (fallback HTTP per quando WebSocket non è disponibile)
  router.post('/conversations/:id/messages', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const conversationId = parseInt(req.params.id);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        conversationId,
        senderId: req.user.id
      });

      // Verifica che l'utente sia partecipante alla conversazione
      const isParticipant = await storage.isUserInConversation(conversationId, req.user.id);
      if (!isParticipant) {
        return res.status(403).json({ message: 'Accesso negato a questa conversazione' });
      }

      const message = await storage.createMessage(messageData);
      await storage.updateConversationLastMessage(conversationId);

      res.status(201).json(message);
    } catch (error) {
      console.error('Errore nel creare messaggio:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Upload allegati
  router.post('/conversations/:id/attachments', upload.single('file'), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Nessun file fornito' });
      }

      const conversationId = parseInt(req.params.id);
      
      // Verifica che l'utente sia partecipante alla conversazione
      const isParticipant = await storage.isUserInConversation(conversationId, req.user.id);
      if (!isParticipant) {
        return res.status(403).json({ message: 'Accesso negato a questa conversazione' });
      }

      // In un'implementazione reale, qui caricheresti il file su cloud storage
      const fileUrl = `/uploads/${req.file.filename}`;

      const attachment = await storage.createChatAttachment({
        messageId: parseInt(req.body.messageId),
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        uploadedBy: req.user.id
      });

      res.status(201).json(attachment);
    } catch (error) {
      console.error('Errore nell\'upload allegato:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Aggiungi partecipante a conversazione di gruppo
  router.post('/conversations/:id/participants', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const conversationId = parseInt(req.params.id);
      const { userId } = req.body;

      // Verifica che l'utente sia admin della conversazione
      const userRole = await storage.getUserRoleInConversation(conversationId, req.user.id);
      if (!userRole || (userRole !== 'admin' && userRole !== 'owner')) {
        return res.status(403).json({ message: 'Permessi insufficienti' });
      }

      await storage.addConversationParticipant({
        conversationId,
        userId,
        role: 'member'
      });

      res.status(201).json({ message: 'Partecipante aggiunto con successo' });
    } catch (error) {
      console.error('Errore nell\'aggiungere partecipante:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Ottieni notifiche non lette
  router.get('/notifications', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const notifications = await storage.getUnreadNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error('Errore nel recuperare notifiche:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  // Segna notifica come letta
  router.patch('/notifications/:id/read', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non autorizzato' });
      }

      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId, req.user.id);

      res.json({ message: 'Notifica segnata come letta' });
    } catch (error) {
      console.error('Errore nel segnare notifica come letta:', error);
      res.status(500).json({ message: 'Errore del server' });
    }
  });

  app.use('/api/messaging', router);
}