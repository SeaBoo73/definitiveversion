import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LocalFee } from "@shared/schema";
import {
  MapPin,
  AlertTriangle,
  Info,
  Euro,
  User,
  Ship,
  Anchor,
  ExternalLink,
  Phone,
  Search,
  FileText,
  Shield,
  Waves,
  ChevronDown
} from "lucide-react";

const feeTypeLabels: Record<string, { label: string; icon: any; color: string }> = {
  landing_fee: { label: "Contributo di sbarco", icon: Anchor, color: "bg-blue-100 text-blue-800" },
  amp_ticket: { label: "Ticket AMP", icon: Waves, color: "bg-teal-100 text-teal-800" },
  mooring: { label: "Ormeggio/Stazionamento", icon: Ship, color: "bg-purple-100 text-purple-800" },
  environmental: { label: "Contributo ambientale", icon: Shield, color: "bg-green-100 text-green-800" },
  other: { label: "Altro", icon: FileText, color: "bg-gray-100 text-gray-800" },
};

const obligatedPartyLabels: Record<string, string> = {
  customer: "Cliente",
  owner: "Armatore/Proprietario",
  skipper: "Skipper",
  varies: "Varia (verificare)",
};

const italianRegions = [
  "Sardegna", "Sicilia", "Campania", "Calabria", "Puglia",
  "Liguria", "Toscana", "Lazio", "Veneto", "Friuli Venezia Giulia",
  "Emilia-Romagna", "Marche", "Abruzzo", "Molise", "Basilicata"
];

