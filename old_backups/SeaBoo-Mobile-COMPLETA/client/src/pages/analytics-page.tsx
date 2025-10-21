import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Eye, BarChart3, LineChart, PieChart } from "lucide-react";
import { Link } from "wouter";

export default function AnalyticsPage() {
  // Mock user ID - in real app, get from auth context
  const ownerId = 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Performance</h1>
            <p className="text-gray-600 mt-2">
              Monitora le performance delle tue imbarcazioni e ottimizza i ricavi
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                Torna alla Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/boats/manage">
                Gestisci Barche
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vista Rapida</CardTitle>
            <Eye className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dashboard</div>
            <p className="text-xs opacity-80">Monitoraggio in tempo reale</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ricavi</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Analisi</div>
            <p className="text-xs opacity-80">Performance finanziarie</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prenotazioni</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Trend</div>
            <p className="text-xs opacity-80">Andamento prenotazioni</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversioni</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ottimizza</div>
            <p className="text-xs opacity-80">Migliora le performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <BarChart3 className="h-5 w-5" />
              <span>Panoramica</span>
            </CardTitle>
            <CardDescription>Vista generale delle performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge className="bg-blue-100 text-blue-800">Attivo</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5" />
              <span>Ricavi</span>
            </CardTitle>
            <CardDescription>Analisi dettagliata dei ricavi</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Disponibile</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Conversioni</span>
            </CardTitle>
            <CardDescription>Tasso di conversione e ottimizzazione</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Disponibile</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Trend</span>
            </CardTitle>
            <CardDescription>Analisi delle tendenze temporali</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">Disponibile</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Dashboard */}
      <AnalyticsDashboard ownerId={ownerId} />

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>🚀 Azioni Rapide</CardTitle>
          <CardDescription>Strumenti per ottimizzare le tue performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Export Dati</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>Report Mensile</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>Ottimizza Prezzi</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Analizza Clienti</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}