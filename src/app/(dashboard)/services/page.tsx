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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  // Fetch services and categories from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('service_categories')
          .select('id, name, sort_order')
          .order('sort_order');

        if (categoriesData) {
          setCategories(categoriesData.map(c => ({
            id: c.id,
            name: c.name,
            sortOrder: c.sort_order || 0,
          })));
        }

        // Fetch services with category join
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            service_categories (
              id,
              name,
              sort_order
            ),
            service_subtasks (
              id,
              title,
              percentage,
              sort_order
            )
          `)
          .order('name');

        if (error) throw error;

        const mapped: Service[] = (data || []).map((s: any) => {
          const categoryData = s.service_categories;
          return {
            id: s.id,
            name: s.name,
            description: s.description || '',
            estimatedHours: s.estimated_hours,
            categoryId: s.category_id,
            category: categoryData ? {
              id: categoryData.id,
              name: categoryData.name,
              sortOrder: categoryData.sort_order,
            } : undefined,
            active: s.active,
            subtasks: (s.service_subtasks || []).map((st: any) => ({
              id: st.id,
              serviceId: s.id,
              title: st.title,
              percentage: Number(st.percentage),
              sortOrder: st.sort_order,
            })),
          };
        });

        setServices(mapped);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category?.name.toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === 'all' || service.categoryId === categoryFilter;

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
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.name}
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
