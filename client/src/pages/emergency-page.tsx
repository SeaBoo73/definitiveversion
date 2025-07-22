import { EmergencySystem } from "@/components/emergency-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Phone, AlertTriangle, MapPin, Users, Clock } from "lucide-react";
import { Link } from "wouter";

export default function EmergencyPage() {
  // Mock user data - in real app, get from auth context
  const userId = 1;
  const currentBooking = 123; // Mock booking ID

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema di Emergenza</h1>
            <p className="text-gray-600 mt-2">
              Assistenza e sicurezza per la navigazione
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Torna alla Dashboard
              </Link>
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              <Phone className="mr-2 h-4 w-4" />
              Emergenza: 1530
            </Button>
          </div>
        </div>
      </div>

      {/* Emergency Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Sistema Attivo</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Online</div>
            <p className="text-xs text-green-600">Monitoraggio 24/7</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Tempo Risposta</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">&lt; 5min</div>
            <p className="text-xs text-blue-600">Tempo medio di risposta</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Guardia Costiera</CardTitle>
            <Phone className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">1530</div>
            <p className="text-xs text-orange-600">Numero emergenze</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Assistenza</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">24/7</div>
            <p className="text-xs text-purple-600">Supporto continuo</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Types Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🆘 Tipi di Emergenza</CardTitle>
          <CardDescription>
            Guida per classificare correttamente le emergenze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-red-500">CRITICA</Badge>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <h4 className="font-medium text-red-700 mb-2">Emergenza Immediata</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Pericolo di vita</li>
                <li>• Incendio a bordo</li>
                <li>• Collisione grave</li>
                <li>• Persona in mare</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-orange-500">ALTA</Badge>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <h4 className="font-medium text-orange-700 mb-2">Situazione Seria</h4>
              <ul className="text-sm text-orange-600 space-y-1">
                <li>• Avaria motore in mare aperto</li>
                <li>• Perdita di orientamento</li>
                <li>• Maltempo improvviso</li>
                <li>• Problemi medici</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-yellow-500">MEDIA</Badge>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </div>
              <h4 className="font-medium text-yellow-700 mb-2">Serve Assistenza</h4>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Problemi meccanici minori</li>
                <li>• Richiesta informazioni</li>
                <li>• Difficoltà ancoraggio</li>
                <li>• Carburante in esaurimento</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-green-500">BASSA</Badge>
                <Shield className="h-4 w-4 text-green-500" />
              </div>
              <h4 className="font-medium text-green-700 mb-2">Non Urgente</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Consigli di navigazione</li>
                <li>• Informazioni meteo</li>
                <li>• Supporto tecnico</li>
                <li>• Assistenza generale</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Emergency System */}
      <EmergencySystem bookingId={currentBooking} userId={userId} />

      {/* Safety Protocols */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📋 Protocolli di Sicurezza</CardTitle>
          <CardDescription>
            Procedure standardizzate per la gestione delle emergenze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                Emergenza Critica
              </h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. Chiama immediatamente 1530</li>
                <li>2. Comunica posizione precisa</li>
                <li>3. Descrivi la situazione chiaramente</li>
                <li>4. Segui le istruzioni della Guardia Costiera</li>
                <li>5. Rimani in contatto radio</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Problema Non Critico
              </h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. Usa il sistema di segnalazione SeaGO</li>
                <li>2. Descrivi il problema dettagliatamente</li>
                <li>3. Fornisci la tua posizione GPS</li>
                <li>4. Attendi assistenza telefonica</li>
                <li>5. Segui le istruzioni ricevute</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                Informazioni Richieste
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Posizione GPS precisa</li>
                <li>• Nome dell'imbarcazione</li>
                <li>• Numero di persone a bordo</li>
                <li>• Natura del problema</li>
                <li>• Condizioni meteo locali</li>
                <li>• Equipaggiamento disponibile</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">📞 Contatti di Emergenza</CardTitle>
          <CardDescription className="text-blue-600">
            Numeri utili per la sicurezza in mare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-red-600">🚨 Guardia Costiera</h4>
              <p className="text-xl font-bold">1530</p>
              <p className="text-sm text-gray-600">Emergenze in mare</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-blue-600">🏥 Emergenza Sanitaria</h4>
              <p className="text-xl font-bold">118</p>
              <p className="text-sm text-gray-600">Soccorso medico</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-green-600">⚓ Assistenza SeaGO</h4>
              <p className="text-xl font-bold">+39 06 123456</p>
              <p className="text-sm text-gray-600">Support 24/7</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-purple-600">🌊 Capitaneria</h4>
              <p className="text-xl font-bold">06 12345678</p>
              <p className="text-sm text-gray-600">Porto di Civitavecchia</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-orange-600">⛽ Rifornimento</h4>
              <p className="text-xl font-bold">+39 320 1234567</p>
              <p className="text-sm text-gray-600">Carburante d'emergenza</p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-bold text-indigo-600">🔧 Assistenza Tecnica</h4>
              <p className="text-xl font-bold">+39 348 7654321</p>
              <p className="text-sm text-gray-600">Riparazioni urgenti</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}