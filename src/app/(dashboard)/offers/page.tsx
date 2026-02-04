'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { OfferTable, InitiateTasksDialog } from '@/components/offers';
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
import { Offer, OfferStatus, OfferLineItem, OfferTaskStatus } from '@/types';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OffersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Initiate tasks dialog
  const [initiateTasksOfferId, setInitiateTasksOfferId] = useState<string | null>(null);
  const [initiateTasksLineItems, setInitiateTasksLineItems] = useState<OfferLineItem[]>([]);

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

        // Determine task status
        let taskStatus: OfferTaskStatus = 'not_started';
        if (o.tasks_initiated) {
          taskStatus = 'in_progress'; // Could be enhanced to check actual task completion
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
          lpoNumber: o.lpo_number || undefined,
          tasksInitiated: o.tasks_initiated || false,
          taskStatus,
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

  const handleInitiateTasks = async (offerId: string) => {
    try {
      // Fetch line items for this offer
      const { data: lineItemsData, error } = await supabase
        .from('offer_line_items')
        .select('*')
        .eq('offer_id', offerId)
        .order('sort_order');

      if (error) throw error;

      const lineItems: OfferLineItem[] = (lineItemsData || []).map((item) => ({
        id: item.id,
        serviceId: item.service_id || undefined,
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        total: Number(item.total),
      }));

      setInitiateTasksLineItems(lineItems);
      setInitiateTasksOfferId(offerId);
    } catch (err) {
      console.error('Error loading line items:', err);
      toast.error('Failed to load line items');
    }
  };

  const handleTasksInitiated = () => {
    toast.success('Tasks initiated successfully!');
    fetchOffers(); // Refresh the list
  };

  const handleDuplicate = async (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    try {
      // Fetch line items for this offer
      const { data: lineItemsData, error: lineItemsError } = await supabase
        .from('offer_line_items')
        .select('*')
        .eq('offer_id', offerId)
        .order('sort_order');

      if (lineItemsError) throw lineItemsError;

      // Calculate new valid_until (30 days from today)
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + 30);
      const validUntil = validUntilDate.toISOString().split('T')[0];

      // Create new offer (offer_number auto-generated by DB trigger)
      const { data: newOffer, error: offerError } = await supabase
        .from('offers')
        .insert({
          customer_id: offer.customerId,
          offer_number: '', // Auto-generated by DB trigger
          valid_until: validUntil,
          subtotal: offer.subtotal,
          discount_percent: offer.discountPercent || 0,
          discount_amount: offer.discountAmount || 0,
          vat_rate: offer.vatRate,
          vat_amount: offer.vatAmount,
          total: offer.total,
          terms: offer.terms || null,
          notes: offer.notes || null,
          labor_cost: offer.laborCost || 0,
          overhead_percent: offer.overheadPercent || 0,
          overhead_amount: offer.overheadAmount || 0,
          profit_amount: offer.profitAmount || 0,
          status: 'draft',
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // Copy line items
      if (lineItemsData && lineItemsData.length > 0) {
        const newLineItems = lineItemsData.map((item, index) => ({
          offer_id: newOffer.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
          sort_order: index,
        }));

        const { error: itemsError } = await supabase
          .from('offer_line_items')
          .insert(newLineItems);

        if (itemsError) throw itemsError;
      }

      toast.success('Offer duplicated!');
      fetchOffers(); // Refresh list
    } catch (err) {
      console.error('Error duplicating offer:', err);
      toast.error('Failed to duplicate offer');
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
        <OfferTable
          offers={filteredOffers}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onInitiateTasks={handleInitiateTasks}
        />
      )}

      {/* Initiate Tasks Dialog */}
      {initiateTasksOfferId && (
        <InitiateTasksDialog
          open={!!initiateTasksOfferId}
          onOpenChange={(open) => {
            if (!open) setInitiateTasksOfferId(null);
          }}
          offerId={initiateTasksOfferId}
          offerNumber={offers.find((o) => o.id === initiateTasksOfferId)?.offerNumber || ''}
          lineItems={initiateTasksLineItems}
          onSuccess={handleTasksInitiated}
        />
      )}
    </PageWrapper>
  );
}
