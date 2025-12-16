import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBoatSchema, insertMooringDbSchema, Boat, Booking, Mooring, Experience, insertExperienceSchema } from "@shared/schema";
import { validateManufacturer, findSimilarManufacturers, getManufacturersByCategory } from "@shared/boat-manufacturers";
import { getAllPorts } from "@shared/ports-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, isAfter, getDay } from "date-fns";
import { it } from "date-fns/locale";
import { ChatButton } from "@/components/chat-button";
import {
  Plus,
  Ship,
  Calendar,
  CalendarDays,
  Euro,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Anchor,
  Waves,
  Settings,
  FileText,
  Info,
  Gauge,
  Ruler,
  Calendar as CalendarIcon,
  DollarSign,
  Sparkles,
  Sunset,
  Fish,
  Heart,
  Wine,
  ChefHat,
  Sailboat,
  User,
  Mail,
  Phone,
  Save,
  CreditCard,
  Shield,
  Key,
  AlertTriangle,
  Pencil,
  ChevronLeft,
  ChevronRight,
  EyeOff
} from "lucide-react";

const boatFormSchema = insertBoatSchema.omit({ hostId: true }).extend({
  pricePerDay: z.string().min(1, "Prezzo richiesto"),
  maxPersons: z.string().min(1, "Numero massimo persone richiesto"),
  length: z.string().optional(),
  year: z.string().optional(),
  manufacturer: z.string().optional().refine((val) => {
    if (!val || !val.trim()) return true; // Optional field
    return validateManufacturer(val.trim());
  }, "Cantiere/Marca non riconosciuto. Inserisci un cantiere nautico valido."),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict", "super_strict"]).optional().default("moderate"),
  refundMethod: z.enum(["credit_card", "bank_transfer", "paypal", "seaboo_credit"]).optional().default("credit_card"),
  coverImage: z.number().optional().default(0),
});