export default function OneriLocali() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [searchMunicipality, setSearchMunicipality] = useState("");
  const [searchPort, setSearchPort] = useState("");
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [portOpen, setPortOpen] = useState(false);
  const [expandedFees, setExpandedFees] = useState<Set<number>>(new Set());

  const toggleFee = (feeId: number) => {
    setExpandedFees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feeId)) {
        newSet.delete(feeId);
      } else {
        newSet.add(feeId);
      }
      return newSet;
    });
  };

  // Fetch all fees to get unique municipalities and ports for autocomplete
  const { data: allFees = [] } = useQuery<LocalFee[]>({
    queryKey: ['/api/local-fees'],
  });

  // Extract unique municipalities and ports for autocomplete (filtered by selected region)
  const municipalities = useMemo(() => {
    let feesToFilter = allFees;
    if (selectedRegion && selectedRegion !== 'all') {
      feesToFilter = allFees.filter(f => f.region.toLowerCase().includes(selectedRegion.toLowerCase()));
    }
    const filtered = feesToFilter.map(f => f.municipality).filter((m): m is string => m !== null && m !== undefined);
    const uniqueMunicipalities = Array.from(new Set(filtered));
    return uniqueMunicipalities.sort();
  }, [allFees, selectedRegion]);

  const ports = useMemo(() => {
    let feesToFilter = allFees;
    if (selectedRegion && selectedRegion !== 'all') {
      feesToFilter = allFees.filter(f => f.region.toLowerCase().includes(selectedRegion.toLowerCase()));
    }
    if (searchMunicipality) {
      feesToFilter = feesToFilter.filter(f => f.municipality?.toLowerCase().includes(searchMunicipality.toLowerCase()));
    }
    const filtered = feesToFilter.map(f => f.port).filter((p): p is string => p !== null && p !== undefined);
    const uniquePorts = Array.from(new Set(filtered));
    return uniquePorts.sort();
  }, [allFees, selectedRegion, searchMunicipality]);

  const { data: fees = [], isLoading } = useQuery<LocalFee[]>({
    queryKey: ['/api/local-fees/search', selectedRegion, searchMunicipality, searchPort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedRegion && selectedRegion !== 'all') params.append('region', selectedRegion);
      if (searchMunicipality) params.append('municipality', searchMunicipality);
      if (searchPort) params.append('port', searchPort);
      
      const res = await fetch(`/api/local-fees/search?${params.toString()}`);
      return res.json();
    },
    enabled: true,
  });

  const groupedFees = fees.reduce((acc, fee) => {
    const key = fee.municipality || fee.region;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fee);
    return acc;
  }, {} as Record<string, LocalFee[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-gradient-to-r from-ocean-blue to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Oneri Locali e Adempimenti</h1>
              <p className="text-white/80 mt-1">
                Informazioni su contributi, permessi e oneri per la navigazione in Italia
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Nota informativa</AlertTitle>
          <AlertDescription className="text-amber-700">
            Le informazioni riportate in questa sezione hanno carattere esclusivamente informativo e di supporto. 
            Non sostituiscono in alcun modo gli obblighi normativi vigenti. Si consiglia di verificare sempre 
            le disposizioni ufficiali presso le autorità competenti prima della navigazione.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-ocean-blue" />
              Cerca oneri per area geografica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Regione</Label>
                <Select value={selectedRegion} onValueChange={(value) => {
                  setSelectedRegion(value);
                  setSearchMunicipality("");
                  setSearchPort("");
                }}>
                  <SelectTrigger data-testid="select-region">
                    <SelectValue placeholder="Seleziona regione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le regioni</SelectItem>
                    {italianRegions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="default"
                className="bg-teal-600 hover:bg-teal-700"
                data-testid="button-search"
              >
                Cerca
              </Button>
              {selectedRegion && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedRegion("");
                  }}
                  data-testid="button-clear-filters"
                >
                  Cancella filtri
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Anchor className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-semibold">Contributi di sbarco</p>
                  <p className="text-sm text-gray-600">Applicati da alcuni Comuni insulari</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Waves className="h-8 w-8 text-teal-500" />
                <div>
                  <p className="font-semibold">Aree Marine Protette</p>
                  <p className="text-sm text-gray-600">Permessi e ticket per AMP</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Ship className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="font-semibold">Ormeggio</p>
                  <p className="text-sm text-gray-600">Costi di stazionamento (informativi)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : fees.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedFees).map(([area, areaFees]) => (
              <div key={area}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-ocean-blue" />
                  {area}
                </h3>
                
                <div className="space-y-4">
                  {areaFees.map((fee) => {
                    const feeType = feeTypeLabels[fee.feeType] || feeTypeLabels.other;
                    const FeeIcon = feeType.icon;
                    const isExpanded = expandedFees.has(fee.id);
                    
                    return (
                      <Collapsible key={fee.id} open={isExpanded} onOpenChange={() => toggleFee(fee.id)}>
                        <Card data-testid={`card-fee-${fee.id}`} className="overflow-hidden">
                          <CollapsibleTrigger asChild>
                            <CardContent className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${feeType.color.split(' ')[0]}`}>
                                    <FeeIcon className={`h-5 w-5 ${feeType.color.split(' ')[1]}`} />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-semibold">{fee.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className={feeType.color}>{feeType.label}</Badge>
                                      {fee.amount && (
                                        <span className="text-sm text-green-600 font-medium">
                                          €{fee.amount}
                                          {fee.amountType === 'per_person' && '/pers.'}
                                          {fee.amountType === 'per_day' && '/giorno'}
                                          {fee.amountType === 'per_meter' && '/mt'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </CardContent>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <CardContent className="px-4 pb-4 pt-0 border-t bg-gray-50">
                              <p className="text-gray-700 mb-4 mt-4">{fee.description}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                {fee.amount && (
                                  <div className="flex items-center gap-2">
                                    <Euro className="h-4 w-4 text-green-600" />
                                    <div>
                                      <p className="text-gray-500">Importo</p>
                                      <p className="font-medium">
                                        €{fee.amount}
                                        {fee.amountType === 'per_person' && ' / persona'}
                                        {fee.amountType === 'per_day' && ' / giorno'}
                                        {fee.amountType === 'per_meter' && ' / metro'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-gray-500">A carico di</p>
                                    <p className="font-medium">{obligatedPartyLabels[fee.obligatedParty]}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Info className="h-4 w-4 text-amber-600" />
                                  <div>
                                    <p className="text-gray-500">Tipo</p>
                                    <p className="font-medium">
                                      {fee.isRequired ? 'Obbligatorio' : 'Informativo'}
                                    </p>
                                  </div>
                                </div>
                                
                                {fee.marineProtectedArea && (
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-teal-600" />
                                    <div>
                                      <p className="text-gray-500">AMP</p>
                                      <p className="font-medium">{fee.marineProtectedArea}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {(fee.seasonalNotes || fee.paymentMethod || fee.notes) && (
                                <div className="mt-4 p-3 bg-white rounded-lg space-y-2 text-sm border">
                                  {fee.seasonalNotes && (
                                    <p><strong>Periodo:</strong> {fee.seasonalNotes}</p>
                                  )}
                                  {fee.paymentMethod && (
                                    <p><strong>Modalità pagamento:</strong> {fee.paymentMethod}</p>
                                  )}
                                  {fee.notes && (
                                    <p><strong>Note:</strong> {fee.notes}</p>
                                  )}
                                </div>
                              )}
                              
                              <div className="mt-4 flex flex-wrap gap-3">
                                {fee.officialLink && (
                                  <a
                                    href={fee.officialLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-ocean-blue hover:underline text-sm"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Sito ufficiale
                                  </a>
                                )}
                                {fee.contactInfo && (
                                  <span className="inline-flex items-center gap-1 text-gray-600 text-sm">
                                    <Phone className="h-4 w-4" />
                                    {fee.contactInfo}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    );
                  })}
                </div>
                
                <Separator className="my-6" />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedRegion || searchMunicipality || searchPort 
                  ? "Nessun onere trovato per quest'area"
                  : "Seleziona un'area per visualizzare gli oneri"
                }
              </h3>
              <p className="text-gray-600">
                {selectedRegion || searchMunicipality || searchPort 
                  ? "Prova a modificare i filtri di ricerca o contattaci per segnalare informazioni mancanti."
                  : "Utilizza i filtri sopra per cercare contributi, permessi e oneri nella tua zona di navigazione."
                }
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Hai informazioni da segnalare?
            </h3>
            <p className="text-blue-800 mb-4">
              SeaBoo vuole essere la piattaforma più completa per la navigazione in Italia. 
              Se conosci oneri o contributi non ancora presenti, contattaci per contribuire al database.
            </p>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-100">
              Segnala un contributo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
