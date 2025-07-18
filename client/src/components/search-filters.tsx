import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
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

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Dove</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Ponza, Amalfi, Capri..."
              className="pl-10"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Dal</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  format(filters.startDate, "PPP", { locale: it })
                ) : (
                  <span>Seleziona data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => updateFilter("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-gray-900">Al</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? (
                  format(filters.endDate, "PPP", { locale: it })
                ) : (
                  <span>Seleziona data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => updateFilter("endDate", date)}
                initialFocus
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
