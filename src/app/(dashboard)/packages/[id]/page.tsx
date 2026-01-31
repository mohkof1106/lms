'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { PackageForm, DeliverablesList } from '@/components/packages';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getPackageById } from '@/lib/mock-data/packages';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Building2,
  ListChecks,
} from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const pkg = getPackageById(params.id as string);

  if (!pkg) {
    return (
      <PageWrapper title="Package Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The package you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/packages">Back to Packages</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const handleSave = (data: any) => {
    console.log('Updated package data:', data);
    toast.success('Package updated successfully!');
    router.push(`/packages/${pkg.id}`);
  };

  const handleCancel = () => {
    router.push(`/packages/${pkg.id}`);
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${pkg.name}`}
        description="Update package details"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/packages/${pkg.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <PackageForm pkg={pkg} onSubmit={handleSave} onCancel={handleCancel} />
      </PageWrapper>
    );
  }

  // Calculate overall progress
  const totalItems = pkg.deliverables.reduce((sum, d) => sum + d.quantity, 0);
  const completedItems = pkg.deliverables.reduce((sum, d) => sum + d.completedThisPeriod, 0);
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <PageWrapper
      title={pkg.name}
      description={pkg.customerName}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/packages/${pkg.id}?edit=true`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{pkg.name}</h2>
                  <Link
                    href={`/customers/${pkg.customerId}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {pkg.customerName}
                  </Link>
                </div>
                <StatusBadge
                  status={pkg.active ? 'Active' : 'Inactive'}
                  variant={pkg.active ? 'success' : 'destructive'}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <AedIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Fee</p>
                    <p className="font-semibold">{formatCurrency(pkg.monthlyFee)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold">{formatDate(pkg.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deliverables</p>
                    <p className="font-semibold">{pkg.deliverables.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{pkg.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deliverables This Period</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliverablesList deliverables={pkg.deliverables} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Progress */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{overallProgress}%</div>
                <p className="text-sm text-muted-foreground">
                  {completedItems} of {totalItems} items completed
                </p>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                Generate Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                View History
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/customers/${pkg.customerId}`}>
                  View Customer
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
