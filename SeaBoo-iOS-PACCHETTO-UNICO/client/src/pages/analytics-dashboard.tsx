import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Users, Calendar as CalendarDays, Anchor } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { it } from 'date-fns/locale';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalBoats: number;
    avgRating: number;
    revenueGrowth: number;
    bookingGrowth: number;
  };
  revenueData: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
  boatPerformance: Array<{
    boatId: number;
    boatName: string;
    revenue: number;
    bookings: number;
    rating: number;
    occupancyRate: number;
  }>;
  categoryStats: Array<{
    category: string;
    revenue: number;
    bookings: number;
    avgPrice: number;
  }>;
  fiscalData: {
    totalIncome: number;
    platformCommission: number;
    netIncome: number;
    taxableIncome: number;
    estimatedTaxes: number;
  };
}

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const { data: analyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics', dateRange, period],
    queryFn: async () => {
      const params = new URLSearchParams({
        from: format(dateRange.from, 'yyyy-MM-dd'),
        to: format(dateRange.to, 'yyyy-MM-dd'),
        period
      });
      
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Errore caricamento analytics');
      return response.json();
    }
  });

  const exportReport = async (type: 'pdf' | 'excel') => {
    try {
      const params = new URLSearchParams({
        from: format(dateRange.from, 'yyyy-MM-dd'),
        to: format(dateRange.to, 'yyyy-MM-dd'),
        type
      });
      
      const response = await fetch(`/api/analytics/export?${params}`);
      if (!response.ok) throw new Error('Errore export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${format(new Date(), 'yyyy-MM-dd')}.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore export:', error);
    }
  };

  const COLORS = ['#0066CC', '#FF9800', '#4CAF50', '#F44336', '#9C27B0', '#FF5722'];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Caricamento analytics...</div>
        </div>
      </div>
    );
  }

  const { overview, revenueData, boatPerformance, categoryStats, fiscalData } = analyticsData || {};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Analisi dettagliata delle performance delle tue imbarcazioni
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd MMM", { locale: it })} -{" "}
                      {format(dateRange.to, "dd MMM yyyy", { locale: it })}
                    </>
                  ) : (
                    format(dateRange.from, "dd MMM yyyy", { locale: it })
                  )
                ) : (
                  <span>Seleziona periodo</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Period Selector */}
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Settimanale</SelectItem>
              <SelectItem value="month">Mensile</SelectItem>
              <SelectItem value="quarter">Trimestrale</SelectItem>
              <SelectItem value="year">Annuale</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('excel')}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato Totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{overview?.totalRevenue?.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {overview?.revenueGrowth && overview.revenueGrowth > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={overview?.revenueGrowth && overview.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {overview?.revenueGrowth?.toFixed(1) || 0}%
              </span>
              <span className="ml-1">vs periodo precedente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prenotazioni</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalBookings || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {overview?.bookingGrowth && overview.bookingGrowth > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={overview?.bookingGrowth && overview.bookingGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                {overview?.bookingGrowth?.toFixed(1) || 0}%
              </span>
              <span className="ml-1">vs periodo precedente</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imbarcazioni Attive</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.totalBoats || 0}</div>
            <p className="text-xs text-muted-foreground">Imbarcazioni pubblicate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valutazione Media</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.avgRating?.toFixed(1) || 0} ⭐
            </div>
            <p className="text-xs text-muted-foreground">Media recensioni clienti</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Ricavi</TabsTrigger>
          <TabsTrigger value="boats">Performance Barche</TabsTrigger>
          <TabsTrigger value="categories">Categorie</TabsTrigger>
          <TabsTrigger value="fiscal">Report Fiscali</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Andamento Ricavi e Prenotazioni</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="revenue" orientation="left" />
                  <YAxis yAxisId="bookings" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `€${value}` : value,
                      name === 'revenue' ? 'Ricavi' : 'Prenotazioni'
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#0066CC"
                    fill="#0066CC"
                    fillOpacity={0.6}
                    name="Ricavi"
                  />
                  <Line
                    yAxisId="bookings"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#FF9800"
                    strokeWidth={3}
                    name="Prenotazioni"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Boats Performance Tab */}
        <TabsContent value="boats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance delle Imbarcazioni</CardTitle>
              <p className="text-sm text-muted-foreground">
                Analisi dettagliata delle performance di ogni imbarcazione
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {boatPerformance?.map((boat, index) => (
                  <div key={boat.boatId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{boat.boatName}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>ID: {boat.boatId}</span>
                          <span>Rating: {boat.rating.toFixed(1)} ⭐</span>
                        </div>
                      </div>
                      <Badge variant={boat.occupancyRate > 70 ? 'default' : boat.occupancyRate > 40 ? 'secondary' : 'destructive'}>
                        {boat.occupancyRate.toFixed(0)}% occupazione
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Ricavi</div>
                        <div className="text-xl font-bold text-green-600">
                          €{boat.revenue.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Prenotazioni</div>
                        <div className="text-xl font-bold">{boat.bookings}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Tasso di Occupazione</div>
                        <div className="mt-2">
                          <Progress value={boat.occupancyRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ricavi per Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="revenue"
                    >
                      {categoryStats?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`€${value}`, 'Ricavi']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiche per Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats?.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <div className="font-medium">{category.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.bookings} prenotazioni
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">€{category.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Avg: €{category.avgPrice.toFixed(0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fiscal Tab */}
        <TabsContent value="fiscal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Riepilogo Fiscale</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Calcoli automatici per la dichiarazione dei redditi
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Ricavi Lordi</span>
                  <span className="font-bold">€{fiscalData?.totalIncome?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Commissioni Piattaforma (15%)</span>
                  <span className="font-bold text-red-600">-€{fiscalData?.platformCommission?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Ricavi Netti</span>
                  <span className="font-bold text-green-600">€{fiscalData?.netIncome?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Reddito Imponibile</span>
                  <span className="font-bold">€{fiscalData?.taxableIncome?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Tasse Stimate (22%)</span>
                  <span className="font-bold text-orange-600">€{fiscalData?.estimatedTaxes?.toLocaleString() || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documenti Fiscali</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Genera report automatici per il commercialista
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportReport('pdf')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Quadro RW - Redditi da Locazione
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportReport('excel')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Registro Entrate/Uscite
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportReport('pdf')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Fatture Emesse
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => exportReport('pdf')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Dichiarazione IVA
                </Button>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    💡 Promemoria Fiscale
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Conserva tutte le ricevute delle spese</p>
                    <p>• Aggiorna regolarmente i dati dell'imbarcazione</p>
                    <p>• Consulta il tuo commercialista per deduzioni</p>
                    <p>• Verificare regime fiscale applicabile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}