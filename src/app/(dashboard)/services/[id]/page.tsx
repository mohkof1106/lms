'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ServiceForm } from '@/components/services';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Clock,
  Tag,
  FileText,
  Loader2,
} from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';

const categoryColors: Record<string, string> = {
  social: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  print: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  branding: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  video: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  web: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  packaging: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  signage: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  motion: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  powerpoint: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  powerpoint: 'Power Point',
  video: 'Video',
  branding: 'Branding',
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const serviceId = params.id as string;
        if (!serviceId) return;

        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();

        if (error) throw error;

        if (data) {
          setService({
            id: data.id,
            name: data.name,
            description: data.description || '',
            basePrice: Number(data.base_price),
            estimatedHours: data.estimated_hours,
            category: data.category as ServiceCategory,
            active: data.active,
          });
        }
      } catch (err) {
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [params.id]);

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (!service) {
    return (
      <PageWrapper title="Service Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The service you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const handleSave = async (data: any) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: data.name,
          description: data.description,
          base_price: data.basePrice,
          estimated_hours: data.estimatedHours,
          category: data.category,
          active: data.active,
        })
        .eq('id', service.id);

      if (error) throw error;

      toast.success('Service updated successfully!');
      router.push(`/services/${service.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating service:', err);
      toast.error('Failed to update service');
    }
  };

  const handleCancel = () => {
    router.push(`/services/${service.id}`);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);

      if (error) throw error;

      toast.success('Service deleted successfully!');
      router.push('/services');
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Failed to delete service');
    }
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${service.name}`}
        description="Update service information"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/services/${service.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <ServiceForm service={service} onSubmit={handleSave} onCancel={handleCancel} />
      </PageWrapper>
    );
  }

  // Calculate hourly rate
  const hourlyRate = service.basePrice / service.estimatedHours;

  return (
    <PageWrapper
      title={service.name}
      description={serviceCategoryLabels[service.category]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/services">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/services/${service.id}?edit=true`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{service.name}</h2>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={categoryColors[service.category] || ''}
                      >
                        {serviceCategoryLabels[service.category]}
                      </Badge>
                      <StatusBadge
                        status={service.active ? 'Active' : 'Inactive'}
                        variant={service.active ? 'success' : 'destructive'}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <AedIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="font-semibold">{formatCurrency(service.basePrice)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Hours</p>
                      <p className="font-semibold">{service.estimatedHours}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hourly Rate</p>
                      <p className="font-semibold">{formatCurrency(hourlyRate)}/h</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>

          {/* Usage History - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Project and package usage tracking coming soon.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service ID</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-sm bg-muted px-2 py-1 rounded">{service.id}</code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                Add to Quote
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Add to Project
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                View in Packages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{service.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
