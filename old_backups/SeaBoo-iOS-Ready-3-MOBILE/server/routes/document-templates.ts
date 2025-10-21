import { storage } from "../storage";

export async function initializeDocumentTemplates() {
  // Inizializza i template di documenti se non esistono
  const existingTemplates = await storage.getDocumentTemplates();
  
  if (existingTemplates.length === 0) {
    const templates = [
      {
        type: "nautical_license",
        name: "Patente Nautica",
        description: "Patente per la conduzione di imbarcazioni da diporto",
        requiredFields: ["documentNumber", "issueDate", "expiryDate", "issuingAuthority"],
        validationRules: {
          documentNumberPattern: "^[A-Z]{2}[0-9]{6}$",
          mustNotBeExpired: true,
          requiredCategories: ["A", "B", "C"]
        },
        country: "IT"
      },
      {
        type: "boat_registration",
        name: "Certificato di Registrazione Barca",
        description: "Documento di registrazione dell'imbarcazione",
        requiredFields: ["documentNumber", "issueDate", "issuingAuthority"],
        validationRules: {
          documentNumberPattern: "^IT[0-9]{8}$",
          mustHaveValidRegistration: true
        },
        country: "IT"
      },
      {
        type: "insurance",
        name: "Polizza Assicurativa",
        description: "Polizza assicurativa per l'imbarcazione",
        requiredFields: ["documentNumber", "issueDate", "expiryDate", "issuingAuthority"],
        validationRules: {
          mustNotBeExpired: true,
          minimumCoverage: 500000
        },
        country: "IT"
      },
      {
        type: "safety_certificate",
        name: "Certificato di Sicurezza",
        description: "Certificato di sicurezza per navigazione commerciale",
        requiredFields: ["documentNumber", "issueDate", "expiryDate", "issuingAuthority"],
        validationRules: {
          mustNotBeExpired: true,
          validForCommercialUse: true
        },
        country: "IT"
      },
      {
        type: "identity",
        name: "Documento di Identità",
        description: "Documento di identità del conducente",
        requiredFields: ["documentNumber", "issueDate", "expiryDate"],
        validationRules: {
          mustNotBeExpired: true,
          validIdTypes: ["passport", "id_card", "driving_license"]
        },
        country: "IT"
      }
    ];

    for (const template of templates) {
      await storage.createDocumentTemplate(template);
    }

    console.log("Document templates initialized successfully");
  }
}

export async function createUserDocumentRequirements(userId: number, userRole: string) {
  // Crea i requisiti documenti per un nuovo utente
  const requirements = [];
  
  if (userRole === "customer") {
    requirements.push({
      userId,
      documentType: "identity",
      isRequired: true,
      status: "missing"
    });
  }
  
  if (userRole === "owner") {
    requirements.push(
      {
        userId,
        documentType: "identity",
        isRequired: true,
        status: "missing"
      },
      {
        userId,
        documentType: "nautical_license",
        isRequired: true,
        status: "missing"
      }
    );
  }

  for (const requirement of requirements) {
    await storage.createUserDocumentRequirement(requirement);
  }

  return requirements;
}