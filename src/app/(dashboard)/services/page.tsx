'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ServiceCard, ServiceTable } from '@/components/services';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { mockServices, serviceCategoryLabels } from '@/lib/mock-data/services';
import { ServiceCategory } from '@/types';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = Object.entries(serviceCategoryLabels) as [ServiceCategory, string][];

  const filteredServices = useMemo(() => {
    return mockServices.filter((service) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        categoryFilter === 'all' || service.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  return (
    <PageWrapper
      title="Services"
      description={`${mockServices.length} services in catalog`}
      actions={
        <Button asChild>
          <Link href="/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search services..."
            className="flex-1 max-w-sm"
          />
          <div className="flex gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter('all')}
          >
            All
          </Button>
          {categories.map(([value, label]) => (
            <Button
              key={value}
              variant={categoryFilter === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <ServiceTable services={filteredServices} />
      )}
    </PageWrapper>
  );
}
