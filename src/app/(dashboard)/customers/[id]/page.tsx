'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CustomerForm, ContactList } from '@/components/customers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Customer } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Globe,
  MapPin,
  Calendar,
  FolderOpen,
  Package,
  FileText,
  Loader2,
} from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        setLoading(true);
        const customerId = params.id as string;

        // Fetch customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customerError) throw customerError;

        // Fetch contacts for this customer
        const { data: contactsData, error: contactsError } = await supabase
          .from('customer_contacts')
          .select('*')
          .eq('customer_id', customerId);

        if (contactsError) throw contactsError;

        // Map to Customer type
        const mapped: Customer = {
          id: customerData.id,
          name: customerData.name,
          location: customerData.location || '',
          website: customerData.website || undefined,
          industry: customerData.industry || undefined,
          notes: customerData.notes || undefined,
          trn: customerData.trn || undefined,
          createdAt: customerData.created_at,
          activeProjects: 0,
          activePackages: 0,
          contacts: (contactsData || []).map((contact) => ({
            id: contact.id,
            name: contact.name,
            email: contact.email || '',
            phone: contact.phone || '',
            position: contact.position || undefined,
            isPrimary: contact.is_primary,
          })),
        };

        setCustomer(mapped);
      } catch (err) {
        console.error('Error fetching customer:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customer');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomer();
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

  if (error || !customer) {
    return (
      <PageWrapper title="Customer Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {error || "The customer you're looking for doesn't exist."}
          </p>
          <Button asChild className="mt-4">
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async (data: any) => {
    try {
      // Update customer
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: data.name,
          location: data.location,
          website: data.website || null,
          industry: data.industry || null,
          notes: data.notes || null,
          trn: data.trn || null,
        })
        .eq('id', customer.id);

      if (customerError) throw customerError;

      // Delete existing contacts and insert new ones
      const { error: deleteError } = await supabase
        .from('customer_contacts')
        .delete()
        .eq('customer_id', customer.id);

      if (deleteError) throw deleteError;

      // Insert updated contacts
      if (data.contacts && data.contacts.length > 0) {
        const contactsToInsert = data.contacts.map((c: any) => ({
          customer_id: customer.id,
          name: c.name,
          email: c.email || null,
          phone: c.phone || null,
          position: c.position || null,
          is_primary: c.isPrimary || false,
        }));

        const { error: insertError } = await supabase
          .from('customer_contacts')
          .insert(contactsToInsert);

        if (insertError) throw insertError;
      }

      toast.success('Customer updated successfully!');
      router.push(`/customers/${customer.id}`);
    } catch (err) {
      console.error('Error updating customer:', err);
      toast.error('Failed to update customer');
    }
  };

  const handleCancel = () => {
    router.push(`/customers/${customer.id}`);
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${customer.name}`}
        description="Update customer information"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/customers/${customer.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <CustomerForm customer={customer} onSubmit={handleSave} onCancel={handleCancel} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={customer.name}
      description={customer.industry || 'Customer'}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/customers/${customer.id}?edit=true`}>
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
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{customer.name}</h2>
                    {customer.industry && (
                      <p className="text-muted-foreground">{customer.industry}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.location}</span>
                    </div>
                    {customer.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`https://${customer.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          {customer.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Client since {formatDate(customer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactList contacts={customer.contacts} />
                </CardContent>
              </Card>

              {/* Notes */}
              {customer.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Projects module coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packages" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Packages module coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Offers module coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  <span>Active Projects</span>
                </div>
                <span className="font-semibold">{customer.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Active Packages</span>
                </div>
                <span className="font-semibold">{customer.activePackages}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Total Contacts</span>
                </div>
                <span className="font-semibold">{customer.contacts.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Primary Contact */}
          {customer.contacts.find((c) => c.isPrimary) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Primary Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactList
                  contacts={customer.contacts.filter((c) => c.isPrimary)}
                  variant="card"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
