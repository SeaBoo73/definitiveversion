import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useOwnerMode } from "@/hooks/use-owner-mode";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Settings, 
  Heart, 
  Calendar, 
  Ship, 
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  MapPin,
  Bot,
  MessageCircle,
  AlertTriangle,
  Euro,
  TrendingUp,
  Camera,
  Receipt,
  Mail,
  Phone,
  CheckCircle,
  ChevronDown
} from "lucide-react";

export default function ProfiloPage() {
  console.log("PROFILO VERSION 2.0");
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user?.firstName || "");
  const [editLastName, setEditLastName] = useState(user?.lastName || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editResidenceAddress, setEditResidenceAddress] = useState(user?.residenceAddress || "");
  const [editBillingAddress, setEditBillingAddress] = useState(user?.billingAddress || "");
  const [billingSameAsResidence, setBillingSameAsResidence] = useState(user?.billingAddressSameAsResidence !== false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('/api/user/profile-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload fallito');
      toast({ title: "Foto aggiornata", description: "La tua foto profilo è stata cambiata" });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile caricare la foto", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phone: string; residenceAddress: string; billingAddress: string; billingAddressSameAsResidence: boolean }) => {
      return await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({ title: "Profilo aggiornato", description: "Le modifiche sono state salvate" });
      setShowEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message || "Impossibile aggiornare il profilo", variant: "destructive" });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ 
      firstName: editFirstName, 
      lastName: editLastName, 
      phone: editPhone,
      residenceAddress: editResidenceAddress,
      billingAddress: billingSameAsResidence ? editResidenceAddress : editBillingAddress,
      billingAddressSameAsResidence: billingSameAsResidence,
    });
  };

  const isOwner = user?.role === "owner";
  const { isOwnerMode } = useOwnerMode();

  const { data: bookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
    enabled: isOwner,
  });

  const ownerEarnings = isOwner ? (bookingsData?.bookings || [])
    .filter((b: any) => b.status === 'completed')
    .reduce((sum: number, b: any) => sum + (b.totalPrice * 0.85), 0) : 0;

  const { data: customerBookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });
  const customerBookings = customerBookingsData?.bookings || [];

  const { data: customerFavoritesData } = useQuery<any[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });
  const customerFavorites = Array.isArray(customerFavoritesData) ? customerFavoritesData : [];

  const upcomingBookings = customerBookings.filter((b: any) => {
    const startDate = new Date(b.startDate);
    return startDate >= new Date() && b.status !== 'cancelled';
  });

  const totalSpent = customerBookings
    .filter((b: any) => b.status === 'completed')
    .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

  const { data: userReviews = [] } = useQuery<any[]>({
    queryKey: ['/api/reviews/user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/user/${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  const avgRating = userReviews.length > 0
    ? (userReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / userReviews.length).toFixed(1)
    : null;
  
  const menuItems = [
    ...(!isOwner ? [{
      icon: Calendar,
      title: "Le mie prenotazioni",
      subtitle: "Gestisci le tue prenotazioni",
      href: "/customer-dashboard",
      color: "text-blue-600"
    }] : [])
  ];

  const assistanceItems = [
    {
      icon: Bot,
      title: "Assistente IA",
      subtitle: "Consigli intelligenti e raccomandazioni",
      href: "/ia",
      color: "text-blue-600"
    },
    {
      icon: HelpCircle,
      title: "Come funziona SeaBoo",
      subtitle: "Guida completa in 3 passaggi",
      href: "/come-funziona",
      color: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: "Centro Assistenza",
      subtitle: "FAQ e supporto",
      href: "/aiuto",
      color: "text-green-600"
    }
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNotificheDialog, setShowNotificheDialog] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showVerificaDialog, setShowVerificaDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyingType, setVerifyingType] = useState<'email' | 'phone' | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  const { data: notifPrefs } = useQuery<{ notifEmail: boolean; notifPush: boolean; notifBooking: boolean; notifPromo: boolean }>({
    queryKey: ['/api/user/notifications'],
    enabled: !!user,
  });

  useEffect(() => {
    if (notifPrefs) {
      setNotifEmail(notifPrefs.notifEmail);
      setNotifPush(notifPrefs.notifPush);
      setNotifBooking(notifPrefs.notifBooking);
      setNotifPromo(notifPrefs.notifPromo);
    }
  }, [notifPrefs]);

  const saveNotifMutation = useMutation({
    mutationFn: async (prefs: { notifEmail: boolean; notifPush: boolean; notifBooking: boolean; notifPromo: boolean }) => {
      await apiRequest('PATCH', '/api/user/notifications', prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/notifications'] });
      toast({ title: "Notifiche aggiornate", description: "Le preferenze sono state salvate" });
      setShowNotificheDialog(false);
    },
    onError: () => {
      toast({ title: "Errore", description: "Impossibile salvare le preferenze", variant: "destructive" });
    },
  });

  const { data: verificationStatus, refetch: refetchVerification } = useQuery<{ emailVerified: boolean; phoneVerified: boolean; hasPhone: boolean; hasEmail: boolean; phone: string | null; email: string | null }>({
    queryKey: ['/api/verification/status'],
    enabled: !!user,
  });

  const sendEmailCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/verification/send-email');
      return res.json();
    },
    onSuccess: () => {
      setCodeSent(true);
      setVerifyingType('email');
      toast({ title: "Codice inviato", description: "Controlla la tua email per il codice di verifica" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message || "Impossibile inviare il codice", variant: "destructive" });
    },
  });

  const sendPhoneCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/verification/send-phone');
      return res.json();
    },
    onSuccess: () => {
      setCodeSent(true);
      setVerifyingType('phone');
      toast({ title: "Codice inviato", description: "Codice di verifica inviato (controlla email o SMS)" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message || "Impossibile inviare il codice", variant: "destructive" });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ code, type }: { code: string; type: 'email' | 'phone' }) => {
      const res = await apiRequest('POST', '/api/verification/verify', { code, type });
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({ title: "Verificato!", description: data.message });
      setCodeSent(false);
      setVerifyingType(null);
      setVerificationCode("");
      refetchVerification();
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message || "Codice non valido", variant: "destructive" });
    },
  });

  const mainItems = [
    {
      icon: Receipt,
      title: "Le mie prenotazioni",
      subtitle: "Prenotazioni, ricevute e storico viaggi",
      href: "/customer-dashboard",
      color: "text-ocean-blue"
    },
    {
      icon: Heart,
      title: "Lista dei preferiti",
      subtitle: "Barche, ormeggi ed esperienze salvate",
      href: "/preferiti",
      color: "text-red-500"
    },
    {
      icon: Star,
      title: "Le mie recensioni",
      subtitle: "Recensioni lasciate e ricevute",
      href: "/mie-recensioni",
      color: "text-yellow-500"
    },
    ...(user?.role === "owner" && isOwnerMode ? [{
      icon: Receipt,
      title: "Report mensili",
      subtitle: "Genera e scarica report dei guadagni",
      href: "/report-mensili",
      color: "text-orange-500"
    }] : []),
  ];

  const accountSettingsItems = [
    {
      icon: User,
      title: "Informazioni personali",
      subtitle: "Nome, email, telefono",
      action: () => setShowEditDialog(true),
      color: "text-blue-500"
    },
    {
      icon: CreditCard,
      title: user?.role === "owner" ? "Dati Bancari" : "Metodi di Pagamento",
      subtitle: user?.role === "owner" ? "IBAN per ricevere pagamenti" : "Carte e metodi di pagamento",
      href: user?.role === "owner" ? "/profilo/dati-bancari" : "/metodi-pagamento-mobile",
      color: "text-indigo-500"
    },
    {
      icon: Bell,
      title: "Notifiche",
      subtitle: "Gestisci le notifiche",
      action: () => setShowNotificheDialog(true),
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Verifica account",
      subtitle: verificationStatus?.emailVerified && verificationStatus?.phoneVerified 
        ? "Email e telefono verificati" 
        : "Verifica email e numero di telefono",
      action: () => { setShowVerificaDialog(true); setCodeSent(false); setVerifyingType(null); setVerificationCode(""); },
      badge: verificationStatus?.emailVerified && verificationStatus?.phoneVerified ? "verified" : "unverified",
    },
    {
      icon: AlertTriangle,
      title: "Elimina account",
      subtitle: "Rimuovi permanentemente il tuo account",
      action: () => setShowDeleteDialog(true),
      danger: true
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <Header />
        
        {/* Banner ottimizzato senza spazi e testo leggibile */}
        <div className="bg-gradient-to-r from-ocean-blue to-deep-navy text-white">
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4 leading-tight">
                Accedi a SeaBoo
              </h1>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Gestisci prenotazioni, barche preferite e le tue esperienze di navigazione
              </p>
              <Link href="/auth">
                <Button className="w-full bg-white text-ocean-blue hover:bg-gray-100 font-semibold py-3 text-lg shadow-lg">
                  Accedi al tuo profilo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profilo Header */}
                <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="h-16 w-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}{user.lastName?.charAt(0) || ''}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                  </h1>
                  <p className="text-gray-600 text-sm truncate">{user.email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {avgRating ? (
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                        <span className="font-semibold">{avgRating}</span>
                        <span className="text-gray-400 text-xs ml-1">({userReviews.length})</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="text-xs">Nessuna recensione</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Membro dal 2025</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start sm:self-center flex-shrink-0"
                onClick={() => {
                  setEditFirstName(user.firstName || "");
                  setEditLastName(user.lastName || "");
                  setEditPhone(user.phone || "");
                  setShowEditDialog(true);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Modifica
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Guadagni Totali - Solo Owner in modalità SeaHost */}
        {isOwner && isOwnerMode && (
          <Link href="/guadagni">
            <a>
              <Card className="mb-6 cursor-pointer transition-all hover:shadow-md border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Euro className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guadagni totali</p>
                        <p className="text-2xl font-bold text-emerald-700">€{ownerEarnings.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </Link>
        )}

        {/* Statistiche cliente - solo in modalità viaggio */}
        {(!isOwner || !isOwnerMode) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/customer-dashboard')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Ship className="h-7 w-7 text-ocean-blue" />
                  <div>
                    <p className="text-xs text-gray-500">Prenotazioni</p>
                    <p className="text-xl font-bold text-gray-900">{customerBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/customer-dashboard')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-7 w-7 text-seafoam" />
                  <div>
                    <p className="text-xs text-gray-500">In arrivo</p>
                    <p className="text-xl font-bold text-gray-900">{upcomingBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/preferiti')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-7 w-7 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Preferiti</p>
                    <p className="text-xl font-bold text-gray-900">{customerFavorites.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Euro className="h-7 w-7 text-emerald-500" />
                  <div>
                    <p className="text-xs text-gray-500">Spesa totale</p>
                    <p className="text-xl font-bold text-gray-900">€{totalSpent.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Voci principali */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-1">
            {mainItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Icon className={`h-5 w-5 mr-3 ${item.color || 'text-gray-600'}`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              );
              return item.href ? (
                <Link key={index} href={item.href}>
                  <a>{content}</a>
                </Link>
              ) : (
                <div key={index}>{content}</div>
              );
            })}
          </CardContent>
        </Card>

        {/* Impostazioni account - sezione espandibile */}
        <Card className="mb-6">
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
            onClick={() => setShowAccountSettings(!showAccountSettings)}
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="font-semibold text-gray-900">Impostazioni account</div>
                <div className="text-sm text-gray-500">Gestisci il tuo profilo e le preferenze</div>
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showAccountSettings ? 'rotate-180' : ''}`} />
          </div>
          {showAccountSettings && (
            <CardContent className="pt-0 space-y-1">
              {accountSettingsItems.map((item, index) => {
                const Icon = item.icon;
                const badge = (item as any).badge;
                const content = (
                  <div className={`flex items-center p-3 rounded-lg transition-colors ${
                    item.danger 
                      ? 'hover:bg-red-50 cursor-pointer' 
                      : 'hover:bg-gray-50'
                  }`}>
                    <Icon className={`h-5 w-5 mr-3 ${item.danger ? 'text-red-600' : badge === 'verified' ? 'text-green-600' : item.color || 'text-gray-600'}`} />
                    <div className="flex-1">
                      <div className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>{item.title}</div>
                      <div className={`text-sm ${item.danger ? 'text-red-500' : 'text-gray-500'}`}>{item.subtitle}</div>
                    </div>
                    {badge === 'verified' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2 font-medium">Verificato</span>
                    )}
                    {badge === 'unverified' && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mr-2 font-medium">Da verificare</span>
                    )}
                    <ChevronRight className={`h-5 w-5 ${item.danger ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                );
                
                if (item.action) {
                  return (
                    <div key={index} onClick={item.action}>
                      {content}
                    </div>
                  );
                }
                
                return item.href ? (
                  <Link key={index} href={item.href}>
                    <a>{content}</a>
                  </Link>
                ) : (
                  <div key={index}>{content}</div>
                );
              })}
            </CardContent>
          )}
        </Card>

        {/* Logout */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Esci dall'account
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Delete Account Dialog - Controllato dal menu */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Questa azione non può essere annullata. Eliminerà permanentemente il tuo
                account e rimuoverà tutti i tuoi dati dai nostri server.
              </p>
              <p className="font-semibold text-red-600">
                Tutte le tue prenotazioni, barche (se sei proprietario) e dati personali
                verranno eliminati definitivamente.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-menu">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete-menu"
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? "Eliminazione..." : "Sì, elimina il mio account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto mb-20">
          <DialogHeader>
            <DialogTitle>Modifica profilo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  {user?.profileImage && (
                    <AvatarImage src={user.profileImage} alt="Foto profilo" className="object-cover" />
                  )}
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {user?.firstName?.[0] || user?.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 bg-ocean-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </div>
              {uploadingPhoto && <p className="text-sm text-gray-500">Caricamento...</p>}
              <p className="text-sm text-gray-500">Tocca l'icona per cambiare foto</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="edit-firstName">Nome</Label>
              <Input
                id="edit-firstName"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                placeholder="Il tuo nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName">Cognome</Label>
              <Input
                id="edit-lastName"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                placeholder="Il tuo cognome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telefono</Label>
              <Input
                id="edit-phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+39 123 456 7890"
                type="tel"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="edit-residence">Indirizzo di residenza</Label>
              <Input
                id="edit-residence"
                value={editResidenceAddress}
                onChange={(e) => setEditResidenceAddress(e.target.value)}
                placeholder="Via Roma 1, 00100 Roma (RM)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="billing-same"
                checked={billingSameAsResidence}
                onCheckedChange={(checked) => setBillingSameAsResidence(checked === true)}
              />
              <Label htmlFor="billing-same" className="text-sm font-normal cursor-pointer">
                Indirizzo di fatturazione uguale a quello di residenza
              </Label>
            </div>
            {!billingSameAsResidence && (
              <div className="space-y-2">
                <Label htmlFor="edit-billing">Indirizzo di fatturazione</Label>
                <Input
                  id="edit-billing"
                  value={editBillingAddress}
                  onChange={(e) => setEditBillingAddress(e.target.value)}
                  placeholder="Via Milano 2, 20100 Milano (MI)"
                />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>
                Annulla
              </Button>
              <Button 
                className="flex-1 bg-ocean-blue hover:bg-blue-600"
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificheDialog} onOpenChange={setShowNotificheDialog}>
        <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto mb-20">
          <DialogHeader>
            <DialogTitle>Impostazioni Notifiche</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifiche email</p>
                <p className="text-sm text-gray-500">Ricevi aggiornamenti via email</p>
              </div>
              <Checkbox checked={notifEmail} onCheckedChange={(c) => setNotifEmail(c === true)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notifiche push</p>
                <p className="text-sm text-gray-500">Ricevi notifiche sul dispositivo</p>
              </div>
              <Checkbox checked={notifPush} onCheckedChange={(c) => setNotifPush(c === true)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Prenotazioni</p>
                <p className="text-sm text-gray-500">Aggiornamenti su prenotazioni e pagamenti</p>
              </div>
              <Checkbox checked={notifBooking} onCheckedChange={(c) => setNotifBooking(c === true)} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Promozioni</p>
                <p className="text-sm text-gray-500">Offerte speciali e novità SeaBoo</p>
              </div>
              <Checkbox checked={notifPromo} onCheckedChange={(c) => setNotifPromo(c === true)} />
            </div>
            <div className="pt-2">
              <Button 
                className="w-full bg-ocean-blue hover:bg-blue-600"
                disabled={saveNotifMutation.isPending}
                onClick={() => {
                  saveNotifMutation.mutate({ notifEmail, notifPush, notifBooking, notifPromo });
                }}
              >
                {saveNotifMutation.isPending ? "Salvataggio..." : "Salva preferenze"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVerificaDialog} onOpenChange={setShowVerificaDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto mb-20">
          <DialogHeader>
            <DialogTitle>Verifica Account</DialogTitle>
            <p className="text-sm text-gray-500">Verifica la tua identità per una maggiore sicurezza e per sbloccare tutte le funzionalità</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{verificationStatus?.email || user?.email || "Non impostata"}</p>
                  </div>
                </div>
                {verificationStatus?.emailVerified ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Verificata
                  </span>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={sendEmailCodeMutation.isPending || (codeSent && verifyingType === 'email')}
                    onClick={() => sendEmailCodeMutation.mutate()}
                  >
                    {sendEmailCodeMutation.isPending ? "Invio..." : "Verifica"}
                  </Button>
                )}
              </div>
              {codeSent && verifyingType === 'email' && (
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Inserisci codice a 6 cifre"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      disabled={verificationCode.length !== 6 || verifyCodeMutation.isPending}
                      onClick={() => verifyCodeMutation.mutate({ code: verificationCode, type: 'email' })}
                    >
                      {verifyCodeMutation.isPending ? "..." : "Conferma"}
                    </Button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => { setCodeSent(false); setVerificationCode(""); setVerifyingType(null); }}
                  >
                    Richiedi nuovo codice
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Telefono</p>
                    <p className="text-sm text-gray-500">{verificationStatus?.phone || user?.phone || "Non impostato"}</p>
                  </div>
                </div>
                {verificationStatus?.phoneVerified ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Verificato
                  </span>
                ) : !verificationStatus?.hasPhone ? (
                  <Button size="sm" variant="outline" onClick={() => { setShowVerificaDialog(false); setShowEditDialog(true); }}>
                    Aggiungi
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={sendPhoneCodeMutation.isPending || (codeSent && verifyingType === 'phone')}
                    onClick={() => sendPhoneCodeMutation.mutate()}
                  >
                    {sendPhoneCodeMutation.isPending ? "Invio..." : "Verifica"}
                  </Button>
                )}
              </div>
              {codeSent && verifyingType === 'phone' && (
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Inserisci codice a 6 cifre"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      disabled={verificationCode.length !== 6 || verifyCodeMutation.isPending}
                      onClick={() => verifyCodeMutation.mutate({ code: verificationCode, type: 'phone' })}
                    >
                      {verifyCodeMutation.isPending ? "..." : "Conferma"}
                    </Button>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => { setCodeSent(false); setVerificationCode(""); setVerifyingType(null); }}
                  >
                    Richiedi nuovo codice
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                La verifica protegge il tuo account e sblocca l'accesso completo ai dati di contatto degli altri utenti solo dopo la conferma di una prenotazione.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}