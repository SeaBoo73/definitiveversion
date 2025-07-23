import { Router } from 'express';
import { db } from '../db';
import { emergencyAlerts, emergencyContacts, boatTracking, safetyProtocols, boats, users } from '@shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

const router = Router();

// GET /api/emergency/contacts - Get emergency contacts
router.get('/contacts', async (req, res) => {
  try {
    const { region } = req.query;

    let query = db.select().from(emergencyContacts).where(eq(emergencyContacts.active, true));
    
    if (region) {
      query = query.where(eq(emergencyContacts.region, region as string));
    }

    const contacts = await query.orderBy(emergencyContacts.type, emergencyContacts.name);

    // Add default Italian Coast Guard contact if not present
    const coastGuardExists = contacts.some(c => c.phone === '1530');
    if (!coastGuardExists) {
      contacts.unshift({
        id: 'coast-guard-default',
        name: 'Guardia Costiera',
        phone: '1530',
        type: 'coast_guard',
        region: 'Nazionale',
        available24h: true,
        email: null,
        website: 'https://www.guardiacostiera.gov.it',
        description: 'Numero di emergenza nazionale della Guardia Costiera italiana',
        active: true,
        createdAt: new Date()
      });
    }

    res.json(contacts);
  } catch (error) {
    console.error('Emergency contacts error:', error);
    res.status(500).json({ error: 'Errore caricamento contatti emergenza' });
  }
});

// POST /api/emergency/contacts - Create emergency contact (admin only)
router.post('/contacts', async (req, res) => {
  try {
    const { name, phone, type, region, available24h, email, website, description } = req.body;

    const [contact] = await db.insert(emergencyContacts).values({
      name,
      phone,
      type,
      region,
      available24h,
      email,
      website,
      description
    }).returning();

    res.json(contact);
  } catch (error) {
    console.error('Create emergency contact error:', error);
    res.status(500).json({ error: 'Errore creazione contatto emergenza' });
  }
});

