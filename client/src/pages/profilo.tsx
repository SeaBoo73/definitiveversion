import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
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
  MessageCircle
} from "lucide-react";

export default function ProfiloPage() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems = [
    {
      icon: Calendar,
      title: "Le mie prenotazioni",
      subtitle: "Gestisci le tue prenotazioni",
      href: "/customer-dashboard",
      color: "text-blue-600"
    },
    {
      icon: Heart,
      title: "Lista dei preferiti",
      subtitle: "Barche salvate",
      href: "/customer-dashboard",
      color: "text-red-500"
    },
    {
      icon: Star,
      title: "Le mie recensioni",
      subtitle: "Recensioni scritte",
      href: "/customer-dashboard",
      color: "text-yellow-500"
    },
    {
      icon: Ship,
      title: "Diventa proprietario",
      subtitle: "Metti in affitto la tua barca",
      href: "/owner-dashboard",
      color: "text-ocean-blue"
    }
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
      title: "Come funziona SeaGO",
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

  const settingsItems = [
    {
      icon: User,
      title: "Informazioni personali",
      subtitle: "Nome, email, telefono",
      href: "/profilo/informazioni"
    },
    {
      icon: CreditCard,
      title: "Pagamenti",
      subtitle: "Carte e metodi di pagamento",
      href: "/metodi-pagamento"
    },
    {
      icon: Bell,
      title: "Notifiche",
      subtitle: "Gestisci le notifiche",
      href: "/profilo/notifiche"
    },
    {
      icon: Shield,
      title: "Privacy e sicurezza",
      subtitle: "Impostazioni account",
      href: "/privacy-policy"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <Header />
        
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accedi al tuo profilo
            </h1>
            <p className="text-gray-600 mb-8">
              Effettua l'accesso per gestire le tue prenotazioni e preferenze
            </p>
            <Link href="/auth">
              <Button className="w-full bg-ocean-blue hover:bg-ocean-blue/90">
                Accedi
              </Button>
            </Link>
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
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Membro dal 2025</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Modifica
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiche Utente */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-ocean-blue">3</div>
              <div className="text-sm text-gray-600">Prenotazioni</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-ocean-blue">8</div>
              <div className="text-sm text-gray-600">Preferiti</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-ocean-blue">4.8</div>
              <div className="text-sm text-gray-600">Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-ocean-blue">2</div>
              <div className="text-sm text-gray-600">Recensioni</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Principale */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>I tuoi servizi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {menuItems.map((item, index) => {
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

        {/* Impostazioni */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Impostazioni account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Icon className="h-5 w-5 mr-3 text-gray-600" />
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

        {/* Logout */}
        <Card>
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

      <Footer />
    </div>
  );
}