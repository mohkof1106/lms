'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ServiceCard, ServiceTable } from '@/components/services';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import { Service, ServiceCategory } from '@/types';
import { Plus, LayoutGrid, List, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  powerpoint: 'PowerPoint',
  video: 'Video',
  branding: 'Branding',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  // Fetch services from Supabase
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('category')
          .order('name');

        if (error) throw error;

        const mapped: Service[] = (data || []).map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description || '',
          basePrice: Number(s.base_price),
          estimatedHours: s.estimated_hours,
          category: s.category as ServiceCategory,
          active: s.active,
        }));

        setServices(mapped);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleDeleteService = async () => {
    if (!deleteServiceId) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', deleteServiceId);

      if (error) throw error;

      setServices(services.filter((s) => s.id !== deleteServiceId));
      setDeleteServiceId(null);
      toast.success('Service deleted successfully');
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
    }
  };

  const categories = Object.entries(serviceCategoryLabels) as [ServiceCategory, string][];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === 'all' || service.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter, services]);

  if (loading) {
    return (
      <PageWrapper title="Services" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Services" description="Error">
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Services"
      description={`${services.length} services in catalog`}
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
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={(id) => setDeleteServiceId(id)}
            />
          ))}
        </div>
      ) : (
        <ServiceTable services={filteredServices} onDelete={(id) => setDeleteServiceId(id)} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteServiceId} onOpenChange={() => setDeleteServiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
