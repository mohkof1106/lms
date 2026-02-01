'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { offerStatusLabels } from '@/lib/mock-data/offers';
import { Offer, OfferStatus } from '@/types';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OffersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers() {
    setLoading(true);
    try {
      const { data: offersData, error } = await supabase
        .from('offers')
        .select(`
          *,
          customers (id, name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];

      const mapped: Offer[] = (offersData || []).map((o) => {
        // Check if offer is expired (valid_until < today and status is sent)
        let displayStatus: OfferStatus = o.status as OfferStatus;
        if (o.status === 'sent' && o.valid_until < today) {
          displayStatus = 'expired';
        }

        return {
          id: o.id,
          offerNumber: o.offer_number,
          customerId: o.customer_id,
          customerName: o.customers?.name || 'Unknown Customer',
          date: o.date,
          validUntil: o.valid_until,
          lineItems: [], // Line items fetched separately on detail page
          subtotal: Number(o.subtotal),
          discountPercent: Number(o.discount_percent) || undefined,
          discountAmount: Number(o.discount_amount) || undefined,
          vatRate: Number(o.vat_rate),
          vatAmount: Number(o.vat_amount),
          total: Number(o.total),
          terms: o.terms || undefined,
          status: displayStatus,
          notes: o.notes || undefined,
          laborCost: Number(o.labor_cost) || undefined,
          overheadPercent: Number(o.overhead_percent) || undefined,
          overheadAmount: Number(o.overhead_amount) || undefined,
          profitAmount: Number(o.profit_amount) || undefined,
        };
      });

      setOffers(mapped);
    } catch (err) {
      console.error('Error fetching offers:', err);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast.success('Offer deleted successfully');
      setOffers(offers.filter((o) => o.id !== offerId));
    } catch (err) {
      console.error('Error deleting offer:', err);
      toast.error('Failed to delete offer');
    }
  };

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        offer.offerNumber.toLowerCase().includes(searchLower) ||
        offer.customerName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, offers]);

  const pendingValue = offers
    .filter((o) => o.status === 'sent')
    .reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <PageWrapper title="Offers" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Offers"
      description={`${offers.length} total offers`}
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
        <OfferTable offers={filteredOffers} onDelete={handleDelete} />
      )}
    </PageWrapper>
  );
}
