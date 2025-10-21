import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, User, Calendar, Verified, ThumbsUp, MessageSquare, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface UserReview {
  id: number;
  boatId: number;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  response?: string;
  responseDate?: string;
  createdAt: string;
  boat: {
    id: number;
    name: string;
    type: string;
  };
}

interface ReceivedReview {
  id: number;
  boatId: number;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  helpful: number;
  response?: string;
  responseDate?: string;
  createdAt: string;
  reviewer: {
    firstName: string;
    lastName: string;
    customerLevel: string;
  };
  boat: {
    id: number;
    name: string;
    type: string;
  };
}

export function ReviewsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("given");

  const { data: givenReviews, isLoading: loadingGiven } = useQuery<UserReview[]>({
    queryKey: ['/api/reviews/user', user?.id],
    enabled: !!user
  });

  const { data: receivedReviews, isLoading: loadingReceived } = useQuery<ReceivedReview[]>({
    queryKey: ['/api/reviews/received', user?.id],
    enabled: !!user && user.role === 'owner'
  });

  const renderStars = (rating: number, size = "w-4 h-4") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className={`${size} text-yellow-400 fill-current`} />);
    }
    
    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={`${size} text-gray-300`} />);
    }
    
    return stars;
  };

  const getCustomerLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getBoatTypeTranslation = (type: string) => {
    const translations: { [key: string]: string } = {
      'yacht': 'Yacht',
      'sailboat': 'Barca a Vela',
      'motorboat': 'Barca a Motore',
      'catamaran': 'Catamarano',
      'dinghy': 'Gommone',
      'jetski': 'Moto d\'Acqua',
      'charter': 'Charter',
      'houseboat': 'Houseboat',
      'gulet': 'Gulet',
      'kayak': 'Caiacco',
      'barche-senza-patente': 'Barche senza Patente'
    };
    return translations[type] || type;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accesso richiesto</h1>
          <p className="text-gray-600">Effettua l'accesso per visualizzare le tue recensioni</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Le mie Recensioni</h1>
          <p className="text-gray-600">Gestisci le tue recensioni e visualizza quelle ricevute</p>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("given")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === "given"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recensioni Date
            </button>
            {user.role === 'owner' && (
              <button
                onClick={() => setActiveTab("received")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "received"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Recensioni Ricevute
              </button>
            )}
          </div>

          {/* Given Reviews Content */}
          {activeTab === "given" && (
            <Card>
              <CardHeader>
                <CardTitle>Recensioni che hai scritto</CardTitle>
                <CardDescription>
                  Le tue opinioni sulle imbarcazioni che hai noleggiato
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingGiven ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-100 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : givenReviews && givenReviews.length > 0 ? (
                  <div className="space-y-6">
                    {givenReviews.map((review) => (
                      <Card key={review.id} className="border-l-4 border-l-blue-400">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {review.boat.name}
                              </h3>
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary">
                                  {getBoatTypeTranslation(review.boat.type)}
                                </Badge>
                                {review.verified && (
                                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                    <Verified className="h-3 w-3 mr-1" />
                                    Verificata
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {renderStars(review.rating)}
                              <span className="font-medium">{review.rating}/5</span>
                            </div>
                          </div>

                          {review.title && (
                            <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                          )}

                          <p className="text-gray-700 mb-4">{review.comment}</p>

                          {review.response && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                              <div className="flex items-center mb-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                                <span className="font-medium text-blue-900">Risposta del Proprietario</span>
                                {review.responseDate && (
                                  <span className="text-sm text-blue-600 ml-2">
                                    • {new Date(review.responseDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              <p className="text-blue-800">{review.response}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="flex items-center text-gray-600">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span className="text-sm">{review.helpful} persone l'hanno trovata utile</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna recensione ancora</h3>
                    <p className="text-gray-600">
                      Le recensioni che scrivi dopo aver noleggiato un'imbarcazione appariranno qui
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Received Reviews Content */}
          {user.role === 'owner' && activeTab === "received" && (
              <Card>
                <CardHeader>
                  <CardTitle>Recensioni ricevute</CardTitle>
                  <CardDescription>
                    Le opinioni dei clienti sulle tue imbarcazioni
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingReceived ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-32 bg-gray-100 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : receivedReviews && receivedReviews.length > 0 ? (
                    <div className="space-y-6">
                      {receivedReviews.map((review) => (
                        <Card key={review.id} className="border-l-4 border-l-green-400">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">
                                  {review.boat.name}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="secondary">
                                    {getBoatTypeTranslation(review.boat.type)}
                                  </Badge>
                                  {review.verified && (
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                      <Verified className="h-3 w-3 mr-1" />
                                      Verificata
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <User className="h-4 w-4" />
                                    <span>{review.reviewer.firstName} {review.reviewer.lastName.charAt(0)}.</span>
                                    <Badge className={getCustomerLevelColor(review.reviewer.customerLevel)}>
                                      {review.reviewer.customerLevel.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {renderStars(review.rating)}
                                <span className="font-medium">{review.rating}/5</span>
                              </div>
                            </div>

                            {review.title && (
                              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                            )}

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            {review.response && (
                              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                  <MessageSquare className="h-4 w-4 text-gray-600 mr-2" />
                                  <span className="font-medium text-gray-900">La tua risposta</span>
                                  {review.responseDate && (
                                    <span className="text-sm text-gray-600 ml-2">
                                      • {new Date(review.responseDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-800">{review.response}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                              <div className="flex items-center text-gray-600">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                <span className="text-sm">{review.helpful} persone l'hanno trovata utile</span>
                              </div>
                              {!review.response && (
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Rispondi
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna recensione ancora</h3>
                      <p className="text-gray-600">
                        Le recensioni dei tuoi clienti appariranno qui dopo che avranno noleggiato le tue imbarcazioni
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}