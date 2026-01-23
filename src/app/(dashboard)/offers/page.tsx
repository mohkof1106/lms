'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { OfferTable } from '@/components/offers';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockOffers, offerStatusLabels } from '@/lib/mock-data/offers';
import { Plus } from 'lucide-react';

export default function OffersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOffers = useMemo(() => {
    return mockOffers.filter((offer) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        offer.offerNumber.toLowerCase().includes(searchLower) ||
        offer.customerName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingValue = mockOffers
    .filter((o) => o.status === 'sent')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <PageWrapper
      title="Offers"
      description={`${mockOffers.length} total offers`}
      actions={
        <Button asChild>
          <Link href="/offers/new">
            <Plus className="h-4 w-4 mr-2" />
            New Offer
          </Link>
        </Button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search offers..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(offerStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No offers found matching your criteria.</p>
        </div>
      ) : (
        <OfferTable offers={filteredOffers} />
      )}
    </PageWrapper>
  );
}
