'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { PackageForm } from '@/components/packages';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewPackagePage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('New package data:', data);
    toast.success('Package created successfully!');
    router.push('/packages');
  };

  const handleCancel = () => {
    router.push('/packages');
  };

  return (
    <PageWrapper
      title="New Package"
      description="Create a recurring service package"
      actions={
        <Button variant="outline" asChild>
          <Link href="/packages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <PackageForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
