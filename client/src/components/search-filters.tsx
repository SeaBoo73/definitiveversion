import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { PortSelector } from "@/components/port-selector";
import { MapPin, Calendar as CalendarIcon, Users, Search, Ship, UserCheck, Fuel, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  guests: number;
  boatType?: string;
  skipperRequired?: boolean;
  fuelIncluded?: boolean;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    startDate: undefined,
    endDate: undefined,
    guests: 2,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    console.log(`Updating ${key} with value:`, value);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      console.log('New filters state:', newFilters);
      return newFilters;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Dove</Label>
          <PortSelector
            value={filters.location}
            onChange={(port) => updateFilter("location", port)}
            placeholder="Seleziona porto del Lazio..."
          />
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Dal</Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal hover:bg-gray-50"
                onClick={() => {
                  console.log("Start date button clicked");
                  setStartDateOpen(true);
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  format(new Date(filters.startDate), "PPP", { locale: it })
                ) : (
                  <span>Seleziona data</span>
                )}
                <span className="text-xs text-gray-500 ml-2">
                  {filters.startDate && JSON.stringify(filters.startDate).slice(1, 11)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={(date) => {
                  console.log("Start date selected:", date);
                  if (date) {
                    updateFilter("startDate", date);
                    setStartDateOpen(false);
                    console.log("Start date popover closed");
                  }
                }}
                disabled={(date) => date < new Date(Date.now() - 24 * 60 * 60 * 1000)}
                initialFocus
                className="rounded-md border calendar"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Al</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal hover:bg-gray-50"
                onClick={() => {
                  console.log("End date button clicked");
                  setEndDateOpen(true);
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? (
                  format(new Date(filters.endDate), "PPP", { locale: it })
                ) : (
                  <span>Seleziona data</span>
                )}
                <span className="text-xs text-gray-500 ml-2">
                  {filters.endDate && JSON.stringify(filters.endDate).slice(1, 11)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                onSelect={(date) => {
                  console.log("End date selected:", date);
                  if (date) {
                    updateFilter("endDate", date);
                    setEndDateOpen(false);
                    console.log("End date popover closed");
                  }
                }}
                disabled={(date) => {
                  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                  if (date < yesterday) return true;
                  if (filters.startDate && date <= filters.startDate) return true;
                  return false;
                }}
                initialFocus
                className="rounded-md border calendar"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Ospiti</Label>
          <Select onValueChange={(value) => updateFilter("guests", parseInt(value))}>
            <SelectTrigger>
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder={`${filters.guests} ospiti`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 29 }, (_, i) => i + 2).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} ospiti
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button 
            className="w-full bg-coral hover:bg-orange-600"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Cerca
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced ? "bg-gray-100" : ""}
          >
            <Ship className="mr-2 h-4 w-4" />
            Tipo imbarcazione
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter("skipperRequired", !filters.skipperRequired)}
            className={filters.skipperRequired ? "bg-blue-100 text-blue-700" : ""}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Con Skipper
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter("fuelIncluded", !filters.fuelIncluded)}
            className={filters.fuelIncluded ? "bg-green-100 text-green-700" : ""}
          >
            <Fuel className="mr-2 h-4 w-4" />
            Carburante incluso
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Altri filtri
          </Button>
        </div>

        {showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo di imbarcazione</Label>
                <Select onValueChange={(value) => updateFilter("boatType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tutti i tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gommone">Gommone</SelectItem>
                    <SelectItem value="yacht">Yacht</SelectItem>
                    <SelectItem value="catamarano">Catamarano</SelectItem>
                    <SelectItem value="jetski">Moto d'acqua</SelectItem>
                    <SelectItem value="sailboat">Barca a vela</SelectItem>
                    <SelectItem value="kayak">Kayak</SelectItem>
                    <SelectItem value="charter">Charter</SelectItem>
                    <SelectItem value="houseboat">Houseboat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filters.boatType && (
              <div className="mt-4">
                <Badge variant="secondary" className="mr-2">
                  {filters.boatType}
                  <button
                    onClick={() => updateFilter("boatType", undefined)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
