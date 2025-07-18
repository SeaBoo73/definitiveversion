import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Search, Check } from "lucide-react";

const lazioPortsData = [
  { name: "Gaeta", region: "Lazio", type: "Porto Principale" },
  { name: "Terracina", region: "Lazio", type: "Porto Commerciale" },
  { name: "San Felice Circeo", region: "Lazio", type: "Porto Turistico" },
  { name: "Ponza", region: "Lazio", type: "Isola Pontina" },
  { name: "Formia", region: "Lazio", type: "Porto Commerciale" },
  { name: "Anzio", region: "Lazio", type: "Porto Storico" },
  { name: "Ventotene", region: "Lazio", type: "Isola Pontina" },
  { name: "Sperlonga", region: "Lazio", type: "Porto Turistico" },
  { name: "Civitavecchia", region: "Lazio", type: "Porto Principale" },
  { name: "Fiumicino", region: "Lazio", type: "Porto Commerciale" },
  { name: "Nettuno", region: "Lazio", type: "Porto Storico" },
  { name: "Ladispoli", region: "Lazio", type: "Porto Turistico" },
  { name: "Santa Marinella", region: "Lazio", type: "Porto Turistico" },
  { name: "Tarquinia", region: "Lazio", type: "Porto Storico" },
  { name: "Montalto di Castro", region: "Lazio", type: "Porto Turistico" }
];

interface PortSelectorProps {
  value: string;
  onChange: (port: string) => void;
  placeholder?: string;
}

export function PortSelector({ value, onChange, placeholder = "Seleziona porto..." }: PortSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPorts = lazioPortsData.filter(port =>
    port.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePortSelect = (port: string) => {
    onChange(port);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-left font-normal"
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span className={value ? "text-gray-900" : "text-gray-500"}>
              {value || placeholder}
            </span>
          </div>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca porto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <ScrollArea className="h-60">
          <div className="p-2">
            {filteredPorts.length > 0 ? (
              filteredPorts.map((port) => (
                <Button
                  key={port.name}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => handlePortSelect(port.name)}
                >
                  <div className="flex items-center w-full">
                    <MapPin className="mr-2 h-4 w-4 text-ocean-blue" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{port.name}</div>
                      <div className="text-sm text-gray-500">{port.type}</div>
                    </div>
                    {value === port.name && (
                      <Check className="h-4 w-4 text-ocean-blue" />
                    )}
                  </div>
                </Button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <MapPin className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p>Nessun porto trovato</p>
                <p className="text-sm">Prova a cercare un altro termine</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t bg-gray-50">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{filteredPorts.length} porti disponibili nel Lazio</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}