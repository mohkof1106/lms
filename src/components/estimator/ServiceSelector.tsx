'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ServiceWithCategory {
  id: string;
  name: string;
  estimatedHours: number;
  categoryId: string;
  categoryName: string;
}

interface ServiceSelectorProps {
  services: ServiceWithCategory[];
  value: string;
  onChange: (serviceId: string) => void;
  disabled?: boolean;
}

export function ServiceSelector({ services, value, onChange, disabled }: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: Record<string, { categoryName: string; services: ServiceWithCategory[] }> = {};

    services.forEach((service) => {
      const key = service.categoryId;
      if (!groups[key]) {
        groups[key] = {
          categoryName: service.categoryName,
          services: [],
        };
      }
      groups[key].services.push(service);
    });

    // Sort services within each group by name
    Object.values(groups).forEach(group => {
      group.services.sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [services]);

  // Filter services by search
  const filteredGroups = useMemo(() => {
    if (!searchValue.trim()) return groupedServices;

    const searchLower = searchValue.toLowerCase();
    const filtered: typeof groupedServices = {};

    Object.entries(groupedServices).forEach(([categoryId, group]) => {
      // Check if category name matches
      const categoryMatches = group.categoryName.toLowerCase().includes(searchLower);

      // Filter services that match search
      const matchingServices = categoryMatches
        ? group.services // Show all services if category matches
        : group.services.filter(s => s.name.toLowerCase().includes(searchLower));

      if (matchingServices.length > 0) {
        filtered[categoryId] = {
          ...group,
          services: matchingServices,
        };
      }
    });

    return filtered;
  }, [groupedServices, searchValue]);

  // Find selected service
  const selectedService = services.find(s => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          {selectedService ? (
            <span className="truncate">
              {selectedService.name} ({selectedService.estimatedHours}h)
            </span>
          ) : (
            'Select a service'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search services or categories..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No services found.</CommandEmpty>
            {Object.entries(filteredGroups).map(([categoryId, group]) => (
              <CommandGroup key={categoryId} heading={group.categoryName}>
                {group.services.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.id}
                    onSelect={() => {
                      onChange(service.id);
                      setSearchValue('');
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === service.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span>{service.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {service.estimatedHours}h
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