type BoatFormData = z.infer<typeof boatFormSchema>;

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, navigate] = useLocation();
  const [showAddBoatModal, setShowAddBoatModal] = useState(false);
  const [showAddMooringModal, setShowAddMooringModal] = useState(false);
  const [editingMooring, setEditingMooring] = useState<Mooring | null>(null);
  const [showMooringCalendarModal, setShowMooringCalendarModal] = useState(false);
  const [selectedMooringForCalendar, setSelectedMooringForCalendar] = useState<Mooring | null>(null);
  const [mooringRangeStart, setMooringRangeStart] = useState<Date | null>(null);
  const [mooringRangeEnd, setMooringRangeEnd] = useState<Date | null>(null);
  const [mooringHoveredDate, setMooringHoveredDate] = useState<Date | null>(null);
  const [mooringCalendarMonth, setMooringCalendarMonth] = useState(new Date());
  const [mooringPriceOverride, setMooringPriceOverride] = useState("");
  const [mooringBlockStatus, setMooringBlockStatus] = useState<'blocked' | 'available'>('blocked');
  const [mooringBlockedDates, setMooringBlockedDates] = useState<Date[]>([]);
  const [mooringCustomPrices, setMooringCustomPrices] = useState<Record<string, number>>({});
  const [editingBoat, setEditingBoat] = useState<Boat | null>(null);
  
  // Security dialogs state
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  // Mooring port autofill state
  const [mooringPortSearch, setMooringPortSearch] = useState("");
  const [showMooringPortSuggestions, setShowMooringPortSuggestions] = useState(false);
  const mooringPortInputRef = useRef<HTMLInputElement>(null);
  const mooringPortSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Experience location autofill state
  const [experienceLocationSearch, setExperienceLocationSearch] = useState("");
  const [showExperienceLocationSuggestions, setShowExperienceLocationSuggestions] = useState(false);
  const experienceLocationInputRef = useRef<HTMLInputElement>(null);
  const experienceLocationSuggestionsRef = useRef<HTMLDivElement>(null);
  
  // Lista completa dei porti Lazio e Campania
  const allMooringPorts = [
    // Lazio
    { name: "Civitavecchia", region: "Lazio" },
    { name: "Fiumicino", region: "Lazio" },
    { name: "Ostia", region: "Lazio" },
    { name: "Anzio", region: "Lazio" },
    { name: "Nettuno", region: "Lazio" },
    { name: "San Felice Circeo", region: "Lazio" },
    { name: "Terracina", region: "Lazio" },
    { name: "Sperlonga", region: "Lazio" },
    { name: "Gaeta", region: "Lazio" },
    { name: "Formia", region: "Lazio" },
    { name: "Minturno", region: "Lazio" },
    { name: "Santa Marinella", region: "Lazio" },
    { name: "Ladispoli", region: "Lazio" },
    { name: "Riva di Traiano", region: "Lazio" },
    { name: "Ponza", region: "Lazio" },
    { name: "Ventotene", region: "Lazio" },
    // Campania
    { name: "Napoli", region: "Campania" },
    { name: "Pozzuoli", region: "Campania" },
    { name: "Baia", region: "Campania" },
    { name: "Bacoli", region: "Campania" },
    { name: "Ischia", region: "Campania" },
    { name: "Procida", region: "Campania" },
    { name: "Capri - Marina Grande", region: "Campania" },
    { name: "Sorrento", region: "Campania" },
    { name: "Positano", region: "Campania" },
    { name: "Amalfi", region: "Campania" },
    { name: "Salerno", region: "Campania" },
    { name: "Torre del Greco", region: "Campania" },
    { name: "Torre Annunziata", region: "Campania" },
    { name: "Castellammare di Stabia", region: "Campania" },
    { name: "Marina di Stabia", region: "Campania" },
    { name: "Piano di Sorrento", region: "Campania" },
    { name: "Vico Equense", region: "Campania" },
    { name: "Massa Lubrense", region: "Campania" },
    { name: "Cetara", region: "Campania" },
    { name: "Maiori", region: "Campania" },
    { name: "Minori", region: "Campania" },
    { name: "Atrani", region: "Campania" },
    { name: "Agropoli", region: "Campania" },
    { name: "Palinuro", region: "Campania" },
    { name: "Marina di Camerota", region: "Campania" },
    { name: "Sapri", region: "Campania" },
    { name: "Acciaroli", region: "Campania" },
    { name: "Santa Maria di Castellabate", region: "Campania" },
  ];
  
  const filteredMooringPorts = mooringPortSearch.trim().length > 0 
    ? allMooringPorts.filter(port => 
        port.name.toLowerCase().includes(mooringPortSearch.toLowerCase())
      ).slice(0, 8)
    : [];
  
  const filteredExperienceLocations = experienceLocationSearch.trim().length > 0 
    ? allMooringPorts.filter(port => 
        port.name.toLowerCase().includes(experienceLocationSearch.toLowerCase())
      ).slice(0, 8)
    : [];
  
  // Chiudi suggerimenti quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mooringPortSuggestionsRef.current && !mooringPortSuggestionsRef.current.contains(event.target as Node) &&
          mooringPortInputRef.current && !mooringPortInputRef.current.contains(event.target as Node)) {
        setShowMooringPortSuggestions(false);
      }
      if (experienceLocationSuggestionsRef.current && !experienceLocationSuggestionsRef.current.contains(event.target as Node) &&
          experienceLocationInputRef.current && !experienceLocationInputRef.current.contains(event.target as Node)) {
        setShowExperienceLocationSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Get tab from URL parameter and manage active tab
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  const initialTab = tabFromUrl || 'boats';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fetch owner's boats - let the backend handle authorization
  const { data: boatsData, isLoading: boatsLoading, error: boatsQueryError } = useQuery<{ boats: Boat[] }>({
    queryKey: ["/api/owner/boats"],
    enabled: !!user,
    retry: false, // Don't retry if unauthorized
  });
  const boats = boatsData?.boats || [];

  // Fetch owner's bookings - let the backend handle authorization
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery<{ bookings: Booking[] }>({
    queryKey: ["/api/owner/bookings"],
    enabled: !!user,
    retry: false, // Don't retry if unauthorized
  });
  const bookings = bookingsData?.bookings || [];

  // Fetch owner's moorings
  const { data: mooringsData, isLoading: mooringsLoading } = useQuery<{ moorings: Mooring[] }>({
    queryKey: ["/api/owner/moorings"],
    enabled: !!user,
    retry: false,
  });
  const moorings = mooringsData?.moorings || [];

  // Mooring form state
  const [mooringFormData, setMooringFormData] = useState({
    name: "",
    port: "",
    location: "",
    type: "pontile",
    maxLength: "",
    maxBeam: "",
    depth: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    services: {
      security: false,
      water: false,
      electricity: false,
      fuel: false,
      wifi: false,
      parking: false,
      shower: false,
      restaurant: false,
    },
  });

  const resetMooringForm = () => {
    setMooringFormData({
      name: "",
      port: "",
      location: "",
      type: "pontile",
      maxLength: "",
      maxBeam: "",
      depth: "",
      pricePerDay: "",
      pricePerWeek: "",
      pricePerMonth: "",
      services: {
        security: false,
        water: false,
        electricity: false,
        fuel: false,
        wifi: false,
        parking: false,
        shower: false,
        restaurant: false,
      },
    });
    setMooringPortSearch("");
  };

  const form = useForm<BoatFormData>({
    resolver: zodResolver(boatFormSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      type: "gommone",
      year: "",
      maxPersons: "",
      length: "",
      motorization: "",
      licenseRequired: false,
      skipperRequired: false,
      location: "",
      latitude: "",
      longitude: "",
      pricePerDay: "",
      description: "",
      images: [],
      coverImage: 0,
      documentsRequired: "",
      active: true,
      cancellationPolicy: "moderate",
      refundMethod: "credit_card",
    },
  });

  const createBoatMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/boats", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/boats"] });
      setShowAddBoatModal(false);
      setEditingBoat(null);
      form.reset();
      setActiveTab("boats"); // Switch to boats tab to show the new boat
      toast({
        title: "Imbarcazione aggiunta",
        description: "La tua imbarcazione è stata aggiunta con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBoatMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Boat> }) => {
      const res = await apiRequest("PUT", `/api/boats/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/boats"] });
      setEditingBoat(null);
      toast({
        title: "Imbarcazione aggiornata",
        description: "Le modifiche sono state salvate",
      });
    },
  });

  const deleteBoatMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/boats/${id}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Errore nell'eliminazione della barca");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/boats"] });
      toast({
        title: "Imbarcazione eliminata",
        description: "L'imbarcazione è stata rimossa",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Impossibile eliminare",
        description: error.message || "Errore nell'eliminazione della barca",
        variant: "destructive",
      });
    },
  });

  // Mooring mutations
  const createMooringMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/owner/moorings", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/moorings"] });
      setShowAddMooringModal(false);
      resetMooringForm();
      toast({
        title: "Ormeggio aggiunto",
        description: "Il tuo ormeggio è stato pubblicato con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione dell'ormeggio",
        variant: "destructive",
      });
    },
  });

  const updateMooringMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/owner/moorings/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/moorings"] });
      setShowAddMooringModal(false);
      setEditingMooring(null);
      resetMooringForm();
      toast({
        title: "Ormeggio aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento dell'ormeggio",
        variant: "destructive",
      });
    },
  });

  const deleteMooringMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/owner/moorings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/moorings"] });
      toast({
        title: "Ormeggio eliminato",
        description: "L'ormeggio è stato rimosso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'eliminazione dell'ormeggio",
        variant: "destructive",
      });
    },
  });

  // Experiences query
  const { data: experiencesData, isLoading: experiencesLoading } = useQuery<Experience[]>({
    queryKey: ["/api/owner/experiences"],
    enabled: !!user,
    retry: false,
  });
  const experiencesList = experiencesData || [];

  // Experiences state
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [experienceImages, setExperienceImages] = useState<string[]>([]);
  const [experienceCoverIndex, setExperienceCoverIndex] = useState(0);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showExperienceCalendarModal, setShowExperienceCalendarModal] = useState(false);
  const [selectedExperienceForCalendar, setSelectedExperienceForCalendar] = useState<Experience | null>(null);
  const [experienceCalendarMonth, setExperienceCalendarMonth] = useState(new Date());
  const [experienceRangeStart, setExperienceRangeStart] = useState<Date | null>(null);
  const [experienceRangeEnd, setExperienceRangeEnd] = useState<Date | null>(null);
  const [experienceHoveredDate, setExperienceHoveredDate] = useState<Date | null>(null);
  const [experienceBlockedDates, setExperienceBlockedDates] = useState<Date[]>([]);
  const [experienceBlockStatus, setExperienceBlockStatus] = useState<'blocked' | 'available'>('blocked');
  const [experienceFormData, setExperienceFormData] = useState({
    name: "",
    category: "tour" as "sunset" | "fishing" | "diving" | "aperitivo" | "tour" | "sport" | "romantic",
    description: "",
    duration: "",
    maxParticipants: "",
    pricePerPerson: "",
    location: "",
    includes: "",
    requirements: "",
  });

  const resetExperienceForm = () => {
    setExperienceFormData({
      name: "",
      category: "tour",
      description: "",
      duration: "",
      maxParticipants: "",
      pricePerPerson: "",
      location: "",
      includes: "",
      requirements: "",
    });
    setExperienceImages([]);
    setExperienceLocationSearch("");
    setEditingExperience(null);
    setExperienceCoverIndex(0);
  };

  // Experience mutations
  const createExperienceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/owner/experiences", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/experiences"] });
      setShowAddExperienceModal(false);
      resetExperienceForm();
      toast({
        title: "Esperienza creata",
        description: "La tua esperienza è stata pubblicata con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione dell'esperienza",
        variant: "destructive",
      });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/owner/experiences/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/experiences"] });
      setShowAddExperienceModal(false);
      resetExperienceForm();
      toast({
        title: "Esperienza aggiornata",
        description: "Le modifiche sono state salvate con successo",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento dell'esperienza",
        variant: "destructive",
      });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/owner/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/owner/experiences"] });
      toast({
        title: "Esperienza eliminata",
        description: "L'esperienza è stata rimossa",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'eliminazione dell'esperienza",
        variant: "destructive",
      });
    },
  });

  const handleExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!experienceFormData.name.trim()) {
      toast({ title: "Errore", description: "Nome esperienza richiesto", variant: "destructive" });
      return;
    }
    if (!experienceFormData.description.trim() || experienceFormData.description.length < 10) {
      toast({ title: "Errore", description: "Descrizione richiesta (min 10 caratteri)", variant: "destructive" });
      return;
    }
    if (!experienceFormData.duration || parseInt(experienceFormData.duration) <= 0) {
      toast({ title: "Errore", description: "Durata richiesta", variant: "destructive" });
      return;
    }
    if (!experienceFormData.maxParticipants || parseInt(experienceFormData.maxParticipants) <= 0) {
      toast({ title: "Errore", description: "Numero partecipanti richiesto", variant: "destructive" });
      return;
    }
    if (!experienceFormData.pricePerPerson || parseFloat(experienceFormData.pricePerPerson) <= 0) {
      toast({ title: "Errore", description: "Prezzo richiesto", variant: "destructive" });
      return;
    }
    if (!experienceFormData.location.trim()) {
      toast({ title: "Errore", description: "Località richiesta", variant: "destructive" });
      return;
    }
    if (experienceImages.length < 3) {
      toast({ title: "Errore", description: "Carica almeno 3 foto dell'esperienza", variant: "destructive" });
      return;
    }

    // Riordina le immagini mettendo la copertina al primo posto
    const reorderedImages = [...experienceImages];
    if (experienceCoverIndex > 0 && experienceCoverIndex < reorderedImages.length) {
      const coverImage = reorderedImages.splice(experienceCoverIndex, 1)[0];
      reorderedImages.unshift(coverImage);
    }

    const dataToSubmit = {
      name: experienceFormData.name.trim(),
      category: experienceFormData.category,
      description: experienceFormData.description.trim(),
      duration: parseInt(experienceFormData.duration),
      maxParticipants: parseInt(experienceFormData.maxParticipants),
      pricePerPerson: experienceFormData.pricePerPerson,
      location: experienceFormData.location.trim(),
      includes: experienceFormData.includes ? experienceFormData.includes.split('\n').filter(s => s.trim()) : [],
      requirements: experienceFormData.requirements.trim() || null,
      images: reorderedImages,
    };

    if (editingExperience) {
      updateExperienceMutation.mutate({ id: editingExperience.id, data: dataToSubmit });
    } else {
      createExperienceMutation.mutate(dataToSubmit);
    }
  };

  const openEditMooringModal = (mooring: Mooring) => {
    setEditingMooring(mooring);
    setMooringFormData({
      name: mooring.name,
      port: mooring.port,
      location: mooring.location || "",
      type: mooring.type || "pontile",
      maxLength: mooring.maxLength?.toString() || "",
      maxBeam: mooring.maxBeam?.toString() || "",
      depth: mooring.depth?.toString() || "",
      pricePerDay: mooring.pricePerDay?.toString() || "",
      pricePerWeek: mooring.pricePerWeek?.toString() || "",
      pricePerMonth: mooring.pricePerMonth?.toString() || "",
      services: (mooring.services as any) || {
        security: false,
        water: false,
        electricity: false,
        fuel: false,
        wifi: false,
        parking: false,
        shower: false,
        restaurant: false,
      },
    });
    setMooringPortSearch(mooring.port);
    setShowAddMooringModal(true);
  };

  const handleMooringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mooringFormData.name.trim()) {
      toast({ title: "Errore", description: "Nome ormeggio richiesto", variant: "destructive" });
      return;
    }
    if (!mooringPortSearch.trim()) {
      toast({ title: "Errore", description: "Porto richiesto", variant: "destructive" });
      return;
    }
    if (!mooringFormData.location.trim()) {
      toast({ title: "Errore", description: "Posizione richiesta", variant: "destructive" });
      return;
    }
    if (!mooringFormData.maxLength || parseFloat(mooringFormData.maxLength) <= 0) {
      toast({ title: "Errore", description: "Lunghezza massima richiesta", variant: "destructive" });
      return;
    }
    if (!mooringFormData.pricePerDay || parseFloat(mooringFormData.pricePerDay) <= 0) {
      toast({ title: "Errore", description: "Prezzo giornaliero richiesto", variant: "destructive" });
      return;
    }

    const dataToSubmit = {
      name: mooringFormData.name.trim(),
      port: mooringPortSearch.trim(),
      location: mooringFormData.location.trim(),
      type: mooringFormData.type || "ormeggio",
      maxLength: parseFloat(mooringFormData.maxLength),
      maxBeam: mooringFormData.maxBeam ? parseFloat(mooringFormData.maxBeam) : null,
      depth: mooringFormData.depth ? parseFloat(mooringFormData.depth) : null,
      pricePerDay: parseFloat(mooringFormData.pricePerDay),
      pricePerWeek: mooringFormData.pricePerWeek ? parseFloat(mooringFormData.pricePerWeek) : null,
      pricePerMonth: mooringFormData.pricePerMonth ? parseFloat(mooringFormData.pricePerMonth) : null,
      services: mooringFormData.services,
    };

    if (editingMooring) {
      updateMooringMutation.mutate({ id: editingMooring.id, data: dataToSubmit });
    } else {
      createMooringMutation.mutate(dataToSubmit);
    }
  };

  const onSubmit = (data: BoatFormData) => {
    console.log("Form validation passed! Submitting data:", data);
    console.log("Form errors (should be empty):", form.formState.errors);
    
    const processedData = {
      ...data,
      hostId: Number(user?.id) || 0,
      pricePerDay: data.pricePerDay,
      maxPersons: parseInt(data.maxPersons),
      length: data.length ? data.length : undefined,
      year: data.year ? parseInt(data.year) : undefined,
      cancellationPolicy: data.cancellationPolicy,
      refundMethod: data.refundMethod,
      coverImage: data.coverImage || 0,
    };
    
    if (editingBoat) {
      updateBoatMutation.mutate({ id: editingBoat.id, data: processedData as any });
    } else {
      createBoatMutation.mutate(processedData as any);
    }
  };

  // Security Account Handlers
  const handleChangePassword = () => {
    setShowChangePasswordDialog(true);
  };

  const handleSubmitPasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Errore",
        description: "Le nuove password non coincidono",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Errore",
        description: "La password deve avere almeno 6 caratteri",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await apiRequest('POST', '/api/user/change-password', {
        currentPassword,
        newPassword,
      });
      if (response.ok) {
        toast({
          title: "Password aggiornata",
          description: "La tua password è stata cambiata con successo",
        });
        setShowChangePasswordDialog(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const data = await response.json();
        toast({
          title: "Errore",
          description: data.error || "Impossibile cambiare la password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    }
  };

  const handleManageNotifications = () => {
    setShowNotificationsDialog(true);
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferenze salvate",
      description: "Le tue preferenze di notifica sono state aggiornate.",
    });
    setShowNotificationsDialog(false);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/user/delete-account");
    },
    onSuccess: () => {
      toast({
        title: "Account eliminato",
        description: "Il tuo account è stato eliminato con successo",
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Impossibile eliminare l'account",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  // Fetch full user profile from database
  const { data: fullProfile } = useQuery<{
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    profileImage: string | null;
    bio: string | null;
  }>({
    queryKey: ["/api/user/profile"],
    enabled: !!user,
  });

  // Profile state management - initialize from fetched profile
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  // Update profileData when fullProfile loads
  useEffect(() => {
    if (fullProfile) {
      setProfileData({
        firstName: fullProfile.firstName || "",
        lastName: fullProfile.lastName || "",
        email: fullProfile.email || "",
        phone: fullProfile.phone || "",
        bio: fullProfile.bio || "",
      });
      setProfilePhoto(fullProfile.profileImage || null);
    }
  }, [fullProfile]);

  // Profile photo state - initialize from user data
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Profile Photo Upload Handler
  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast({
          title: "Formato non supportato",
          description: "Carica solo file JPG o PNG",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File troppo grande",
          description: "La foto deve essere massimo 5MB",
          variant: "destructive",
        });
        return;
      }

      // Read file and create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setProfilePhoto(dataUrl);
        
        toast({
          title: "Foto caricata",
          description: `${file.name} è stata caricata con successo`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; phone?: string; profileImage?: string | null; bio?: string }) => {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Profilo aggiornato",
        description: "Le tue informazioni sono state salvate con successo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiornare il profilo",
        variant: "destructive",
      });
    },
  });

  // Save profile changes
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phone: profileData.phone,
      profileImage: profilePhoto,
      bio: profileData.bio,
    });
  };

  const openEditModal = (boat: Boat) => {
    setEditingBoat(boat);
    form.reset({
      ...boat,
      pricePerDay: boat.pricePerDay.toString(),
      maxPersons: boat.maxPersons.toString(),
      length: boat.length?.toString() || "",
      year: boat.year?.toString() || "",
      cancellationPolicy: boat.cancellationPolicy || "moderate",
      refundMethod: boat.refundMethod || "credit_card",
      coverImage: boat.coverImage || 0,
    });
    setShowAddBoatModal(true);
  };

  const getBookingStatusBadge = (status: string, endDate?: Date | string) => {
    const now = new Date();
    const bookingEndDate = endDate ? new Date(endDate) : null;
    const isPastBooking = bookingEndDate && bookingEndDate < now;
    
    if (isPastBooking && (status === "pending" || status === "confirmed")) {
      return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Scaduta</Badge>;
    }
    
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confermata</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />In attesa</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancellata</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completata</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate statistics
  const totalEarnings = bookings
    .filter(b => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + (Number(b.totalPrice) - Number(b.commission || 0)), 0);

  const monthlyBookings = bookings.filter(b => {
    const bookingDate = new Date(b.createdAt!);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate average rating from boats
  const boatsWithRating = boats.filter(b => b.rating && Number(b.rating) > 0);
  const averageRating = boatsWithRating.length > 0 
    ? boatsWithRating.reduce((sum, b) => sum + Number(b.rating || 0), 0) / boatsWithRating.length 
    : 0;

  // Calculate confirmation rate (confirmed / total non-cancelled)
  const totalBookingsForRate = bookings.filter(b => b.status !== "cancelled").length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed" || b.status === "completed").length;
  const confirmationRate = totalBookingsForRate > 0 
    ? Math.round((confirmedBookings / totalBookingsForRate) * 100) 
    : 0;

  // Calculate occupancy rate (days booked / total available days in last 30 days)
  const last30Days = 30;
  const bookedDays = bookings
    .filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
  const totalAvailableDays = boats.length * last30Days;
  const occupancyRate = totalAvailableDays > 0 
    ? Math.min(100, Math.round((bookedDays / totalAvailableDays) * 100))
    : 0;

  // Calculate months active from user creation date
  const monthsActive = user?.createdAt 
    ? Math.max(1, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 1;

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso negato</h1>
          <p className="text-gray-600 mt-2">Devi effettuare l'accesso per accedere a questa pagina.</p>
          <Button onClick={() => navigate("/auth")} className="mt-4">
            Vai al login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if boats query failed (means user is not an owner)
  if (boatsQueryError && !boatsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accesso negato</h1>
          <p className="text-gray-600 mt-2">Devi essere un proprietario per accedere a questa pagina.</p>
          <Button onClick={() => navigate("/diventa-noleggiatore")} className="mt-4">
            Diventa Sea Host
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla home
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Sea Host</h1>
          <p className="text-gray-600 mt-2">Gestisci le tue imbarcazioni e prenotazioni</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Ship className="h-8 w-8 text-ocean-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imbarcazioni</p>
                  <p className="text-2xl font-bold text-gray-900">{boats.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-coral" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Esperienze</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-seafoam" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prenotazioni (mese)</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Guadagni totali</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valutazione media</p>
                  <p className="text-2xl font-bold text-gray-900">{averageRating > 0 ? averageRating.toFixed(1) : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            <TabsList className="inline-flex w-max min-w-full md:w-full">
              <TabsTrigger value="boats" className="whitespace-nowrap">Le mie imbarcazioni</TabsTrigger>
              <TabsTrigger value="moorings" className="whitespace-nowrap">I miei ormeggi</TabsTrigger>
              <TabsTrigger value="experiences" className="whitespace-nowrap">Le mie esperienze</TabsTrigger>
              <TabsTrigger value="bookings" className="whitespace-nowrap">Prenotazioni</TabsTrigger>
              <TabsTrigger value="messages" className="whitespace-nowrap">Messaggi</TabsTrigger>
              <TabsTrigger value="profile" className="whitespace-nowrap">Il mio profilo</TabsTrigger>
              <TabsTrigger value="analytics" className="whitespace-nowrap">Statistiche</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="boats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Le mie imbarcazioni</h2>
              <Dialog open={showAddBoatModal} onOpenChange={setShowAddBoatModal}>
                <DialogTrigger asChild>
                  <Button className="bg-ocean-blue hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi imbarcazione
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
                      <Ship className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {editingBoat ? "✏️ Modifica la tua imbarcazione" : "🚢 Aggiungi la tua imbarcazione"}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                      {editingBoat ? "Aggiorna i dettagli della tua imbarcazione" : "Inserisci tutti i dettagli per far conoscere la tua imbarcazione ai navigatori"}
                    </p>
                  </DialogHeader>

                  <form onSubmit={form.handleSubmit(
                    onSubmit,
                    (errors) => {
                      console.error("❌ Form validation FAILED! Errors:", errors);
                      toast({
                        title: "Errore validazione",
                        description: "Controlla i campi obbligatori evidenziati in rosso",
                        variant: "destructive",
                      });
                    }
                  )} className="space-y-8">
                    
                    {/* Sezione 1: Informazioni Base */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
                          <p className="text-sm text-gray-600">Nome, tipo e caratteristiche principali</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center gap-2">
                            <Ship className="h-4 w-4 text-blue-600" />
                            Nome imbarcazione *
                          </Label>
                          <Input 
                            id="name" 
                            placeholder="es. Azzurra 680, Sea Dreams..." 
                            {...form.register("name")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="manufacturer" className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-blue-600" />
                            Cantiere/Marca
                          </Label>
                          <Input 
                            id="manufacturer" 
                            placeholder="es. Jeanneau, Beneteau, Zodiac..." 
                            {...form.register("manufacturer")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                          {form.formState.errors.manufacturer && (
                            <div className="space-y-2">
                              <p className="text-sm text-red-500">{form.formState.errors.manufacturer.message}</p>
                              {(() => {
                                const inputValue = form.watch("manufacturer");
                                const suggestions = inputValue ? findSimilarManufacturers(inputValue, 3) : [];
                                const boatType = form.watch("type");
                                const categoryManufacturers = boatType ? getManufacturersByCategory(boatType).slice(0, 5) : [];
                                
                                return (
                                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                    {suggestions.length > 0 && (
                                      <div className="mb-3">
                                        <p className="text-xs font-medium text-blue-800 mb-1">Forse intendevi:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {suggestions.map((suggestion) => (
                                            <button
                                              key={suggestion}
                                              type="button"
                                              onClick={() => form.setValue("manufacturer", suggestion)}
                                              className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded border border-blue-300 transition-colors"
                                            >
                                              {suggestion}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {categoryManufacturers.length > 0 && (
                                      <div>
                                        <p className="text-xs font-medium text-blue-800 mb-1">
                                          Cantieri popolari per {boatType}:
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                          {categoryManufacturers.map((manufacturer) => (
                                            <button
                                              key={manufacturer}
                                              type="button"
                                              onClick={() => form.setValue("manufacturer", manufacturer)}
                                              className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded border border-green-300 transition-colors"
                                            >
                                              {manufacturer}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type" className="flex items-center gap-2">
                            <Waves className="h-4 w-4 text-blue-600" />
                            Tipologia *
                          </Label>
                          <Select onValueChange={(value) => form.setValue("type", value as any)}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-500">
                              <SelectValue placeholder="Seleziona tipologia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gommone">🛥️ Gommone</SelectItem>
                              <SelectItem value="yacht">🛳️ Yacht</SelectItem>
                              <SelectItem value="catamarano">⛵ Catamarano</SelectItem>
                              <SelectItem value="jetski">🏄 Moto d'acqua</SelectItem>
                              <SelectItem value="sailboat">⛵ Barca a vela</SelectItem>
                              <SelectItem value="kayak">🚣 Kayak</SelectItem>
                              <SelectItem value="charter">🚢 Charter</SelectItem>
                              <SelectItem value="houseboat">🏠 Houseboat</SelectItem>
                              <SelectItem value="motorboat">🚤 Barca a motore</SelectItem>
                              <SelectItem value="barche-senza-patente">🛴 Barche senza patente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="year" className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            Anno di costruzione
                          </Label>
                          <Input 
                            id="year" 
                            type="number" 
                            placeholder="es. 2020" 
                            {...form.register("year")} 
                            className="border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 2: Caratteristiche Tecniche */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Gauge className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Caratteristiche Tecniche</h3>
                          <p className="text-sm text-gray-600">Dimensioni, capacità e motorizzazione</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="maxPersons" className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            Numero massimo persone *
                          </Label>
                          <Input 
                            id="maxPersons" 
                            type="number" 
                            placeholder="es. 8" 
                            {...form.register("maxPersons")} 
                            className="border-green-200 focus:border-green-500"
                          />
                          {form.formState.errors.maxPersons && (
                            <p className="text-sm text-red-500">{form.formState.errors.maxPersons.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="length" className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-green-600" />
                            Lunghezza (metri)
                          </Label>
                          <Input 
                            id="length" 
                            type="number" 
                            step="0.1" 
                            placeholder="es. 12.5" 
                            {...form.register("length")} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="motorization" className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-green-600" />
                            Motorizzazione
                          </Label>
                          <Input 
                            id="motorization" 
                            placeholder="es. 2x Mercury 250HP" 
                            {...form.register("motorization")} 
                            className="border-green-200 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 3: Ubicazione e Prezzi */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Ubicazione e Prezzi</h3>
                          <p className="text-sm text-gray-600">Porto base e tariffe giornaliere</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="port" className="flex items-center gap-2">
                            <Anchor className="h-4 w-4 text-purple-600" />
                            Porto di partenza *
                          </Label>
                          <Select onValueChange={(value) => form.setValue("location", value)}>
                            <SelectTrigger className="border-purple-200 focus:border-purple-500">
                              <SelectValue placeholder="Seleziona il porto di partenza" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {(() => {
                                const allPorts = getAllPorts();
                                const lazioPorts = allPorts.filter(p => p.region === "Lazio");
                                const campaniaPorts = allPorts.filter(p => p.region === "Campania");
                                
                                return (
                                  <>
                                    {/* Porti del Lazio */}
                                    <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50">
                                      🏛️ Lazio ({lazioPorts.length} porti)
                                    </div>
                                    {lazioPorts.map((port) => (
                                      <SelectItem key={port.name} value={port.fullName}>
                                        <span className="flex items-center gap-2">
                                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                          {port.fullName}
                                        </span>
                                      </SelectItem>
                                    ))}
                                    
                                    {/* Porti della Campania */}
                                    <div className="px-2 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 mt-1">
                                      🌋 Campania ({campaniaPorts.length} porti)
                                    </div>
                                    {campaniaPorts.map((port) => (
                                      <SelectItem key={port.name} value={port.fullName}>
                                        <span className="flex items-center gap-2">
                                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                          {port.fullName}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </>
                                );
                              })()}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.location && (
                            <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricePerDay" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            Prezzo giornaliero (€) *
                          </Label>
                          <Input 
                            id="pricePerDay" 
                            type="number" 
                            step="0.01" 
                            placeholder="es. 350.00" 
                            {...form.register("pricePerDay")} 
                            className="border-purple-200 focus:border-purple-500"
                          />
                          {form.formState.errors.pricePerDay && (
                            <p className="text-sm text-red-500">{form.formState.errors.pricePerDay.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sezione 4: Descrizioni e Documenti */}
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Descrizioni e Documenti</h3>
                          <p className="text-sm text-gray-600">Dettagli aggiuntivi e requisiti necessari</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="description" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            Descrizione completa
                          </Label>
                          <Textarea 
                            id="description" 
                            placeholder="Descrivi la tua imbarcazione: comfort, equipaggiamenti, punti di forza..."
                            rows={4}
                            {...form.register("description")} 
                            className="border-orange-200 focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="flex items-center gap-2 text-lg font-medium">
                            <FileText className="h-5 w-5 text-orange-600" />
                            Documenti richiesti
                          </Label>
                          <div className="bg-white rounded-lg border border-orange-200 p-4 space-y-3">
                            <p className="text-sm text-gray-600 mb-4">Seleziona i documenti necessari per il noleggio:</p>
                            
                            <div className="grid grid-cols-1 gap-3">
                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">📄 Documento di identità valido</span>
                                  <p className="text-sm text-gray-500">Carta d'identità o passaporto in corso di validità</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">⚓ Patente nautica</span>
                                  <p className="text-sm text-gray-500">Obbligatoria per motori oltre 40 HP</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">🛡️ Deposito cauzionale</span>
                                  <p className="text-sm text-gray-500">Garanzia per eventuali danni (trattenuta su carta di credito)</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">🌊 Esperienza di navigazione</span>
                                  <p className="text-sm text-gray-500">Dichiarazione o certificato di esperienza marina</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">💳 Carta di credito intestata</span>
                                  <p className="text-sm text-gray-500">Per il pagamento e le garanzie</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">📋 Briefing di sicurezza</span>
                                  <p className="text-sm text-gray-500">Partecipazione obbligatoria al briefing pre-partenza</p>
                                </div>
                              </label>

                              <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer border">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                                />
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">🎓 Età minima 18 anni</span>
                                  <p className="text-sm text-gray-500">Maggiore età per il conduttore dell'imbarcazione</p>
                                </div>
                              </label>
                            </div>

                            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                              <p className="text-sm text-orange-800">
                                <strong>💡 Suggerimento:</strong> Seleziona solo i documenti realmente necessari per la tua imbarcazione. 
                                Requisiti eccessivi potrebbero scoraggiare i clienti.
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="documentsRequired" className="text-sm font-medium text-gray-700">
                              Note aggiuntive sui documenti (opzionale)
                            </Label>
                            <Textarea 
                              id="documentsRequired" 
                              placeholder="es. Note specifiche, documenti particolari, condizioni speciali..."
                              rows={2}
                              {...form.register("documentsRequired")} 
                              className="border-orange-200 focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sezione 5: Campi Aggiuntivi Utili */}
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Aggiuntive</h3>
                          <p className="text-sm text-gray-600">Dettagli utili per attrare più clienti</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="cabins" className="flex items-center gap-2">
                            <span className="text-teal-600">🛏️</span>
                            Numero cabine
                          </Label>
                          <Input 
                            id="cabins" 
                            type="number" 
                            placeholder="es. 3" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms" className="flex items-center gap-2">
                            <span className="text-teal-600">🚿</span>
                            Numero bagni
                          </Label>
                          <Input 
                            id="bathrooms" 
                            type="number" 
                            placeholder="es. 2" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fuelConsumption" className="flex items-center gap-2">
                            <span className="text-teal-600">⛽</span>
                            Consumo carburante (L/h)
                          </Label>
                          <Input 
                            id="fuelConsumption" 
                            type="number" 
                            placeholder="es. 45" 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="equipment" className="flex items-center gap-2">
                            <span className="text-teal-600">🎯</span>
                            Equipaggiamenti principali
                          </Label>
                          <Input 
                            id="equipment" 
                            placeholder="es. GPS, Autopilota, Tender..." 
                            className="border-teal-200 focus:border-teal-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cancellationPolicy" className="flex items-center gap-2">
                            <span className="text-teal-600">📋</span>
                            Politica di cancellazione
                          </Label>
                          <Select 
                            value={form.watch("cancellationPolicy")} 
                            onValueChange={(value) => form.setValue("cancellationPolicy", value as any)}
                          >
                            <SelectTrigger className="border-teal-200 focus:border-teal-500">
                              <SelectValue placeholder="Seleziona politica" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flexible">🟢 Flessibile - Cancellazione gratuita fino a 24h prima</SelectItem>
                              <SelectItem value="moderate">🔵 Moderata - Cancellazione gratuita fino a 48h prima</SelectItem>
                              <SelectItem value="strict">🟡 Rigida - Cancellazione gratuita fino a 7 giorni prima</SelectItem>
                              <SelectItem value="super_strict">🔴 Super Rigida - Cancellazione gratuita fino a 14 giorni prima</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="refundMethod" className="flex items-center gap-2">
                            <span className="text-teal-600">💳</span>
                            Metodo di rimborso
                          </Label>
                          <Select 
                            value={form.watch("refundMethod")} 
                            onValueChange={(value) => form.setValue("refundMethod", value as any)}
                          >
                            <SelectTrigger className="border-teal-200 focus:border-teal-500">
                              <SelectValue placeholder="Seleziona metodo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="credit_card">💳 Carta di credito (3-5 giorni lavorativi)</SelectItem>
                              <SelectItem value="bank_transfer">🏦 Bonifico bancario (5-7 giorni lavorativi)</SelectItem>
                              <SelectItem value="paypal">📱 PayPal (1-3 giorni lavorativi)</SelectItem>
                              <SelectItem value="seaboo_credit">🌊 Credito SeaBoo (Immediato)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Sezione 6: Foto Imbarcazione */}
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Foto Imbarcazione</h3>
                          <p className="text-sm text-gray-600">Carica le foto della tua imbarcazione (max 10 foto)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Clicca su una foto per impostarla come immagine di copertina
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(form.watch("images") || []).map((imageUrl: string, index: number) => {
                            const isCover = (form.watch("coverImage") || 0) === index;
                            return (
                              <div key={index} className="relative group">
                                <img 
                                  src={imageUrl} 
                                  alt={`Foto ${index + 1}`}
                                  className={`w-full h-24 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                                    isCover ? 'border-yellow-500 ring-2 ring-yellow-300' : 'border-pink-200 hover:border-pink-400'
                                  }`}
                                  onClick={() => {
                                    form.setValue("coverImage", index);
                                    toast({
                                      title: "Copertina impostata",
                                      description: `Foto ${index + 1} selezionata come copertina`,
                                    });
                                  }}
                                />
                                {isCover && (
                                  <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                    Copertina
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const currentImages = form.getValues("images") || [];
                                    const currentCover = form.getValues("coverImage") || 0;
                                    form.setValue("images", currentImages.filter((_: string, i: number) => i !== index));
                                    if (currentCover >= index && currentCover > 0) {
                                      form.setValue("coverImage", currentCover - 1);
                                    }
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-lg p-6 hover:border-pink-400 transition-colors">
                          <Camera className="h-10 w-10 text-pink-400 mb-2" />
                          <p className="text-sm text-gray-600 text-center mb-3">
                            Carica le foto della tua imbarcazione dal tuo dispositivo
                          </p>
                          <input 
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            multiple
                            id="boatImageUpload"
                            className="hidden"
                            data-testid="input-boat-image-file"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (!files) return;
                              
                              const currentImages = form.getValues("images") || [];
                              const remainingSlots = 10 - currentImages.length;
                              
                              if (remainingSlots <= 0) {
                                toast({
                                  title: "Limite raggiunto",
                                  description: "Puoi caricare massimo 10 foto",
                                  variant: "destructive",
                                });
                                return;
                              }
                              
                              const filesToProcess = Array.from(files).slice(0, remainingSlots);
                              
                              const compressImage = (file: File): Promise<string> => {
                                return new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const img = new Image();
                                    img.onload = () => {
                                      const canvas = document.createElement('canvas');
                                      const maxWidth = 1200;
                                      const maxHeight = 900;
                                      let width = img.width;
                                      let height = img.height;
                                      
                                      if (width > maxWidth) {
                                        height = (height * maxWidth) / width;
                                        width = maxWidth;
                                      }
                                      if (height > maxHeight) {
                                        width = (width * maxHeight) / height;
                                        height = maxHeight;
                                      }
                                      
                                      canvas.width = width;
                                      canvas.height = height;
                                      const ctx = canvas.getContext('2d');
                                      ctx?.drawImage(img, 0, 0, width, height);
                                      const compressed = canvas.toDataURL('image/jpeg', 0.7);
                                      resolve(compressed);
                                    };
                                    img.onerror = reject;
                                    img.src = event.target?.result as string;
                                  };
                                  reader.onerror = reject;
                                  reader.readAsDataURL(file);
                                });
                              };
                              
                              filesToProcess.forEach(async (file) => {
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    title: "File troppo grande",
                                    description: `${file.name} supera i 10MB`,
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                
                                try {
                                  const compressed = await compressImage(file);
                                  const updatedImages = form.getValues("images") || [];
                                  if (updatedImages.length < 10) {
                                    form.setValue("images", [...updatedImages, compressed]);
                                    toast({
                                      title: "Foto caricata",
                                      description: `${file.name} compressa e aggiunta`,
                                    });
                                  }
                                } catch (err) {
                                  toast({
                                    title: "Errore",
                                    description: `Impossibile caricare ${file.name}`,
                                    variant: "destructive",
                                  });
                                }
                              });
                              
                              e.target.value = '';
                            }}
                          />
                          <Button 
                            type="button"
                            variant="outline"
                            className="border-pink-300 text-pink-600 hover:bg-pink-100"
                            data-testid="button-upload-boat-image"
                            onClick={() => document.getElementById('boatImageUpload')?.click()}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Scegli foto dal dispositivo
                          </Button>
                          <p className="text-xs text-gray-500 mt-3">
                            💡 Formati: JPG, PNG, WebP (max 10MB, compresse automaticamente)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pulsanti di Azione */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={createBoatMutation.isPending || updateBoatMutation.isPending}
                      >
                        {createBoatMutation.isPending || updateBoatMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Ship className="h-4 w-4" />
                            {editingBoat ? "🔄 Aggiorna imbarcazione" : "✨ Aggiungi imbarcazione"}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1 sm:flex-initial min-w-[120px] border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors duration-200"
                        onClick={() => {
                          setShowAddBoatModal(false);
                          setEditingBoat(null);
                          form.reset();
                        }}
                      >
                        ❌ Annulla
                      </Button>
                    </div>

                    {/* Info Footer */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">
                        💡 <strong>Suggerimento:</strong> Più informazioni inserisci, più è probabile che i clienti scelgano la tua imbarcazione!
                      </p>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boats.map((boat) => (
                <Card key={boat.id}>
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <img
                        src={boat.images?.[boat.coverImage || 0] || boat.images?.[0] || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&h=250"}
                        alt={boat.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${boat.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {boat.active ? "Attiva" : "Disattiva"}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{boat.name}</h3>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {boat.port}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Fino a {boat.maxPersons} persone
                      </div>
                      <div className="flex items-center">
                        <Euro className="h-4 w-4 mr-1" />
                        €{boat.pricePerDay}/giorno
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(boat)} title="Modifica">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Link href={`/boats/${boat.id}/availability`}>
                        <Button size="sm" variant="outline" className="w-full" title="Gestione disponibilità">
                          <CalendarDays className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            title="Elimina"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sei sicuro di voler eliminare l'imbarcazione "{boat.name}"?
                              <br /><br />
                              <strong className="text-red-600">Attenzione: questa azione è definitiva e non può essere annullata.</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteBoatMutation.mutate(boat.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sì, elimina definitivamente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moorings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">I miei ormeggi</h2>
              <Dialog open={showAddMooringModal} onOpenChange={(open) => {
                setShowAddMooringModal(open);
                if (!open) {
                  setEditingMooring(null);
                  resetMooringForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="button-addMooring"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi ormeggio
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto pb-24 md:pb-6">
                  <DialogHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4">
                      {editingMooring ? <Pencil className="h-8 w-8 text-white" /> : <Anchor className="h-8 w-8 text-white" />}
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {editingMooring ? "Modifica ormeggio" : "Aggiungi un nuovo ormeggio"}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                      {editingMooring ? "Modifica i dettagli del tuo posto barca" : "Metti a disposizione il tuo posto barca per altre imbarcazioni"}
                    </p>
                  </DialogHeader>

                  <form className="space-y-8" onSubmit={handleMooringSubmit}>
                    {/* Informazioni Base */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="mooring-name">Nome Ormeggio *</Label>
                          <Input
                            id="mooring-name"
                            placeholder="es. Ormeggio A12 - Porto di Napoli"
                            required
                            data-testid="input-mooringName"
                            value={mooringFormData.name}
                            onChange={(e) => setMooringFormData({...mooringFormData, name: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2 relative">
                          <Label htmlFor="mooring-port">Porto *</Label>
                          <Input
                            ref={mooringPortInputRef}
                            id="mooring-port"
                            value={mooringPortSearch}
                            onChange={(e) => {
                              setMooringPortSearch(e.target.value);
                              setShowMooringPortSuggestions(e.target.value.trim().length > 0);
                            }}
                            onFocus={() => {
                              if (mooringPortSearch.trim().length > 0) {
                                setShowMooringPortSuggestions(true);
                              }
                            }}
                            placeholder="Cerca porto (es. Napoli, Amalfi...)"
                            required
                            data-testid="input-mooringPort"
                            autoComplete="off"
                          />
                          {/* Suggerimenti autofill */}
                          {showMooringPortSuggestions && filteredMooringPorts.length > 0 && (
                            <div 
                              ref={mooringPortSuggestionsRef}
                              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                              {filteredMooringPorts.map((port, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex justify-between items-center border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    setMooringPortSearch(port.name);
                                    setShowMooringPortSuggestions(false);
                                  }}
                                >
                                  <span className="font-medium text-gray-900">{port.name}</span>
                                  <span className="text-sm text-gray-500">{port.region}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-type">Tipo ormeggio *</Label>
                          <Select
                            value={mooringFormData.type}
                            onValueChange={(value) => setMooringFormData({...mooringFormData, type: value})}
                          >
                            <SelectTrigger data-testid="select-mooringType">
                              <SelectValue placeholder="Seleziona tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pontile">Pontile</SelectItem>
                              <SelectItem value="boa">Boa</SelectItem>
                              <SelectItem value="ancora">Ancora</SelectItem>
                              <SelectItem value="gavitello">Gavitello</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-location">Posizione esatta *</Label>
                          <Input
                            id="mooring-location"
                            placeholder="es. Molo C, Posto 45"
                            required
                            data-testid="input-mooringLocation"
                            value={mooringFormData.location}
                            onChange={(e) => setMooringFormData({...mooringFormData, location: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Specifiche Tecniche */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Ruler className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Specifiche Tecniche</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="mooring-maxLength">Lunghezza massima (m) *</Label>
                          <Input
                            id="mooring-maxLength"
                            type="number"
                            placeholder="es. 12"
                            required
                            data-testid="input-mooringMaxLength"
                            value={mooringFormData.maxLength}
                            onChange={(e) => setMooringFormData({...mooringFormData, maxLength: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-maxBeam">Larghezza massima (m)</Label>
                          <Input
                            id="mooring-maxBeam"
                            type="number"
                            placeholder="es. 4"
                            data-testid="input-mooringMaxBeam"
                            value={mooringFormData.maxBeam}
                            onChange={(e) => setMooringFormData({...mooringFormData, maxBeam: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-depth">Profondità (m)</Label>
                          <Input
                            id="mooring-depth"
                            type="number"
                            step="0.1"
                            placeholder="es. 3.5"
                            data-testid="input-mooringDepth"
                            value={mooringFormData.depth}
                            onChange={(e) => setMooringFormData({...mooringFormData, depth: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Prezzi */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Euro className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Tariffe</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="mooring-dailyPrice">Tariffa giornaliera (€) *</Label>
                          <Input
                            id="mooring-dailyPrice"
                            type="number"
                            placeholder="es. 50"
                            required
                            data-testid="input-mooringDailyPrice"
                            value={mooringFormData.pricePerDay}
                            onChange={(e) => setMooringFormData({...mooringFormData, pricePerDay: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-weeklyPrice">Tariffa settimanale (€)</Label>
                          <Input
                            id="mooring-weeklyPrice"
                            type="number"
                            placeholder="es. 300"
                            data-testid="input-mooringWeeklyPrice"
                            value={mooringFormData.pricePerWeek}
                            onChange={(e) => setMooringFormData({...mooringFormData, pricePerWeek: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mooring-monthlyPrice">Tariffa mensile (€)</Label>
                          <Input
                            id="mooring-monthlyPrice"
                            type="number"
                            placeholder="es. 1000"
                            data-testid="input-mooringMonthlyPrice"
                            value={mooringFormData.pricePerMonth}
                            onChange={(e) => setMooringFormData({...mooringFormData, pricePerMonth: e.target.value})}
                          />
                        </div>

                      </div>
                    </div>

                    {/* Servizi Disponibili */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Settings className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Servizi Disponibili</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-security"
                            checked={mooringFormData.services.security}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, security: e.target.checked}})}
                          />
                          <span className="text-sm">Sorveglianza</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-water"
                            checked={mooringFormData.services.water}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, water: e.target.checked}})}
                          />
                          <span className="text-sm">Acqua</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-electricity"
                            checked={mooringFormData.services.electricity}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, electricity: e.target.checked}})}
                          />
                          <span className="text-sm">Elettricita</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-fuel"
                            checked={mooringFormData.services.fuel}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, fuel: e.target.checked}})}
                          />
                          <span className="text-sm">Carburante</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-wifi"
                            checked={mooringFormData.services.wifi}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, wifi: e.target.checked}})}
                          />
                          <span className="text-sm">WiFi</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-parking"
                            checked={mooringFormData.services.parking}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, parking: e.target.checked}})}
                          />
                          <span className="text-sm">Parcheggio</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-shower"
                            checked={mooringFormData.services.shower}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, shower: e.target.checked}})}
                          />
                          <span className="text-sm">Docce</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            data-testid="checkbox-restaurant"
                            checked={mooringFormData.services.restaurant}
                            onChange={(e) => setMooringFormData({...mooringFormData, services: {...mooringFormData.services, restaurant: e.target.checked}})}
                          />
                          <span className="text-sm">Ristorante</span>
                        </label>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddMooringModal(false)}
                        data-testid="button-cancelMooring"
                      >
                        Annulla
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid="button-submitMooring"
                        disabled={createMooringMutation.isPending || updateMooringMutation.isPending}
                      >
                        {editingMooring ? <Pencil className="h-4 w-4 mr-2" /> : <Anchor className="h-4 w-4 mr-2" />}
                        {(createMooringMutation.isPending || updateMooringMutation.isPending) 
                          ? "Salvataggio..." 
                          : editingMooring 
                            ? "Salva modifiche" 
                            : "Pubblica ormeggio"
                        }
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Anchor className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestisci i tuoi posti barca</h3>
                <p className="text-gray-600 mb-4">
                  Metti a disposizione i tuoi ormeggi per altre barche. Inizia ad aggiungere i tuoi posti barca disponibili.
                </p>
                <div className="bg-white rounded-lg p-4 text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Specifica porto e posizione</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Indica lunghezza massima barca</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Imposta tariffa giornaliera</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {mooringsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Caricamento ormeggi...</p>
              </div>
            ) : moorings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nessun ormeggio aggiunto. Clicca "Aggiungi ormeggio" per iniziare.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moorings.map((mooring) => (
                  <Card key={mooring.id} className="hover:shadow-lg transition-shadow" data-testid={`card-mooring-${mooring.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{mooring.name}</h3>
                          <p className="text-sm text-gray-600">{mooring.port}</p>
                          {mooring.location && <p className="text-xs text-gray-500">{mooring.location}</p>}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Anchor className="h-3 w-3 mr-1" />
                          Ormeggio
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {mooring.maxLength && (
                          <div className="flex items-center">
                            <Ruler className="h-4 w-4 mr-1" />
                            Max {mooring.maxLength}m
                          </div>
                        )}
                        <div className="flex items-center">
                          <Euro className="h-4 w-4 mr-1" />
                          {mooring.pricePerDay}/giorno
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => openEditMooringModal(mooring)}
                          data-testid={`button-editMooring-${mooring.id}`}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifica
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => {
                            setSelectedMooringForCalendar(mooring);
                            setShowMooringCalendarModal(true);
                          }}
                          data-testid={`button-calendarMooring-${mooring.id}`}
                        >
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Calendario
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" data-testid={`button-deleteMooring-${mooring.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminare questo ormeggio?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Questa azione non puo essere annullata. L'ormeggio "{mooring.name}" verra eliminato permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annulla</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteMooringMutation.mutate(mooring.id)}
                              >
                                Elimina
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Le mie esperienze</h2>
              <Dialog open={showAddExperienceModal} onOpenChange={setShowAddExperienceModal}>
                <DialogTrigger asChild>
                  <Button className="bg-coral hover:bg-orange-600" data-testid="button-addExperience">
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi esperienza
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="text-center pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-coral to-orange-500 rounded-full flex items-center justify-center mb-4">
                      {editingExperience ? <Pencil className="h-8 w-8 text-white" /> : <Sparkles className="h-8 w-8 text-white" />}
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {editingExperience ? "Modifica esperienza" : "Crea una nuova esperienza"}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">
                      {editingExperience ? "Modifica i dettagli dell'esperienza" : "Offri ai tuoi ospiti un'esperienza memorabile sul mare"}
                    </p>
                  </DialogHeader>

                  <form onSubmit={handleExperienceSubmit} className="space-y-8">
                    
                    {/* Sezione 1: Informazioni Base */}
                    <div className="bg-coral/10 border border-coral/30 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Informazioni Base</h3>
                          <p className="text-sm text-gray-600">Nome, categoria e dettagli principali</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="experienceTitle" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-coral" />
                            Titolo esperienza *
                          </Label>
                          <Input 
                            id="experienceTitle" 
                            placeholder="es. Tour delle Isole Pontine, Tramonto con Aperitivo..." 
                            className="border-coral/30 focus:border-coral"
                            value={experienceFormData.name}
                            onChange={(e) => setExperienceFormData({...experienceFormData, name: e.target.value})}
                            data-testid="input-experienceName"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experienceCategory" className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-coral" />
                            Categoria *
                          </Label>
                          <Select
                            value={experienceFormData.category}
                            onValueChange={(value: any) => setExperienceFormData({...experienceFormData, category: value})}
                          >
                            <SelectTrigger className="border-coral/30 focus:border-coral" data-testid="select-experienceCategory">
                              <SelectValue placeholder="Seleziona categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tour">Tour ed Escursioni</SelectItem>
                              <SelectItem value="aperitivo">Aperitivo al Tramonto</SelectItem>
                              <SelectItem value="sunset">Tramonto Romantico</SelectItem>
                              <SelectItem value="fishing">Pesca Sportiva</SelectItem>
                              <SelectItem value="diving">Snorkeling e Immersioni</SelectItem>
                              <SelectItem value="sport">Sport Acquatici</SelectItem>
                              <SelectItem value="romantic">Esperienza Romantica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experienceDuration" className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-coral" />
                            Durata (ore) *
                          </Label>
                          <Input 
                            id="experienceDuration" 
                            type="number"
                            placeholder="es. 4" 
                            className="border-coral/30 focus:border-coral"
                            value={experienceFormData.duration}
                            onChange={(e) => setExperienceFormData({...experienceFormData, duration: e.target.value})}
                            data-testid="input-experienceDuration"
                          />
                        </div>

                        <div className="space-y-2 relative">
                          <Label htmlFor="experienceLocation" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-coral" />
                            Località partenza *
                          </Label>
                          <Input 
                            ref={experienceLocationInputRef}
                            id="experienceLocation" 
                            placeholder="Inizia a digitare... (es. Gaeta, Napoli)" 
                            className="border-coral/30 focus:border-coral"
                            value={experienceLocationSearch || experienceFormData.location}
                            onChange={(e) => {
                              setExperienceLocationSearch(e.target.value);
                              setShowExperienceLocationSuggestions(true);
                              if (e.target.value === '') {
                                setExperienceFormData({...experienceFormData, location: ''});
                              }
                            }}
                            onFocus={() => {
                              if (experienceLocationSearch.length > 0) {
                                setShowExperienceLocationSuggestions(true);
                              }
                            }}
                            data-testid="input-experienceLocation"
                          />
                          {showExperienceLocationSuggestions && filteredExperienceLocations.length > 0 && (
                            <div 
                              ref={experienceLocationSuggestionsRef}
                              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                              {filteredExperienceLocations.map((port, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className="w-full px-4 py-3 text-left hover:bg-coral/10 flex items-center justify-between border-b border-gray-100 last:border-b-0"
                                  onClick={() => {
                                    setExperienceFormData({...experienceFormData, location: port.name});
                                    setExperienceLocationSearch(port.name);
                                    setShowExperienceLocationSuggestions(false);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-coral" />
                                    <span className="font-medium">{port.name}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{port.region}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sezione 2: Dettagli Esperienza */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Dettagli Esperienza</h3>
                          <p className="text-sm text-gray-600">Capacità, prezzi e cosa include</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="maxParticipants" className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            Partecipanti massimi *
                          </Label>
                          <Input 
                            id="maxParticipants" 
                            type="number" 
                            placeholder="es. 12" 
                            className="border-blue-200 focus:border-blue-500"
                            value={experienceFormData.maxParticipants}
                            onChange={(e) => setExperienceFormData({...experienceFormData, maxParticipants: e.target.value})}
                            data-testid="input-experienceMaxParticipants"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricePerPerson" className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-blue-600" />
                            Prezzo per persona *
                          </Label>
                          <Input 
                            id="pricePerPerson" 
                            type="number" 
                            step="0.01" 
                            placeholder="es. 85.00" 
                            className="border-blue-200 focus:border-blue-500"
                            value={experienceFormData.pricePerPerson}
                            onChange={(e) => setExperienceFormData({...experienceFormData, pricePerPerson: e.target.value})}
                            data-testid="input-experiencePrice"
                          />
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <Label htmlFor="includes" className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          Cosa include (una per riga)
                        </Label>
                        <Textarea 
                          id="includes" 
                          placeholder="es. Pranzo a bordo&#10;Attrezzatura snorkeling&#10;Guida esperta&#10;Assicurazione"
                          rows={4}
                          className="border-blue-200 focus:border-blue-500"
                          value={experienceFormData.includes}
                          onChange={(e) => setExperienceFormData({...experienceFormData, includes: e.target.value})}
                          data-testid="textarea-experienceIncludes"
                        />
                      </div>
                    </div>

                    {/* Sezione 3: Descrizione Esperienza */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Descrizione Esperienza</h3>
                          <p className="text-sm text-gray-600">Racconta cosa rende speciale la tua esperienza</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="experienceDescription" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            Descrizione completa *
                          </Label>
                          <Textarea 
                            id="experienceDescription" 
                            placeholder="Descrivi nel dettaglio l'esperienza: itinerario, attività, momenti speciali che vivranno gli ospiti..."
                            rows={5}
                            className="border-green-200 focus:border-green-500"
                            value={experienceFormData.description}
                            onChange={(e) => setExperienceFormData({...experienceFormData, description: e.target.value})}
                            data-testid="textarea-experienceDescription"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specialNotes" className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-green-600" />
                            Note speciali e requisiti
                          </Label>
                          <Textarea 
                            id="specialNotes" 
                            placeholder="es. Esperienza soggetta a condizioni meteo, si consiglia abbigliamento comodo, età minima 18 anni..."
                            rows={3}
                            className="border-green-200 focus:border-green-500"
                            value={experienceFormData.requirements}
                            onChange={(e) => setExperienceFormData({...experienceFormData, requirements: e.target.value})}
                            data-testid="textarea-experienceRequirements"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 4: Foto Esperienza */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Foto Esperienza *</h3>
                          <p className="text-sm text-gray-600">Carica almeno 3 foto per mostrare la tua esperienza (max 10)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Anteprima foto caricate */}
                        {experienceImages.length > 0 && (
                          <>
                            <div className="text-sm text-purple-600 mb-2">
                              Clicca su una foto per impostarla come copertina
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {experienceImages.map((image, index) => (
                                <div 
                                  key={index} 
                                  className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer transition-all ${
                                    experienceCoverIndex === index 
                                      ? 'border-4 border-coral ring-2 ring-coral/30 scale-105' 
                                      : 'border-2 border-purple-200 hover:border-purple-400'
                                  }`}
                                  onClick={() => setExperienceCoverIndex(index)}
                                >
                                  <img
                                    src={image}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {experienceCoverIndex === index && (
                                    <div className="absolute top-1 left-1 bg-coral text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      Copertina
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newImages = experienceImages.filter((_, i) => i !== index);
                                      setExperienceImages(newImages);
                                      if (experienceCoverIndex >= newImages.length) {
                                        setExperienceCoverIndex(Math.max(0, newImages.length - 1));
                                      } else if (experienceCoverIndex > index) {
                                        setExperienceCoverIndex(experienceCoverIndex - 1);
                                      }
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    x
                                  </button>
                                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                    {index + 1}/{experienceImages.length}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                        
                        {/* Indicatore progresso foto */}
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-medium ${experienceImages.length >= 3 ? 'text-green-600' : 'text-red-500'}`}>
                            {experienceImages.length}/3 foto minime {experienceImages.length >= 3 ? '✓' : '(obbligatorie)'}
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${experienceImages.length >= 3 ? 'bg-green-500' : 'bg-orange-400'}`}
                              style={{ width: `${Math.min((experienceImages.length / 3) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Upload zone */}
                        {experienceImages.length < 10 && (
                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                            <Camera className="h-10 w-10 text-purple-400 mb-2" />
                            <p className="text-sm text-gray-600 text-center mb-3">
                              Carica le foto della tua esperienza
                            </p>
                            <input 
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              multiple
                              id="experienceImageUpload"
                              className="hidden"
                              data-testid="input-experience-image-file"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (!files) return;
                                
                                const remainingSlots = 10 - experienceImages.length;
                                
                                if (remainingSlots <= 0) {
                                  toast({
                                    title: "Limite raggiunto",
                                    description: "Puoi caricare massimo 10 foto",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                
                                const filesToProcess = Array.from(files).slice(0, remainingSlots);
                                
                                const compressImage = (file: File): Promise<string> => {
                                  return new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const img = new Image();
                                      img.onload = () => {
                                        const canvas = document.createElement('canvas');
                                        const maxWidth = 1200;
                                        const maxHeight = 900;
                                        let width = img.width;
                                        let height = img.height;
                                        
                                        if (width > maxWidth) {
                                          height = (height * maxWidth) / width;
                                          width = maxWidth;
                                        }
                                        if (height > maxHeight) {
                                          width = (width * maxHeight) / height;
                                          height = maxHeight;
                                        }
                                        
                                        canvas.width = width;
                                        canvas.height = height;
                                        const ctx = canvas.getContext('2d');
                                        ctx?.drawImage(img, 0, 0, width, height);
                                        const compressed = canvas.toDataURL('image/jpeg', 0.7);
                                        resolve(compressed);
                                      };
                                      img.onerror = reject;
                                      img.src = event.target?.result as string;
                                    };
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                  });
                                };
                                
                                filesToProcess.forEach(async (file) => {
                                  if (file.size > 10 * 1024 * 1024) {
                                    toast({
                                      title: "File troppo grande",
                                      description: `${file.name} supera i 10MB`,
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  
                                  try {
                                    const compressed = await compressImage(file);
                                    setExperienceImages(prev => {
                                      if (prev.length < 10) {
                                        return [...prev, compressed];
                                      }
                                      return prev;
                                    });
                                    toast({
                                      title: "Foto caricata",
                                      description: `${file.name} aggiunta`,
                                    });
                                  } catch (err) {
                                    toast({
                                      title: "Errore",
                                      description: `Impossibile caricare ${file.name}`,
                                      variant: "destructive",
                                    });
                                  }
                                });
                                
                                e.target.value = '';
                              }}
                            />
                            <Button 
                              type="button"
                              variant="outline"
                              className="border-purple-300 text-purple-600 hover:bg-purple-100"
                              data-testid="button-upload-experience-image"
                              onClick={() => document.getElementById('experienceImageUpload')?.click()}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Scegli foto dal dispositivo
                            </Button>
                            <p className="text-xs text-gray-500 mt-3">
                              Formati: JPG, PNG, WebP (max 10MB, compresse automaticamente)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pulsanti di Azione */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                      <Button 
                        type="submit" 
                        disabled={createExperienceMutation.isPending || updateExperienceMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-coral to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        data-testid="button-submitExperience"
                      >
                        {editingExperience ? <Save className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                        {editingExperience 
                          ? (updateExperienceMutation.isPending ? "Salvataggio..." : "Salva modifiche")
                          : (createExperienceMutation.isPending ? "Creazione..." : "Crea esperienza")
                        }
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddExperienceModal(false);
                          resetExperienceForm();
                        }}
                        className="flex-1 sm:flex-initial min-w-[120px] border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors duration-200"
                        data-testid="button-cancelExperience"
                      >
                        Annulla
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista esperienze */}
            {experiencesList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessuna esperienza creata</h3>
                <p className="text-gray-600 mb-4">
                  Inizia a offrire esperienze uniche ai tuoi ospiti per aumentare i guadagni!
                </p>
                <p className="text-sm text-gray-500">
                  Le esperienze possono generare fino al 40% di ricavi aggiuntivi rispetto al solo noleggio
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiencesList.map((experience) => {
                  const categoryLabels: Record<string, string> = {
                    tour: "Tour ed Escursioni",
                    aperitivo: "Aperitivo al Tramonto",
                    sunset: "Tramonto Romantico",
                    fishing: "Pesca Sportiva",
                    diving: "Snorkeling e Immersioni",
                    sport: "Sport Acquatici",
                    romantic: "Esperienza Romantica",
                  };
                  const coverImage = experience.images && experience.images.length > 0 ? experience.images[0] : null;
                  return (
                    <Card key={experience.id} className="hover:shadow-lg transition-shadow overflow-hidden" data-testid={`card-experience-${experience.id}`}>
                      {/* Immagine di copertina */}
                      {coverImage ? (
                        <div className="relative h-48 w-full">
                          <img 
                            src={coverImage} 
                            alt={experience.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <span className="text-sm font-bold text-coral">{experience.pricePerPerson}</span>
                            <span className="text-xs text-gray-500">/persona</span>
                          </div>
                          {experience.images && experience.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {experience.images.length}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-32 bg-gradient-to-br from-coral/20 to-orange-100 flex items-center justify-center">
                          <Sparkles className="h-12 w-12 text-coral/40" />
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{experience.name}</h3>
                            <Badge className="bg-coral/20 text-coral mt-1">
                              {categoryLabels[experience.category] || experience.category}
                            </Badge>
                          </div>
                          {!coverImage && (
                            <div className="text-right">
                              <p className="text-xl font-bold text-coral">{experience.pricePerPerson}</p>
                              <p className="text-xs text-gray-500">per persona</p>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{experience.description}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {experience.duration} ore
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Max {experience.maxParticipants}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {experience.location}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => {
                              const includesValue = Array.isArray(experience.includes) 
                                ? experience.includes.join('\n') 
                                : (experience.includes || "");
                              setExperienceFormData({
                                name: experience.name,
                                category: experience.category as any,
                                description: experience.description,
                                duration: String(experience.duration),
                                maxParticipants: String(experience.maxParticipants),
                                pricePerPerson: String(experience.pricePerPerson),
                                location: experience.location,
                                includes: includesValue,
                                requirements: experience.requirements || "",
                              });
                              setExperienceImages(experience.images || []);
                              setExperienceLocationSearch(experience.location);
                              setEditingExperience(experience);
                              setShowAddExperienceModal(true);
                            }}
                            data-testid={`button-editExperience-${experience.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-coral hover:bg-coral/10"
                            onClick={() => {
                              setSelectedExperienceForCalendar(experience);
                              setShowExperienceCalendarModal(true);
                            }}
                            data-testid={`button-calendarExperience-${experience.id}`}
                          >
                            <CalendarIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" data-testid={`button-deleteExperience-${experience.id}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Eliminare questa esperienza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Questa azione non puo essere annullata. L'esperienza "{experience.name}" verra eliminata permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annulla</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deleteExperienceMutation.mutate(experience.id)}
                                >
                                  Elimina
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Prenotazioni ricevute</h2>
            
            <div className="space-y-4">
              {bookings.map((booking) => {
                const boat = boats.find(b => b.id === booking.boatId);
                return (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <h3 className="text-lg font-semibold">{boat?.name}</h3>
                            {getBookingStatusBadge(booking.status || 'pending', booking.endDate)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Date</p>
                              <p className="font-medium">
                                {format(new Date(booking.startDate), "dd MMM", { locale: it })} - {format(new Date(booking.endDate), "dd MMM yyyy", { locale: it })}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Totale</p>
                              <p className="font-medium">€{booking.totalPrice}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Guadagno</p>
                              <p className="font-medium text-green-600">
                                €{(Number(booking.totalPrice) - Number(booking.commission)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <ChatButton bookingId={booking.id} />
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Messaggi</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun messaggio</h3>
                <p className="text-gray-600">I messaggi dai tuoi clienti appariranno qui</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Il mio profilo</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Modifica profilo
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Informazioni Personali */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Informazioni Personali</CardTitle>
                      <p className="text-sm text-gray-600">Gestisci i tuoi dati di contatto</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Nome
                      </Label>
                      <Input 
                        id="firstName" 
                        value={profileData.firstName} 
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                        data-testid="input-firstName"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Cognome
                      </Label>
                      <Input 
                        id="lastName" 
                        value={profileData.lastName} 
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                        data-testid="input-lastName"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        Telefono
                      </Label>
                      <Input 
                        id="phone" 
                        placeholder="+39 333 123 4567" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="border-blue-200 focus:border-blue-500"
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Biografia (opzionale)
                    </Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Raccontaci qualcosa di te e della tua esperienza nel settore nautico..."
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="border-blue-200 focus:border-blue-500"
                      data-testid="input-bio"
                    />
                  </div>

                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSaveProfile}
                    data-testid="button-saveProfile"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salva modifiche
                  </Button>
                </CardContent>
              </Card>

              {/* Foto Profilo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-gray-600" />
                    Foto Profilo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="Foto profilo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/jpeg,image/jpg,image/png"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {profilePhoto ? 'Cambia foto' : 'Carica foto'}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Formati: JPG, PNG<br />
                    Max: 5MB
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pagamenti e IBAN */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Dati di Pagamento</CardTitle>
                    <p className="text-sm text-gray-600">Configura il tuo IBAN per ricevere i compensi</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Come funzionano i pagamenti</h4>
                      <p className="text-sm text-green-700 mt-1">
                        I tuoi guadagni vengono accreditati automaticamente ogni 7 giorni sul conto corrente che indicherai.
                        La commissione SeaBoo del 15% viene trattenuta automaticamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="iban" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      IBAN *
                    </Label>
                    <Input 
                      id="iban" 
                      placeholder="IT60 X054 2811 1010 0000 0123 456" 
                      className="border-green-200 focus:border-green-500 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      Nome Banca
                    </Label>
                    <Input 
                      id="bankName" 
                      placeholder="es. Intesa Sanpaolo, UniCredit..." 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Intestatario Conto *
                    </Label>
                    <Input 
                      id="accountHolder" 
                      placeholder="Nome e Cognome come sul conto" 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swiftBic" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      Codice SWIFT/BIC (opzionale)
                    </Label>
                    <Input 
                      id="swiftBic" 
                      placeholder="BCITITMM" 
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Sicurezza e Privacy</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        I tuoi dati bancari sono crittografati e protetti secondo i più alti standard di sicurezza.
                        Utilizziamo la tecnologia SSL e non condividiamo mai i tuoi dati con terze parti.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Salva dati di pagamento
                </Button>
              </CardContent>
            </Card>

            {/* Sicurezza Account */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Sicurezza Account</CardTitle>
                    <p className="text-sm text-gray-600">Gestisci la sicurezza del tuo account</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-gray-600">Ultima modifica: 15 giorni fa</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    Cambia password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Notifiche Email</p>
                      <p className="text-sm text-gray-600">Ricevi aggiornamenti via email</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleManageNotifications}>
                    Gestisci
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-700">Elimina account</p>
                      <p className="text-sm text-red-600">Rimuovi permanentemente il tuo account</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" data-testid="button-delete-account-owner">
                        Elimina
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Questa azione non può essere annullata. Eliminerà permanentemente il tuo
                            account e rimuoverà tutti i tuoi dati dai nostri server.
                          </p>
                          <p className="font-semibold text-red-600">
                            Tutte le tue barche, prenotazioni, guadagni e dati personali
                            verranno eliminati definitivamente.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-testid="button-cancel-delete-owner">
                          Annulla
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                          data-testid="button-confirm-delete-owner"
                        >
                          Sì, elimina il mio account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Statistiche Account */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{monthsActive}</p>
                  <p className="text-sm text-gray-600">Mesi attivo</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{averageRating > 0 ? averageRating.toFixed(1) : '-'}</p>
                  <p className="text-sm text-gray-600">Rating medio</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{confirmationRate > 0 ? `${confirmationRate}%` : '-'}</p>
                  <p className="text-sm text-gray-600">Tasso conferma</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistiche</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guadagni totali</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">€{totalEarnings.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Totale da inizio attività</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tasso di occupazione</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">{occupancyRate}%</p>
                      <p className="text-sm text-gray-600">Media ultimo mese</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Calendario Disponibilità Ormeggi */}
      <Dialog open={showMooringCalendarModal} onOpenChange={(open) => {
        setShowMooringCalendarModal(open);
        if (!open) {
          setSelectedMooringForCalendar(null);
          setMooringRangeStart(null);
          setMooringRangeEnd(null);
          setMooringHoveredDate(null);
          setMooringPriceOverride("");
          setMooringBlockStatus('blocked');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-600" />
              Gestione Disponibilità Ormeggio
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {selectedMooringForCalendar?.name} - {selectedMooringForCalendar?.port}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Istruzioni */}
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <strong>Come funziona:</strong> Clicca su una data di inizio, poi su una data di fine per selezionare un intervallo. Le date selezionate verranno evidenziate in blu.
            </div>

            {/* Navigazione mese */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMooringCalendarMonth(subMonths(mooringCalendarMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg">
                {format(mooringCalendarMonth, 'MMMM yyyy', { locale: it })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMooringCalendarMonth(addMonths(mooringCalendarMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendario custom con griglia */}
            <div className="border rounded-lg overflow-hidden">
              {/* Header giorni settimana */}
              <div className="grid grid-cols-7 bg-gray-100">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Griglia giorni */}
              <div className="grid grid-cols-7">
                {(() => {
                  const monthStart = startOfMonth(mooringCalendarMonth);
                  const monthEnd = endOfMonth(mooringCalendarMonth);
                  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                  
                  const startDayOfWeek = getDay(monthStart);
                  const emptyDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
                  
                  const allCells = [
                    ...Array(emptyDays).fill(null),
                    ...days
                  ];
                  
                  return allCells.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="min-h-[50px] bg-gray-50 border-b border-r"></div>;
                    }
                    
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = isBefore(day, today);
                    
                    const isRangeStart = mooringRangeStart && isSameDay(day, mooringRangeStart);
                    const isRangeEnd = mooringRangeEnd && isSameDay(day, mooringRangeEnd);
                    const isInRange = mooringRangeStart && mooringRangeEnd && 
                      !isBefore(day, mooringRangeStart) && !isAfter(day, mooringRangeEnd);
                    const isHovered = mooringRangeStart && !mooringRangeEnd && mooringHoveredDate &&
                      !isBefore(day, mooringRangeStart) && !isAfter(day, mooringHoveredDate);
                    const isBlocked = mooringBlockedDates.some(blockedDate => isSameDay(day, blockedDate));
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const customPrice = mooringCustomPrices[dateKey];
                    const hasCustomPrice = customPrice !== undefined;
                    
                    let bgClass = "bg-white hover:bg-gray-100";
                    let textClass = "text-gray-900";
                    
                    if (isPast) {
                      bgClass = "bg-gray-100";
                      textClass = "text-gray-400";
                    } else if (isBlocked) {
                      bgClass = "bg-red-500";
                      textClass = "text-white font-bold";
                    } else if (isRangeStart || isRangeEnd) {
                      bgClass = "bg-blue-600";
                      textClass = "text-white font-bold";
                    } else if (isInRange) {
                      bgClass = "bg-blue-500";
                      textClass = "text-white";
                    } else if (isHovered) {
                      bgClass = "bg-blue-200";
                      textClass = "text-blue-900";
                    } else if (hasCustomPrice) {
                      bgClass = "bg-green-100 hover:bg-green-200";
                      textClass = "text-green-900";
                    }
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[60px] p-1 border-b border-r cursor-pointer transition-colors ${bgClass} ${isPast ? 'cursor-not-allowed' : ''} flex flex-col`}
                        onClick={() => {
                          if (isPast) return;
                          
                          if (!mooringRangeStart) {
                            setMooringRangeStart(day);
                            setMooringRangeEnd(null);
                          } else if (!mooringRangeEnd) {
                            if (isBefore(day, mooringRangeStart)) {
                              setMooringRangeStart(day);
                            } else {
                              setMooringRangeEnd(day);
                            }
                          } else {
                            setMooringRangeStart(day);
                            setMooringRangeEnd(null);
                          }
                        }}
                        onMouseEnter={() => {
                          if (!isPast && mooringRangeStart && !mooringRangeEnd && !isBefore(day, mooringRangeStart)) {
                            setMooringHoveredDate(day);
                          }
                        }}
                        onMouseLeave={() => setMooringHoveredDate(null)}
                      >
                        <span className={`text-sm ${textClass}`}>{format(day, 'd')}</span>
                        {hasCustomPrice && !isPast && (
                          <span className={`text-xs font-medium ${isBlocked || isRangeStart || isRangeEnd || isInRange ? 'text-white' : 'text-green-700'}`}>
                            €{customPrice}
                          </span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Range selezionato */}
            {mooringRangeStart && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      {mooringRangeEnd ? 'Date selezionate:' : 'Data selezionata (clicca su un\'altra per un intervallo):'}
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {format(mooringRangeStart, 'd MMM yyyy', { locale: it })}
                      {mooringRangeEnd && !isSameDay(mooringRangeStart, mooringRangeEnd) && ` → ${format(mooringRangeEnd, 'd MMM yyyy', { locale: it })}`}
                    </p>
                    {mooringRangeEnd && !isSameDay(mooringRangeStart, mooringRangeEnd) && (
                      <p className="text-sm text-blue-600">
                        {Math.ceil((mooringRangeEnd.getTime() - mooringRangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1} giorni
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!mooringRangeEnd && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setMooringRangeEnd(mooringRangeStart)}
                      >
                        Usa solo questa data
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMooringRangeStart(null);
                        setMooringRangeEnd(null);
                      }}
                    >
                      Annulla
                    </Button>
                  </div>
                </div>

                {mooringRangeEnd && (
                  <div className="space-y-3 pt-3 border-t border-blue-200">
                    {/* Tipo di blocco */}
                    <div className="flex items-center gap-4">
                      <Label className="text-blue-800">Stato:</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={mooringBlockStatus === 'blocked' ? 'default' : 'outline'}
                          className={mooringBlockStatus === 'blocked' ? 'bg-red-600 hover:bg-red-700' : ''}
                          onClick={() => setMooringBlockStatus('blocked')}
                        >
                          🔒 Bloccato
                        </Button>
                        <Button
                          size="sm"
                          variant={mooringBlockStatus === 'available' ? 'default' : 'outline'}
                          className={mooringBlockStatus === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => setMooringBlockStatus('available')}
                        >
                          ✅ Disponibile
                        </Button>
                      </div>
                    </div>

                    {/* Prezzo personalizzato */}
                    <div className="flex items-center gap-4">
                      <Label className="text-blue-800">Prezzo speciale:</Label>
                      <div className="relative flex-1 max-w-[200px]">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder={selectedMooringForCalendar?.pricePerDay?.toString() || "Prezzo base"}
                          value={mooringPriceOverride}
                          onChange={(e) => setMooringPriceOverride(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <span className="text-sm text-blue-600">/giorno</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Legenda */}
            <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                Bloccato ({mooringBlockedDates.length})
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                Prezzo speciale ({Object.keys(mooringCustomPrices).length})
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                Selezionato
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border rounded"></div>
                Disponibile
              </span>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMooringCalendarModal(false);
                  setSelectedMooringForCalendar(null);
                  setMooringRangeStart(null);
                  setMooringRangeEnd(null);
                }}
              >
                Chiudi
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                disabled={!mooringRangeStart || !mooringRangeEnd}
                onClick={() => {
                  if (mooringRangeStart && mooringRangeEnd) {
                    const days = Math.ceil((mooringRangeEnd.getTime() - mooringRangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const rangeDates = eachDayOfInterval({ start: mooringRangeStart, end: mooringRangeEnd });
                    
                    if (mooringBlockStatus === 'blocked') {
                      setMooringBlockedDates(prev => {
                        const newDates = [...prev];
                        rangeDates.forEach(date => {
                          if (!newDates.some(d => isSameDay(d, date))) {
                            newDates.push(date);
                          }
                        });
                        return newDates;
                      });
                    } else {
                      setMooringBlockedDates(prev => 
                        prev.filter(d => !rangeDates.some(rd => isSameDay(rd, d)))
                      );
                    }
                    
                    if (mooringPriceOverride) {
                      const priceValue = parseFloat(mooringPriceOverride);
                      setMooringCustomPrices(prev => {
                        const newPrices = { ...prev };
                        rangeDates.forEach(date => {
                          const key = format(date, 'yyyy-MM-dd');
                          newPrices[key] = priceValue;
                        });
                        return newPrices;
                      });
                    }
                    
                    toast({
                      title: mooringBlockStatus === 'blocked' ? "Date bloccate" : "Disponibilità salvata",
                      description: `${days} giorni ${mooringBlockStatus === 'blocked' ? 'bloccati' : 'impostati come disponibili'}${mooringPriceOverride ? ` a €${mooringPriceOverride}/giorno` : ''}`,
                    });
                    setMooringRangeStart(null);
                    setMooringRangeEnd(null);
                    setMooringPriceOverride("");
                  }
                }}
              >
                {mooringBlockStatus === 'blocked' ? '🔒 Blocca date' : '✅ Salva disponibilità'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Calendario Disponibilità Esperienze */}
      <Dialog open={showExperienceCalendarModal} onOpenChange={(open) => {
        setShowExperienceCalendarModal(open);
        if (!open) {
          setSelectedExperienceForCalendar(null);
          setExperienceRangeStart(null);
          setExperienceRangeEnd(null);
          setExperienceHoveredDate(null);
          setExperienceBlockStatus('blocked');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-coral" />
              Gestione Disponibilità Esperienza
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {selectedExperienceForCalendar?.name} - {selectedExperienceForCalendar?.location}
            </p>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Istruzioni */}
            <div className="bg-coral/10 p-3 rounded-lg text-sm text-coral">
              <strong>Come funziona:</strong> Clicca su una data di inizio, poi su una data di fine per selezionare un intervallo. Le date selezionate verranno evidenziate in blu.
            </div>

            {/* Navigazione mese */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExperienceCalendarMonth(subMonths(experienceCalendarMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg">
                {format(experienceCalendarMonth, 'MMMM yyyy', { locale: it })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExperienceCalendarMonth(addMonths(experienceCalendarMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendario custom con griglia */}
            <div className="border rounded-lg overflow-hidden">
              {/* Header giorni settimana */}
              <div className="grid grid-cols-7 bg-gray-100">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Griglia giorni */}
              <div className="grid grid-cols-7">
                {(() => {
                  const monthStart = startOfMonth(experienceCalendarMonth);
                  const monthEnd = endOfMonth(experienceCalendarMonth);
                  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                  
                  const startDayOfWeek = getDay(monthStart);
                  const emptyDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
                  
                  const allCells = [
                    ...Array(emptyDays).fill(null),
                    ...days
                  ];
                  
                  return allCells.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="min-h-[50px] bg-gray-50 border-b border-r"></div>;
                    }
                    
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isPast = isBefore(day, today);
                    
                    const isRangeStart = experienceRangeStart && isSameDay(day, experienceRangeStart);
                    const isRangeEnd = experienceRangeEnd && isSameDay(day, experienceRangeEnd);
                    const isInRange = experienceRangeStart && experienceRangeEnd && 
                      !isBefore(day, experienceRangeStart) && !isAfter(day, experienceRangeEnd);
                    const isHovered = experienceRangeStart && !experienceRangeEnd && experienceHoveredDate &&
                      !isBefore(day, experienceRangeStart) && !isAfter(day, experienceHoveredDate);
                    const isBlocked = experienceBlockedDates.some(blockedDate => isSameDay(day, blockedDate));
                    
                    let bgClass = "bg-white hover:bg-gray-100";
                    let textClass = "text-gray-900";
                    
                    if (isPast) {
                      bgClass = "bg-gray-100";
                      textClass = "text-gray-400";
                    } else if (isBlocked) {
                      bgClass = "bg-red-500";
                      textClass = "text-white font-bold";
                    } else if (isRangeStart || isRangeEnd) {
                      bgClass = "bg-coral";
                      textClass = "text-white font-bold";
                    } else if (isInRange) {
                      bgClass = "bg-coral/70";
                      textClass = "text-white";
                    } else if (isHovered) {
                      bgClass = "bg-coral/30";
                      textClass = "text-coral";
                    }
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`min-h-[60px] p-1 border-b border-r cursor-pointer transition-colors ${bgClass} ${isPast ? 'cursor-not-allowed' : ''} flex flex-col`}
                        onClick={() => {
                          if (isPast) return;
                          
                          if (!experienceRangeStart) {
                            setExperienceRangeStart(day);
                            setExperienceRangeEnd(null);
                          } else if (!experienceRangeEnd) {
                            if (isBefore(day, experienceRangeStart)) {
                              setExperienceRangeStart(day);
                            } else {
                              setExperienceRangeEnd(day);
                            }
                          } else {
                            setExperienceRangeStart(day);
                            setExperienceRangeEnd(null);
                          }
                        }}
                        onMouseEnter={() => {
                          if (experienceRangeStart && !experienceRangeEnd && !isPast) {
                            setExperienceHoveredDate(day);
                          }
                        }}
                      >
                        <span className={`text-sm font-medium ${textClass}`}>
                          {format(day, 'd')}
                        </span>
                        {isBlocked && (
                          <span className="text-[10px] text-white">Bloccato</span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Opzioni quando range selezionato */}
            {experienceRangeStart && experienceRangeEnd && (
              <div className="bg-coral/10 p-4 rounded-lg space-y-4">
                <p className="font-medium text-coral">
                  Periodo selezionato: {format(experienceRangeStart, 'dd MMM', { locale: it })} - {format(experienceRangeEnd, 'dd MMM yyyy', { locale: it })}
                </p>
                
                {/* Status toggle */}
                <div className="flex items-center gap-4">
                  <Label className="text-coral">Imposta come:</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={experienceBlockStatus === 'blocked' ? 'default' : 'outline'}
                      className={experienceBlockStatus === 'blocked' ? 'bg-red-600 hover:bg-red-700' : ''}
                      onClick={() => setExperienceBlockStatus('blocked')}
                    >
                      🔒 Bloccato
                    </Button>
                    <Button
                      size="sm"
                      variant={experienceBlockStatus === 'available' ? 'default' : 'outline'}
                      className={experienceBlockStatus === 'available' ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={() => setExperienceBlockStatus('available')}
                    >
                      ✅ Disponibile
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Legenda */}
            <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                Bloccato ({experienceBlockedDates.length})
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-coral rounded"></div>
                Selezionato
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border rounded"></div>
                Disponibile
              </span>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExperienceCalendarModal(false);
                  setSelectedExperienceForCalendar(null);
                  setExperienceRangeStart(null);
                  setExperienceRangeEnd(null);
                }}
              >
                Chiudi
              </Button>
              <Button
                className="bg-coral hover:bg-orange-600"
                disabled={!experienceRangeStart || !experienceRangeEnd}
                onClick={() => {
                  if (experienceRangeStart && experienceRangeEnd) {
                    const days = Math.ceil((experienceRangeEnd.getTime() - experienceRangeStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const rangeDates = eachDayOfInterval({ start: experienceRangeStart, end: experienceRangeEnd });
                    
                    if (experienceBlockStatus === 'blocked') {
                      setExperienceBlockedDates(prev => {
                        const newDates = [...prev];
                        rangeDates.forEach(date => {
                          if (!newDates.some(d => isSameDay(d, date))) {
                            newDates.push(date);
                          }
                        });
                        return newDates;
                      });
                    } else {
                      setExperienceBlockedDates(prev => 
                        prev.filter(d => !rangeDates.some(rd => isSameDay(rd, d)))
                      );
                    }
                    
                    toast({
                      title: experienceBlockStatus === 'blocked' ? "Date bloccate" : "Disponibilità salvata",
                      description: `${days} giorni ${experienceBlockStatus === 'blocked' ? 'bloccati' : 'impostati come disponibili'}`,
                    });
                    setExperienceRangeStart(null);
                    setExperienceRangeEnd(null);
                  }
                }}
              >
                {experienceBlockStatus === 'blocked' ? '🔒 Blocca date' : '✅ Salva disponibilità'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cambia Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password attuale</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nuova password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Conferma nuova password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowChangePasswordDialog(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
              }}>
                Annulla
              </Button>
              <Button className="bg-ocean-blue hover:bg-blue-600" onClick={handleSubmitPasswordChange}>
                Cambia Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gestione Notifiche Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Notifiche prenotazioni</p>
                <p className="text-sm text-gray-600">Ricevi email per nuove prenotazioni</p>
              </div>
              <button
                onClick={() => setBookingNotifications(!bookingNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${bookingNotifications ? 'bg-ocean-blue' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${bookingNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Aggiornamenti e novità</p>
                <p className="text-sm text-gray-600">Ricevi email su nuove funzionalità</p>
              </div>
              <button
                onClick={() => setMarketingNotifications(!marketingNotifications)}
                className={`w-12 h-6 rounded-full transition-colors ${marketingNotifications ? 'bg-ocean-blue' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${marketingNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNotificationsDialog(false)}>
                Annulla
              </Button>
              <Button className="bg-ocean-blue hover:bg-blue-600" onClick={handleSaveNotifications}>
                Salva Preferenze
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