// GET /api/emergency/alerts - Get emergency alerts
router.get('/alerts', async (req, res) => {
  try {
    const { status = 'active', userId } = req.query;

    let query = db.select({
      id: emergencyAlerts.id,
      boatId: emergencyAlerts.boatId,
      type: emergencyAlerts.type,
      severity: emergencyAlerts.severity,
      status: emergencyAlerts.status,
      title: emergencyAlerts.title,
      description: emergencyAlerts.description,
      latitude: emergencyAlerts.latitude,
      longitude: emergencyAlerts.longitude,
      contactInfo: emergencyAlerts.contactInfo,
      personsOnBoard: emergencyAlerts.personsOnBoard,
      createdAt: emergencyAlerts.createdAt,
      resolvedAt: emergencyAlerts.resolvedAt,
      userName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      boatName: boats.name
    }).from(emergencyAlerts)
      .leftJoin(users, eq(emergencyAlerts.userId, users.id))
      .leftJoin(boats, eq(emergencyAlerts.boatId, boats.id));

    if (status !== 'all') {
      query = query.where(eq(emergencyAlerts.status, status as any));
    }

    if (userId) {
      query = query.where(eq(emergencyAlerts.userId, parseInt(userId as string)));
    }

    const alerts = await query.orderBy(desc(emergencyAlerts.createdAt));

    // Transform location data
    const formattedAlerts = alerts.map(alert => ({
      ...alert,
      location: {
        lat: parseFloat(alert.latitude as string),
        lng: parseFloat(alert.longitude as string)
      },
      latitude: undefined,
      longitude: undefined
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Emergency alerts error:', error);
    res.status(500).json({ error: 'Errore caricamento allerte emergenza' });
  }
});

// POST /api/emergency/alerts - Create emergency alert
router.post('/alerts', async (req, res) => {
  try {
    const { 
      boatId, 
      type, 
      severity, 
      title, 
      description, 
      location, 
      contactInfo, 
      personsOnBoard 
    } = req.body;

    // Get user from session (if authenticated)
    const userId = req.user?.id || 1; // Default user for testing

    const [alert] = await db.insert(emergencyAlerts).values({
      boatId,
      userId,
      type,
      severity,
      title,
      description,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      contactInfo,
      personsOnBoard: personsOnBoard || 1,
      status: 'active'
    }).returning();

    // Send notifications (implement push notifications, SMS, etc.)
    await sendEmergencyNotifications(alert);

    res.json(alert);
  } catch (error) {
    console.error('Create emergency alert error:', error);
    res.status(500).json({ error: 'Errore creazione allerta emergenza' });
  }
});

// PUT /api/emergency/alerts/:id - Update emergency alert status
router.put('/alerts/:id', async (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const { status, resolvedBy } = req.body;

    const updateData: any = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = resolvedBy;
    }

    const [alert] = await db.update(emergencyAlerts)
      .set(updateData)
      .where(eq(emergencyAlerts.id, alertId))
      .returning();

    res.json(alert);
  } catch (error) {
    console.error('Update emergency alert error:', error);
    res.status(500).json({ error: 'Errore aggiornamento allerta emergenza' });
  }
});

// GET /api/emergency/boat-locations - Get boat tracking data
router.get('/boat-locations', async (req, res) => {
  try {
    const { boatId, limit = 50 } = req.query;

    let query = db.select({
      boatId: boatTracking.boatId,
      boatName: boats.name,
      latitude: boatTracking.latitude,
      longitude: boatTracking.longitude,
      speed: boatTracking.speed,
      heading: boatTracking.heading,
      status: boatTracking.status,
      lastUpdate: boatTracking.createdAt,
      batteryLevel: boatTracking.batteryLevel
    }).from(boatTracking)
      .leftJoin(boats, eq(boatTracking.boatId, boats.id));

    if (boatId) {
      query = query.where(eq(boatTracking.boatId, parseInt(boatId as string)));
    }

    // Get latest position for each boat
    const latestPositions = await query
      .orderBy(desc(boatTracking.createdAt))
      .limit(parseInt(limit as string));

    // Group by boat and get only the latest position
    const locationMap = new Map();
    latestPositions.forEach(pos => {
      if (!locationMap.has(pos.boatId)) {
        locationMap.set(pos.boatId, {
          boatId: pos.boatId,
          boatName: pos.boatName,
          location: {
            lat: parseFloat(pos.latitude as string),
            lng: parseFloat(pos.longitude as string)
          },
          speed: parseFloat(pos.speed as string),
          heading: pos.heading,
          status: pos.status,
          lastUpdate: pos.lastUpdate,
          batteryLevel: pos.batteryLevel
        });
      }
    });

    const locations = Array.from(locationMap.values());
    res.json(locations);
  } catch (error) {
    console.error('Boat locations error:', error);
    res.status(500).json({ error: 'Errore caricamento posizioni barche' });
  }
});

// POST /api/emergency/boat-locations - Update boat location
router.post('/boat-locations', async (req, res) => {
  try {
    const { 
      boatId, 
      latitude, 
      longitude, 
      speed, 
      heading, 
      altitude, 
      accuracy, 
      status, 
      batteryLevel, 
      deviceId 
    } = req.body;

    const [location] = await db.insert(boatTracking).values({
      boatId,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      speed: speed?.toString() || "0.00",
      heading: heading || 0,
      altitude: altitude?.toString(),
      accuracy: accuracy?.toString(),
      status: status || 'normal',
      batteryLevel,
      deviceId
    }).returning();

    res.json(location);
  } catch (error) {
    console.error('Update boat location error:', error);
    res.status(500).json({ error: 'Errore aggiornamento posizione barca' });
  }
});

// GET /api/emergency/protocols - Get safety protocols
router.get('/protocols', async (req, res) => {
  try {
    const { category, severity } = req.query;

    let query = db.select().from(safetyProtocols).where(eq(safetyProtocols.active, true));

    if (category) {
      query = query.where(eq(safetyProtocols.category, category as string));
    }

    if (severity) {
      query = query.where(eq(safetyProtocols.severity, severity as string));
    }

    const protocols = await query.orderBy(safetyProtocols.category, safetyProtocols.title);

    res.json(protocols);
  } catch (error) {
    console.error('Safety protocols error:', error);
    res.status(500).json({ error: 'Errore caricamento protocolli sicurezza' });
  }
});

// POST /api/emergency/protocols - Create safety protocol (admin only)
router.post('/protocols', async (req, res) => {
  try {
    const { 
      title, 
      category, 
      description, 
      steps, 
      equipmentRequired, 
      severity, 
      applicableBoatTypes 
    } = req.body;

    const [protocol] = await db.insert(safetyProtocols).values({
      title,
      category,
      description,
      steps,
      equipmentRequired,
      severity,
      applicableBoatTypes
    }).returning();

    res.json(protocol);
  } catch (error) {
    console.error('Create safety protocol error:', error);
    res.status(500).json({ error: 'Errore creazione protocollo sicurezza' });
  }
});

// Emergency notification function
async function sendEmergencyNotifications(alert: any) {
  try {
    // Implement various notification channels:
    
    // 1. WebSocket notification to connected users
    // 2. SMS to emergency contacts
    // 3. Email alerts
    // 4. Push notifications
    // 5. Integration with Coast Guard API (if available)
    
    console.log('Emergency alert created:', {
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      location: { lat: alert.latitude, lng: alert.longitude }
    });

    // Example: Send to Coast Guard API (mock implementation)
    if (alert.severity === 'critical') {
      await notifyCoastGuard(alert);
    }

    // Example: Send SMS notifications (mock implementation)
    await sendSMSNotifications(alert);

  } catch (error) {
    console.error('Emergency notification error:', error);
  }
}

async function notifyCoastGuard(alert: any) {
  // Mock implementation - in reality this would integrate with Coast Guard systems
  console.log('Notifying Coast Guard of critical emergency:', alert.id);
}

async function sendSMSNotifications(alert: any) {
  // Mock implementation - in reality this would use SMS API
  console.log('Sending SMS notifications for emergency:', alert.id);
}

// Seed default emergency contacts and protocols
router.post('/seed', async (req, res) => {
  try {
    // Seed emergency contacts
    const defaultContacts = [
      {
        name: 'Guardia Costiera',
        phone: '1530',
        type: 'coast_guard',
        region: 'Nazionale',
        available24h: true,
        description: 'Numero di emergenza nazionale'
      },
      {
        name: 'Emergenza Sanitaria',
        phone: '118',
        type: 'medical',
        region: 'Nazionale',
        available24h: true,
        description: 'Pronto soccorso medico'
      },
      {
        name: 'Capitaneria di Porto Roma',
        phone: '+39 06 58241',
        type: 'coast_guard',
        region: 'Lazio',
        available24h: true,
        email: 'cp-roma@mit.gov.it'
      },
      {
        name: 'Rimorchio Nautico Lazio',
        phone: '+39 335 1234567',
        type: 'towing',
        region: 'Lazio',
        available24h: false,
        description: 'Servizio rimorchio imbarcazioni'
      }
    ];

    await db.insert(emergencyContacts).values(defaultContacts);

    // Seed safety protocols
    const defaultProtocols = [
      {
        title: 'Procedura Emergenza Medica',
        category: 'emergency',
        description: 'Protocollo per emergenze mediche a bordo',
        steps: [
          'Valutare le condizioni del paziente',
          'Chiamare immediatamente il 118 e la Guardia Costiera (1530)',
          'Comunicare posizione GPS precisa',
          'Fornire primi soccorsi se competenti',
          'Preparare sbarco di emergenza',
          'Mantenere comunicazione radio attiva'
        ],
        equipmentRequired: ['Kit primo soccorso', 'Radio VHF', 'GPS', 'Giubbotti salvagente'],
        severity: 'critical'
      },
      {
        title: 'Avaria Motore',
        category: 'mechanical',
        description: 'Procedura per avarie meccaniche',
        steps: [
          'Spegnere immediatamente il motore',
          'Verificare presenza di fumo o perdite',
          'Comunicare posizione via radio',
          'Utilizzare ancora galleggiante se necessario',
          'Valutare necessità assistenza',
          'Preparare segnalazioni di emergenza'
        ],
        equipmentRequired: ['Ancora galleggiante', 'Radio VHF', 'Razzi segnalazione', 'Kit attrezzi'],
        severity: 'medium'
      }
    ];

    await db.insert(safetyProtocols).values(defaultProtocols);

    res.json({ message: 'Dati emergenza inizializzati con successo' });
  } catch (error) {
    console.error('Seed emergency data error:', error);
    res.status(500).json({ error: 'Errore inizializzazione dati emergenza' });
  }
});

export default router;