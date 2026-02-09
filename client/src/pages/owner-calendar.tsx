import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, Anchor, Compass, ChevronRight, Calendar, MapPin } from "lucide-react";
import { OwnerAvailabilityManager } from "@/components/owner-availability-manager";
import { OwnerMooringAvailabilityManager } from "@/components/owner-mooring-availability-manager";
import { OwnerExperienceAvailabilityManager } from "@/components/owner-experience-availability-manager";

type TabType = "boats" | "moorings" | "experiences";

export default function OwnerCalendar() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("boats");
  const [selectedBoatId, setSelectedBoatId] = useState<number | null>(null);
  const [selectedMooringId, setSelectedMooringId] = useState<number | null>(null);
  const [selectedExperienceId, setSelectedExperienceId] = useState<number | null>(null);

  const { data: boatsData, isLoading: boatsLoading } = useQuery<any>({
    queryKey: ["/api/owner/boats"],
  });
  const boats = boatsData?.boats || boatsData || [];

  const { data: mooringsData, isLoading: mooringsLoading } = useQuery<any>({
    queryKey: ["/api/owner/moorings"],
  });
  const moorings = mooringsData?.moorings || mooringsData || [];

  const { data: experiencesData, isLoading: experiencesLoading } = useQuery<any>({
    queryKey: ["/api/owner/experiences"],
  });
  const experiences = experiencesData?.experiences || experiencesData || [];

  const tabs: { key: TabType; label: string; icon: any; count: number }[] = [
    { key: "boats", label: "Imbarcazioni", icon: Ship, count: Array.isArray(boats) ? boats.length : 0 },
    { key: "moorings", label: "Ormeggi", icon: Anchor, count: Array.isArray(moorings) ? moorings.length : 0 },
    { key: "experiences", label: "Esperienze", icon: Compass, count: Array.isArray(experiences) ? experiences.length : 0 },
  ];

  const handleSelectItem = (type: TabType, id: number) => {
    if (type === "boats") {
      setSelectedBoatId(selectedBoatId === id ? null : id);
      setSelectedMooringId(null);
      setSelectedExperienceId(null);
    } else if (type === "moorings") {
      setSelectedMooringId(selectedMooringId === id ? null : id);
      setSelectedBoatId(null);
      setSelectedExperienceId(null);
    } else {
      setSelectedExperienceId(selectedExperienceId === id ? null : id);
      setSelectedBoatId(null);
      setSelectedMooringId(null);
    }
  };

  const isLoading = activeTab === "boats" ? boatsLoading : activeTab === "moorings" ? mooringsLoading : experiencesLoading;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-6 w-6 text-[#0077B6]" />
          <h1 className="text-xl font-bold text-gray-900">Gestione Disponibilità</h1>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedBoatId(null);
                  setSelectedMooringId(null);
                  setSelectedExperienceId(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0077B6] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#0077B6] hover:text-[#0077B6]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant={isActive ? "secondary" : "outline"} className={`ml-1 text-xs px-1.5 py-0 ${isActive ? "bg-white/20 text-white border-0" : ""}`}>
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {activeTab === "boats" && (
              <div className="space-y-3">
                {(!Array.isArray(boats) || boats.length === 0) ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Ship className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nessuna imbarcazione registrata</p>
                      <p className="text-gray-400 text-sm mt-1">Aggiungi un'imbarcazione dalla Dashboard</p>
                    </CardContent>
                  </Card>
                ) : (
                  boats.map((boat: any) => (
                    <div key={boat.id}>
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedBoatId === boat.id ? "ring-2 ring-[#0077B6] shadow-md" : "hover:shadow-sm"
                        }`}
                        onClick={() => handleSelectItem("boats", boat.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${selectedBoatId === boat.id ? "bg-[#0077B6] text-white" : "bg-blue-50 text-[#0077B6]"}`}>
                              <Ship className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{boat.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                {boat.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {boat.location}
                                  </span>
                                )}
                                {boat.type && <span className="capitalize">{boat.type}</span>}
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedBoatId === boat.id ? "rotate-90" : ""}`} />
                          </div>
                        </CardContent>
                      </Card>
                      {selectedBoatId === boat.id && (
                        <div className="mt-2 mb-4">
                          <OwnerAvailabilityManager boatId={boat.id} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "moorings" && (
              <div className="space-y-3">
                {(!Array.isArray(moorings) || moorings.length === 0) ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Anchor className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nessun ormeggio registrato</p>
                      <p className="text-gray-400 text-sm mt-1">Aggiungi un ormeggio dalla Dashboard</p>
                    </CardContent>
                  </Card>
                ) : (
                  moorings.map((mooring: any) => (
                    <div key={mooring.id}>
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedMooringId === mooring.id ? "ring-2 ring-[#0077B6] shadow-md" : "hover:shadow-sm"
                        }`}
                        onClick={() => handleSelectItem("moorings", mooring.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${selectedMooringId === mooring.id ? "bg-[#0077B6] text-white" : "bg-blue-50 text-[#0077B6]"}`}>
                              <Anchor className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{mooring.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                {mooring.port && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {mooring.port}
                                  </span>
                                )}
                                {mooring.size && <span>{mooring.size}</span>}
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedMooringId === mooring.id ? "rotate-90" : ""}`} />
                          </div>
                        </CardContent>
                      </Card>
                      {selectedMooringId === mooring.id && (
                        <div className="mt-2 mb-4">
                          <OwnerMooringAvailabilityManager mooringId={mooring.id} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "experiences" && (
              <div className="space-y-3">
                {(!Array.isArray(experiences) || experiences.length === 0) ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nessuna esperienza registrata</p>
                      <p className="text-gray-400 text-sm mt-1">Aggiungi un'esperienza dalla Dashboard</p>
                    </CardContent>
                  </Card>
                ) : (
                  experiences.map((exp: any) => (
                    <div key={exp.id}>
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedExperienceId === exp.id ? "ring-2 ring-[#0077B6] shadow-md" : "hover:shadow-sm"
                        }`}
                        onClick={() => handleSelectItem("experiences", exp.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${selectedExperienceId === exp.id ? "bg-[#0077B6] text-white" : "bg-blue-50 text-[#0077B6]"}`}>
                              <Compass className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">{exp.title || exp.name}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                {exp.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {exp.location}
                                  </span>
                                )}
                                {exp.category && <span className="capitalize">{exp.category}</span>}
                              </div>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedExperienceId === exp.id ? "rotate-90" : ""}`} />
                          </div>
                        </CardContent>
                      </Card>
                      {selectedExperienceId === exp.id && (
                        <div className="mt-2 mb-4">
                          <OwnerExperienceAvailabilityManager experienceId={exp.id} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
