'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
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
import { supabase } from '@/lib/supabase';

interface ServiceCategory {
  id: string;
  name: string;
  sortOrder: number;
}

interface CategoryComboboxProps {
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
}

export function CategoryCombobox({ value, onChange, disabled }: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name, sort_order')
        .order('sort_order');

      if (!error && data) {
        setCategories(data.map(c => ({
          id: c.id,
          name: c.name,
          sortOrder: c.sort_order || 0,
        })));
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  // Find selected category
  const selectedCategory = categories.find(c => c.id === value);

  // Check if search matches existing category (case-insensitive)
  const searchLower = searchValue.toLowerCase().trim();
  const exactMatch = categories.find(c => c.name.toLowerCase() === searchLower);
  const canCreate = searchValue.trim().length > 0 && !exactMatch;

  // Handle creating a new category
  const handleCreate = async () => {
    if (!canCreate || creating) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({
          name: searchValue.trim(),
          sort_order: categories.length + 1,
        })
        .select('id, name, sort_order')
        .single();

      if (error) {
        // Handle duplicate error
        if (error.code === '23505') {
          console.error('Category already exists');
        } else {
          console.error('Error creating category:', error);
        }
        setCreating(false);
        return;
      }

      if (data) {
        const newCategory = {
          id: data.id,
          name: data.name,
          sortOrder: data.sort_order || 0,
        };
        setCategories(prev => [...prev, newCategory].sort((a, b) => a.sortOrder - b.sortOrder));
        onChange(data.id);
        setSearchValue('');
        setOpen(false);
      }
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled || loading}
        >
          {loading ? (
            'Loading...'
          ) : selectedCategory ? (
            selectedCategory.name
          ) : (
            'Select category...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or create category..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty className="py-2 px-3 text-sm text-muted-foreground">
              {searchValue.trim() ? (
                <span>No category found.</span>
              ) : (
                <span>Type to search or create...</span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {categories
                .filter(c => c.name.toLowerCase().includes(searchLower))
                .map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => {
                      onChange(category.id);
                      setSearchValue('');
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === category.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
            </CommandGroup>
            {canCreate && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreate}
                  disabled={creating}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {creating ? 'Creating...' : `Create "${searchValue.trim()}"`}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
