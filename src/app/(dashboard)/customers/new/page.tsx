'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CustomerForm } from '@/components/customers';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Insert customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          location: data.location,
          website: data.website || null,
          industry: data.industry || null,
          trn: data.trn || null,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert contacts
      if (data.contacts && data.contacts.length > 0) {
        const contactsToInsert = data.contacts.map((contact: any) => ({
          customer_id: newCustomer.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          position: contact.position || null,
          is_primary: contact.isPrimary,
        }));

        const { error: contactsError } = await supabase
          .from('customer_contacts')
          .insert(contactsToInsert);

        if (contactsError) throw contactsError;
      }

      toast.success('Customer created successfully!');
      router.push('/customers');
      router.refresh();
    } catch (err) {
      console.error('Error creating customer:', err);
      toast.error('Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
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
