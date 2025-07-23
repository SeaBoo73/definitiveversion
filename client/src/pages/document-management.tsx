import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Eye,
  AlertTriangle,
  Plus,
  History
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Document {
  id: number;
  userId: number;
  boatId?: number;
  type: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: string;
  verificationStatus?: string;
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
  documentNumber?: string;
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: number;
  rejectionReason?: string;
  notes?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

const DOCUMENT_TYPES = {
  nautical_license: "Patente Nautica",
  boat_registration: "Registrazione Barca",
  insurance: "Assicurazione",
  safety_certificate: "Certificato di Sicurezza",
  identity: "Documento di Identità"
};

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800"
};

const VERIFICATION_COLORS = {
  unverified: "bg-gray-100 text-gray-800",
  verified: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800"
};

export default function DocumentManagement() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-documents");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query per ottenere i documenti dell'utente
  const { data: userDocuments = [], isLoading: userDocsLoading } = useQuery({
    queryKey: ["/api/documents/user", "current"],
    queryFn: async () => {
      const response = await apiRequest("/api/documents/user/1"); // Replace with actual user ID
      return Array.isArray(response) ? response : [];
    }
  });

  // Query per documenti in attesa (solo admin/owner)
  const { data: pendingDocuments = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["/api/documents", "pending"],
    queryFn: async () => {
      const response = await apiRequest("/api/documents/pending");
      return Array.isArray(response) ? response : [];
    },
    enabled: activeTab === "pending"
  });

  // Query per documenti in scadenza
  const { data: expiringDocuments = [], isLoading: expiringLoading } = useQuery({
    queryKey: ["/api/documents", "expiring"],
    queryFn: async () => {
      const response = await apiRequest("/api/documents/expiring?days=30");
      return Array.isArray(response) ? response : [];
    },
    enabled: activeTab === "expiring"
  });

  // Mutation per upload documento
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData
      });
      if (!response.ok) throw new Error("Errore durante l'upload");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Documento caricato con successo" });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/user"] });
      setUploadDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Errore upload", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Mutation per verifica documento
  const verifyMutation = useMutation({
    mutationFn: async ({ documentId, status, notes }: { documentId: number, status: string, notes: string }) => {
      return apiRequest(`/api/documents/${documentId}/verify`, "POST", { status, notes });
    },
    onSuccess: () => {
      toast({ title: "Documento verificato con successo" });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      setVerifyDialogOpen(false);
      setSelectedDocument(null);
    }
  });

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const file = formData.get("document") as File;
    
    if (!file) {
      toast({ title: "Seleziona un file", variant: "destructive" });
      return;
    }

    uploadMutation.mutate(formData);
  };

  const handleVerifyDocument = (document: Document) => {
    setSelectedDocument(document);
    setVerifyDialogOpen(true);
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (!response.ok) throw new Error("Errore nel download");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({ title: "Errore nel download", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-base">{document.fileName}</CardTitle>
              <CardDescription>
                {DOCUMENT_TYPES[document.type as keyof typeof DOCUMENT_TYPES] || document.type}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={STATUS_COLORS[document.status as keyof typeof STATUS_COLORS]}>
              {document.status}
            </Badge>
            {document.verificationStatus && (
              <Badge className={VERIFICATION_COLORS[document.verificationStatus as keyof typeof VERIFICATION_COLORS]}>
                {document.verificationStatus}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Dimensione:</span>
            <span>{formatFileSize(document.fileSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Caricato:</span>
            <span>{formatDate(document.createdAt)}</span>
          </div>
          {document.expiryDate && (
            <div className="flex justify-between">
              <span>Scadenza:</span>
              <span className={new Date(document.expiryDate) < new Date() ? "text-red-600 font-medium" : ""}>
                {formatDate(document.expiryDate)}
              </span>
            </div>
          )}
          {document.documentNumber && (
            <div className="flex justify-between">
              <span>Numero:</span>
              <span>{document.documentNumber}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleDownload(document.id, document.fileName)}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          {document.status === 'pending' && (
            <Button 
              size="sm" 
              onClick={() => handleVerifyDocument(document)}
            >
              <Shield className="w-4 h-4 mr-1" />
              Verifica
            </Button>
          )}
        </div>
        
        {document.rejectionReason && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Motivo rifiuto:</strong> {document.rejectionReason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestione Documenti</h1>
          <p className="text-gray-600">Gestisci e verifica i documenti nautici</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Carica Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Carica Nuovo Documento</DialogTitle>
              <DialogDescription>
                Carica un nuovo documento per la verifica
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <Label htmlFor="type">Tipo Documento</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="document">File</Label>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  name="document" 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="documentNumber">Numero Documento (opzionale)</Label>
                <Input name="documentNumber" placeholder="es. ABC123456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Data Rilascio</Label>
                  <Input type="date" name="issueDate" />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Data Scadenza</Label>
                  <Input type="date" name="expiryDate" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="issuingAuthority">Autorità Emittente</Label>
                <Input name="issuingAuthority" placeholder="es. Capitaneria di Porto" />
              </div>
              
              <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? "Caricamento..." : "Carica Documento"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-documents">I Miei Documenti</TabsTrigger>
          <TabsTrigger value="pending">In Attesa</TabsTrigger>
          <TabsTrigger value="expiring">In Scadenza</TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userDocsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : userDocuments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nessun documento caricato</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setUploadDialogOpen(true)}
                >
                  Carica il primo documento
                </Button>
              </div>
            ) : (
              userDocuments.map((document: Document) => (
                <DocumentCard key={document.id} document={document} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : pendingDocuments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">Nessun documento in attesa di verifica</p>
              </div>
            ) : (
              pendingDocuments.map((document: Document) => (
                <DocumentCard key={document.id} document={document} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : expiringDocuments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">Nessun documento in scadenza nei prossimi 30 giorni</p>
              </div>
            ) : (
              expiringDocuments.map((document: Document) => (
                <DocumentCard key={document.id} document={document} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog per verifica documento */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifica Documento</DialogTitle>
            <DialogDescription>
              Verifica il documento: {selectedDocument?.fileName}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const status = formData.get("status") as string;
            const notes = formData.get("notes") as string;
            
            if (selectedDocument) {
              verifyMutation.mutate({
                documentId: selectedDocument.id,
                status,
                notes
              });
            }
          }} className="space-y-4">
            <div>
              <Label>Stato Verifica</Label>
              <Select name="status" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approvato</SelectItem>
                  <SelectItem value="rejected">Rifiutato</SelectItem>
                  <SelectItem value="needs_review">Richiede Revisione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Note</Label>
              <Textarea 
                name="notes" 
                placeholder="Aggiungi note sulla verifica..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? "Verificando..." : "Conferma Verifica"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setVerifyDialogOpen(false)}
              >
                Annulla
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}