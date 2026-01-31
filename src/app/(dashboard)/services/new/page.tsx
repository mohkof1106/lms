'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ServiceForm } from '@/components/services';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.from('services').insert({
        name: data.name,
        description: data.description,
        base_price: data.basePrice,
        estimated_hours: data.estimatedHours,
        category: data.category,
        active: data.active,
      });

      if (error) throw error;

      toast.success('Service created successfully!');
      router.push('/services');
      router.refresh();
    } catch (err) {
      console.error('Error creating service:', err);
      toast.error('Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
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
