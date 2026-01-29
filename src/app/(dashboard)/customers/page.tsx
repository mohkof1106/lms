'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CustomerTable } from '@/components/customers';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Customer } from '@/types';
import { Plus, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // Fetch customers with contacts from Supabase
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);

        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .order('name');

        if (customersError) throw customersError;

        // Fetch all contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('customer_contacts')
          .select('*');

        if (contactsError) throw contactsError;

        // Map and join data
        const mapped: Customer[] = (customersData || []).map((c) => ({
          id: c.id,
          name: c.name,
          location: c.location || '',
          website: c.website || undefined,
          industry: c.industry || undefined,
          notes: c.notes || undefined,
          trn: c.trn || undefined,
          createdAt: c.created_at,
          activeProjects: 0,
          activePackages: 0,
          contacts: (contactsData || [])
            .filter((contact) => contact.customer_id === c.id)
            .map((contact) => ({
              id: contact.id,
              name: contact.name,
              email: contact.email || '',
              phone: contact.phone || '',
              position: contact.position || undefined,
              isPrimary: contact.is_primary,
            })),
        }));

        setCustomers(mapped);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // Extract unique industries
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(
      customers.map((c) => c.industry).filter(Boolean)
    );
    return Array.from(uniqueIndustries).sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.location.toLowerCase().includes(searchLower) ||
        customer.contacts.some(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.email.toLowerCase().includes(searchLower)
        );

      const matchesIndustry =
        industryFilter === 'all' || customer.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [search, industryFilter, customers]);

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      // Delete customer - contacts are deleted via CASCADE
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      setCustomers(customers.filter((c) => c.id !== customerId));
      toast.success('Customer deleted successfully');
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Customers" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Customers" description="Error">
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
      title="Customers"
      description={`${customers.length} clients`}
      actions={
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
          className="flex-1 max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry as string}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No customers found matching your criteria.</p>
        </div>
      ) : (
        <CustomerTable customers={filteredCustomers} onDelete={handleDeleteCustomer} />
      )}
    </PageWrapper>
  );
}
