'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CustomerForm } from '@/components/customers';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('New customer data:', data);
    toast.success('Customer created successfully!');
    router.push('/customers');
  };

  const handleCancel = () => {
    router.push('/customers');
  };

  return (
    <PageWrapper
      title="New Customer"
      description="Add a new client to the system"
      actions={
        <Button variant="outline" asChild>
          <Link href="/customers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <CustomerForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
