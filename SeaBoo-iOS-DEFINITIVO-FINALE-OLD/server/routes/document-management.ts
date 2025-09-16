import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "../storage";
import { insertDocumentSchema, insertDocumentVerificationSchema } from "@shared/schema";
import { eq, desc, asc, and, isNotNull, lte, gt } from "drizzle-orm";

const router = Router();

// Configurazione multer per upload documenti
const upload = multer({
  dest: 'uploads/documents/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accetta solo PDF, immagini e documenti
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo di file non supportato. Sono ammessi solo PDF, immagini e documenti Word.'));
    }
  }
});

export function registerDocumentRoutes(app: any) {
  // Upload documento
  app.post("/api/documents/upload", upload.single('document'), async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }

      const { type, boatId, documentNumber, issueDate, expiryDate, issuingAuthority } = req.body;

      // Validazione tipo documento
      const validTypes = ['nautical_license', 'boat_registration', 'insurance', 'safety_certificate', 'identity'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: "Tipo di documento non valido" });
      }

      // Crea il documento nel database
      const documentData = {
        userId: req.user.id,
        boatId: boatId ? parseInt(boatId) : undefined,
        type,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: req.user.id,
        documentNumber: documentNumber || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        issuingAuthority: issuingAuthority || undefined,
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date(),
          userAgent: req.get('User-Agent')
        }
      };

      const document = await storage.createDocument(documentData);

      // Esegui controlli automatici
      const automatedChecks = await storage.runAutomatedDocumentChecks(document.id);
      
      if (automatedChecks && automatedChecks.passed) {
        // Se i controlli automatici passano, approva automaticamente alcuni tipi
        if (type === 'identity' || type === 'insurance') {
          await storage.verifyDocument(document.id, req.user.id, {
            status: 'approved',
            notes: 'Approvato automaticamente dopo controlli AI',
            automatedChecks: automatedChecks.checks,
            manualReview: false,
            confidence: automatedChecks.confidence,
            checkResults: automatedChecks
          });
        }
      }

      res.status(201).json({
        document,
        automatedChecks,
        message: "Documento caricato con successo"
      });

    } catch (error: any) {
      console.error("Errore upload documento:", error);
      res.status(500).json({ message: "Errore durante l'upload: " + error.message });
    }
  });

  // Ottieni documenti utente
  app.get("/api/documents/user/:userId", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const userId = parseInt(req.params.userId);
      const { type } = req.query;

      // Verifica autorizzazione (utente può vedere solo i propri documenti o admin/owner può vedere tutto)
      if (req.user.id !== userId && !['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const documents = await storage.getUserDocuments(userId, type);
      res.json(documents);

    } catch (error) {
      console.error("Errore get documenti utente:", error);
      res.status(500).json({ message: "Errore nel recupero documenti" });
    }
  });

  // Ottieni documenti barca
  app.get("/api/documents/boat/:boatId", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const boatId = parseInt(req.params.boatId);
      
      // Verifica che l'utente sia proprietario della barca o admin
      const boat = await storage.getBoat(boatId);
      if (!boat) {
        return res.status(404).json({ message: "Barca non trovata" });
      }

      if (boat.ownerId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const documents = await storage.getBoatDocuments(boatId);
      res.json(documents);

    } catch (error) {
      console.error("Errore get documenti barca:", error);
      res.status(500).json({ message: "Errore nel recupero documenti barca" });
    }
  });

  // Download documento
  app.get("/api/documents/:documentId/download", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Documento non trovato" });
      }

      // Verifica autorizzazione
      if (document.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      // Verifica che il file esista
      if (!fs.existsSync(document.filePath)) {
        return res.status(404).json({ message: "File non trovato sul server" });
      }

      // Imposta headers per download
      res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
      res.setHeader('Content-Type', document.mimeType);

      // Invia file
      res.sendFile(path.resolve(document.filePath));

    } catch (error) {
      console.error("Errore download documento:", error);
      res.status(500).json({ message: "Errore nel download" });
    }
  });

  // Verifica documento (solo admin/owner)
  app.post("/api/documents/:documentId/verify", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Solo admin e owner possono verificare documenti
      if (!['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato a verificare documenti" });
      }

      const documentId = parseInt(req.params.documentId);
      const { status, notes, manualReview } = req.body;

      const verificationData = {
        status,
        notes: notes || '',
        manualReview: manualReview || true,
        confidence: 100, // Verificazione manuale ha confidenza massima
        checkResults: {
          manualVerification: true,
          verifiedBy: req.user.id,
          verificationTime: new Date()
        }
      };

      const verification = await storage.verifyDocument(documentId, req.user.id, verificationData);

      res.json({
        verification,
        message: status === 'approved' ? 'Documento approvato' : 'Documento respinto'
      });

    } catch (error) {
      console.error("Errore verifica documento:", error);
      res.status(500).json({ message: "Errore nella verifica" });
    }
  });

  // Ottieni documenti in attesa di verifica (solo admin/owner)
  app.get("/api/documents/pending", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      if (!['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const pendingDocuments = await storage.getPendingDocuments();
      res.json(pendingDocuments);

    } catch (error) {
      console.error("Errore get documenti pending:", error);
      res.status(500).json({ message: "Errore nel recupero documenti in attesa" });
    }
  });

  // Ottieni documenti in scadenza
  app.get("/api/documents/expiring", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { days = 30 } = req.query;
      
      // Gli utenti possono vedere solo i propri documenti in scadenza
      const expiringDocuments = await storage.getExpiringDocuments(parseInt(days as string));
      
      // Filtra per l'utente corrente se non è admin
      const filteredDocuments = req.user.role === 'admin' 
        ? expiringDocuments 
        : expiringDocuments.filter(doc => doc.userId === req.user.id);

      res.json(filteredDocuments);

    } catch (error) {
      console.error("Errore get documenti in scadenza:", error);
      res.status(500).json({ message: "Errore nel recupero documenti in scadenza" });
    }
  });

  // Ottieni cronologia verifiche documento
  app.get("/api/documents/:documentId/verifications", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Documento non trovato" });
      }

      // Verifica autorizzazione
      if (document.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const verifications = await storage.getDocumentVerifications(documentId);
      res.json(verifications);

    } catch (error) {
      console.error("Errore get verifiche documento:", error);
      res.status(500).json({ message: "Errore nel recupero cronologia verifiche" });
    }
  });

  // Esegui controlli automatici su documento
  app.post("/api/documents/:documentId/automated-check", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Documento non trovato" });
      }

      // Verifica autorizzazione
      if (document.userId !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const checkResults = await storage.runAutomatedDocumentChecks(documentId);
      res.json(checkResults);

    } catch (error) {
      console.error("Errore controlli automatici:", error);
      res.status(500).json({ message: "Errore nei controlli automatici" });
    }
  });

  // Elimina documento
  app.delete("/api/documents/:documentId", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const documentId = parseInt(req.params.documentId);
      const document = await storage.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ message: "Documento non trovato" });
      }

      // Solo il proprietario o admin possono eliminare
      if (document.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      // Elimina file fisico
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }

      // Elimina dal database
      const deleted = await storage.deleteDocument(documentId);

      if (deleted) {
        res.json({ message: "Documento eliminato con successo" });
      } else {
        res.status(500).json({ message: "Errore nell'eliminazione" });
      }

    } catch (error) {
      console.error("Errore eliminazione documento:", error);
      res.status(500).json({ message: "Errore nell'eliminazione documento" });
    }
  });

  // Ottieni template documenti
  app.get("/api/documents/templates", async (req: any, res: any) => {
    try {
      const { type } = req.query;
      const templates = await storage.getDocumentTemplates(type);
      res.json(templates);

    } catch (error) {
      console.error("Errore get template:", error);
      res.status(500).json({ message: "Errore nel recupero template" });
    }
  });

  // Ottieni requisiti documenti utente
  app.get("/api/documents/requirements/:userId", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const userId = parseInt(req.params.userId);

      // Verifica autorizzazione
      if (req.user.id !== userId && !['admin', 'owner'].includes(req.user.role)) {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const requirements = await storage.getUserDocumentRequirements(userId);
      res.json(requirements);

    } catch (error) {
      console.error("Errore get requisiti:", error);
      res.status(500).json({ message: "Errore nel recupero requisiti" });
    }
  });

  // Ottieni audit log documento
  app.get("/api/documents/:documentId/audit", async (req: any, res: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // Solo admin può vedere audit log
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Non autorizzato" });
      }

      const documentId = parseInt(req.params.documentId);
      const auditLogs = await storage.getDocumentAuditLogs(documentId);
      res.json(auditLogs);

    } catch (error) {
      console.error("Errore get audit log:", error);
      res.status(500).json({ message: "Errore nel recupero audit log" });
    }
  });
}