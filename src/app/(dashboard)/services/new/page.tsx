'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ServiceForm } from '@/components/services';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('New service data:', data);
    toast.success('Service created successfully!');
    router.push('/services');
  };

  const handleCancel = () => {
    router.push('/services');
  };

  return (
    <PageWrapper
      title="New Service"
      description="Add a new service to the catalog"
      actions={
        <Button variant="outline" asChild>
          <Link href="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <ServiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
