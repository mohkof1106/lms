'use client';

import { useState, useMemo } from 'react';
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
import { mockCustomers } from '@/lib/mock-data';
import { Plus, Download } from 'lucide-react';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  // Extract unique industries from customers
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(
      mockCustomers.map((c) => c.industry).filter(Boolean)
    );
    return Array.from(uniqueIndustries).sort();
  }, []);

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      // Search filter
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

      // Industry filter
      const matchesIndustry =
        industryFilter === 'all' || customer.industry === industryFilter;

      return matchesSearch && matchesIndustry;
    });
  }, [search, industryFilter]);

  return (
    <PageWrapper
      title="Customers"
      description={`${mockCustomers.length} clients`}
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
        <CustomerTable customers={filteredCustomers} />
      )}
    </PageWrapper>
  );
}
