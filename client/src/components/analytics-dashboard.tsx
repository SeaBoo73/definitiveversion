import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";
import { 
  TrendingUp, TrendingDown, Eye, Calendar, Euro, Star, 
  Users, Anchor, MessageSquare, Clock 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function AnalyticsDashboard() {
  const { data: analytics = [] } = useQuery({
    queryKey: ['/api/analytics'],
    queryFn: () => apiRequest('/api/analytics')
  });

  // Mock data for demo (replace with real analytics)
  const mockData = {
    overview: {
      totalViews: 1247,
      totalBookings: 23,
      totalRevenue: 5420,
      avgRating: 4.6,
      viewsChange: 12.5,
      bookingsChange: -2.3,
      revenueChange: 18.7,
      ratingChange: 0.2
    },
    monthlyData: [
      { month: 'Gen', views: 245, bookings: 4, revenue: 980 },
      { month: 'Feb', views: 189, bookings: 3, revenue: 756 },
      { month: 'Mar', views: 312, bookings: 6, revenue: 1340 },
      { month: 'Apr', views: 198, bookings: 2, revenue: 489 },
      { month: 'Mag', views: 278, bookings: 5, revenue: 1120 },
      { month: 'Giu', views: 156, bookings: 3, revenue: 735 }
    ],
    boatPerformance: [
      { name: 'Yacht Azzurro', views: 156, bookings: 8, revenue: 2340 },
      { name: 'Gommone Speed', views: 89, bookings: 6, revenue: 890 },
      { name: 'Barca Sole', views: 134, bookings: 5, revenue: 1250 },
      { name: 'Catamarano Dream', views: 203, bookings: 4, revenue: 940 }
    ],
    bookingTypes: [
      { name: 'Giornaliera', value: 65, color: '#0ea5e9' },
      { name: 'Weekend', value: 25, color: '#06b6d4' },
      { name: 'Settimanale', value: 10, color: '#8b5cf6' }
    ]
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `€${val.toLocaleString()}`;
        case 'percentage':
          return `${val}%`;
        default:
          return val.toLocaleString();
      }
    };

    const isPositive = change >= 0;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {formatValue(value)}
                </p>
                <Badge 
                  variant={isPositive ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(change)}%
                </Badge>
              </div>
            </div>
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Visualizzazioni Totali"
          value={mockData.overview.totalViews}
          change={mockData.overview.viewsChange}
          icon={Eye}
        />
        <StatCard
          title="Prenotazioni"
          value={mockData.overview.totalBookings}
          change={mockData.overview.bookingsChange}
          icon={Calendar}
        />
        <StatCard
          title="Ricavi"
          value={mockData.overview.totalRevenue}
          change={mockData.overview.revenueChange}
          icon={Euro}
          format="currency"
        />
        <StatCard
          title="Valutazione Media"
          value={mockData.overview.avgRating}
          change={mockData.overview.ratingChange}
          icon={Star}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Andamento Mensile</TabsTrigger>
          <TabsTrigger value="boats">Performance Barche</TabsTrigger>
          <TabsTrigger value="bookings">Tipologie Prenotazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views and Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visualizzazioni e Prenotazioni
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stackId="1"
                      stroke="#0ea5e9" 
                      fill="#0ea5e9" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      stackId="2"
                      stroke="#06b6d4" 
                      fill="#06b6d4" 
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Ricavi Mensili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value}`, 'Ricavi']} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="boats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5" />
                Performance delle Tue Barche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockData.boatPerformance} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#0ea5e9" name="Visualizzazioni" />
                    <Bar dataKey="bookings" fill="#06b6d4" name="Prenotazioni" />
                  </BarChart>
                </ResponsiveContainer>

                {/* Boat Details Table */}
                <div className="space-y-3">
                  {mockData.boatPerformance.map((boat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{boat.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {boat.views} visualizzazioni
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {boat.bookings} prenotazioni
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">€{boat.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">ricavi</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Types Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Tipologie di Prenotazione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockData.bookingTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.bookingTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Metriche Chiave
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Tasso di Conversione</span>
                  <span className="text-xl font-bold text-blue-600">1.8%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Ricavo Medio per Prenotazione</span>
                  <span className="text-xl font-bold text-green-600">€236</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Durata Media Prenotazione</span>
                  <span className="text-xl font-bold text-purple-600">2.3 giorni</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Clienti di Ritorno</span>
                  <span className="text-xl font-bold text-orange-600">34%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}