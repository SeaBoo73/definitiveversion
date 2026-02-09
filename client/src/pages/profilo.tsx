import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
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
  Camera
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

  const { data: bookingsData } = useQuery<{ bookings: any[] }>({
    queryKey: ["/api/owner/bookings"],
    enabled: isOwner,
  });

  const ownerEarnings = isOwner ? (bookingsData?.bookings || [])
    .filter((b: any) => b.status === 'completed')
    .reduce((sum: number, b: any) => sum + (b.totalPrice * 0.85), 0) : 0;
  
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
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifBooking, setNotifBooking] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  const settingsItems = [
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
    {
      icon: User,
      title: "Informazioni personali",
      subtitle: "Nome, email, telefono",
      action: () => setShowEditDialog(true)
    },
    {
      icon: CreditCard,
      title: user?.role === "owner" ? "Dati Bancari" : "Metodi di Pagamento",
      subtitle: user?.role === "owner" ? "IBAN per ricevere pagamenti" : "Carte e metodi di pagamento",
      href: user?.role === "owner" ? "/profilo/dati-bancari" : "/metodi-pagamento-mobile"
    },
    {
      icon: Bell,
      title: "Notifiche",
      subtitle: "Gestisci le notifiche",
      action: () => setShowNotificheDialog(true)
    },
    {
      icon: Shield,
      title: "Privacy e sicurezza",
      subtitle: "Impostazioni account",
      href: "/privacy-policy"
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
                    <div className="flex items-center text-sm text-yellow-500">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
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


        {/* Guadagni Totali - Solo Owner */}
        {isOwner && (
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

        {/* Impostazioni */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Impostazioni account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className={`flex items-center p-3 rounded-lg transition-colors ${
                  item.danger 
                    ? 'hover:bg-red-50 cursor-pointer' 
                    : 'hover:bg-gray-50'
                }`}>
                  <Icon className={`h-5 w-5 mr-3 ${item.danger ? 'text-red-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>{item.title}</div>
                    <div className={`text-sm ${item.danger ? 'text-red-500' : 'text-gray-500'}`}>{item.subtitle}</div>
                  </div>
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
        </Card>

        {/* Assistenza - IA e Aiuto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assistenza e Supporto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {assistanceItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Icon className={`h-5 w-5 mr-3 ${item.color}`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              );
              
              return (
                <Link key={index} href={item.href}>
                  <a>{content}</a>
                </Link>
              );
            })}
          </CardContent>
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
                onClick={() => {
                  toast({ title: "Notifiche aggiornate", description: "Le preferenze sono state salvate" });
                  setShowNotificheDialog(false);
                }}
              >
                Salva preferenze
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}