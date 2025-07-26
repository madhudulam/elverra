
import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

interface Country {
  id: string;
  name: string;
  code: string;
  active: boolean;
  url?: string;
}

interface CountrySelectorProps {
  onClose?: () => void; // Make onClose optional
}

const CountrySelector = ({ onClose }: CountrySelectorProps) => {
  const { toast } = useToast();
  
  const countries: Country[] = [
    { id: '1', name: 'Mali', code: 'ML', active: true, url: 'https://www.club66mali.com' },
    { id: '2', name: 'Nigeria', code: 'NG', active: false, url: 'https://www.club66nigeria.com' },
    { id: '3', name: 'Ghana', code: 'GH', active: false, url: 'https://www.club66ghana.com' },
    { id: '4', name: 'Senegal', code: 'SN', active: false, url: 'https://www.club66senegal.com' },
    { id: '5', name: 'South Africa', code: 'ZA', active: false, url: 'https://www.club66southafrica.com' },
    { id: '6', name: 'Kenya', code: 'KE', active: false, url: 'https://www.club66kenya.com' },
    { id: '7', name: 'Ivory Coast', code: 'CI', active: false, url: 'https://www.club66ivorycoast.com' },
    { id: '8', name: 'Egypt', code: 'EG', active: false, url: 'https://www.club66egypt.com' },
    { id: '9', name: 'International', code: 'GL', active: true, url: 'https://www.club66.net' },
  ];

  const [selectedCountry, setSelectedCountry] = useState<string>('Mali');
  const [open, setOpen] = useState(false);

  const handleSelect = (country: Country) => {
    if (!country.active) {
      toast({
        title: "Country Not Available",
        description: "This country is not yet available. Currently, only Mali and International are active.",
        variant: "destructive",
      });
      return;
    }
    
    // Update selected country
    setSelectedCountry(country.name);
    setOpen(false);
    
    // Handle country redirection
    if (country.url && country.name !== 'International' && window.location.hostname !== country.url) {
      const shouldRedirect = window.confirm(`You are about to be redirected to ${country.url}. Continue?`);
      if (shouldRedirect) {
        window.location.href = country.url;
      }
    }
    
    if (onClose) onClose();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span>{selectedCountry}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="max-h-80 overflow-y-auto">
          <div className="p-2">
            <h3 className="font-medium text-sm text-gray-700 mb-2">Select Country</h3>
            <div className="space-y-1">
              {countries.map((country) => (
                <div
                  key={country.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    country.active ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                  } ${selectedCountry === country.name ? 'bg-club66-purple/10' : ''}`}
                  onClick={() => handleSelect(country)}
                >
                  <div className="flex-1">
                    <span className="text-sm">
                      {country.name}
                      {!country.active && (
                        <span className="text-xs ml-2 text-gray-400">(Coming Soon)</span>
                      )}
                    </span>
                  </div>
                  {selectedCountry === country.name && (
                    <Check className="h-4 w-4 text-club66-purple" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
