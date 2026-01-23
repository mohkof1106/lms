'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { PackageTable } from '@/components/packages';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPackages } from '@/lib/mock-data';
import { Plus } from 'lucide-react';

export default function PackagesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPackages = useMemo(() => {
    return mockPackages.filter((pkg) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        pkg.name.toLowerCase().includes(searchLower) ||
        pkg.customerName.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && pkg.active) ||
        (statusFilter === 'inactive' && !pkg.active);

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeCount = mockPackages.filter((p) => p.active).length;

  return (
    <PageWrapper
      title="Packages"
      description={`${activeCount} active packages`}
      actions={
        <Button asChild>
          <Link href="/packages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Package
          </Link>
        </Button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search packages..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No packages found matching your criteria.</p>
        </div>
      ) : (
        <PackageTable packages={filteredPackages} />
      )}
    </PageWrapper>
  );
}
