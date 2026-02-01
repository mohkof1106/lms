'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { offerStatusLabels } from '@/lib/mock-data/offers';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { generateOfferPDF } from '@/lib/utils/offer-pdf';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Send,
  CheckCircle,
  XCircle,
  FileText,
  Building2,
  Calendar,
  Download,
  Calculator,
  Loader2,
  Copy,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { Offer, OfferLineItem, OfferStatus, Customer } from '@/types';

const statusColors: Record<OfferStatus, string> = {
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  expired: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [offer, setOffer] = useState<Offer | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Edit mode state
  const [editLineItems, setEditLineItems] = useState<LineItem[]>([]);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editVatRate, setEditVatRate] = useState(5);
  const [editTerms, setEditTerms] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const offerId = params.id as string;

  useEffect(() => {
    if (offerId) fetchOffer();
  }, [offerId]);

  useEffect(() => {
    if (offer && isEditMode) {
      setEditLineItems(
        offer.lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      );
      setEditDiscount(offer.discountPercent || 0);
      setEditVatRate(offer.vatRate);
      setEditTerms(offer.terms || '');
      setEditNotes(offer.notes || '');
    }
  }, [offer, isEditMode]);

  async function fetchOffer() {
    setLoading(true);
    try {
      const { data: offerData, error } = await supabase
        .from('offers')
        .select(`
          *,
          customers (id, name, location, trn),
          offer_line_items (*)
        `)
        .eq('id', offerId)
        .single();

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      let displayStatus: OfferStatus = offerData.status as OfferStatus;
      if (offerData.status === 'sent' && offerData.valid_until < today) {
        displayStatus = 'expired';
      }

      const lineItems: OfferLineItem[] = (offerData.offer_line_items || [])
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((item: {
          id: string;
          service_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          total: number;
        }) => ({
          id: item.id,
          serviceId: item.service_id || undefined,
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price),
          total: Number(item.total),
        }));

      const mapped: Offer = {
        id: offerData.id,
        offerNumber: offerData.offer_number,
        customerId: offerData.customer_id,
        customerName: offerData.customers?.name || 'Unknown Customer',
        date: offerData.date,
        validUntil: offerData.valid_until,
        lineItems,
        subtotal: Number(offerData.subtotal),
        discountPercent: Number(offerData.discount_percent) || undefined,
        discountAmount: Number(offerData.discount_amount) || undefined,
        vatRate: Number(offerData.vat_rate),
        vatAmount: Number(offerData.vat_amount),
        total: Number(offerData.total),
        terms: offerData.terms || undefined,
        status: displayStatus,
        notes: offerData.notes || undefined,
        laborCost: Number(offerData.labor_cost) || undefined,
        overheadPercent: Number(offerData.overhead_percent) || undefined,
        overheadAmount: Number(offerData.overhead_amount) || undefined,
        profitAmount: Number(offerData.profit_amount) || undefined,
      };

      setOffer(mapped);

      if (offerData.customers) {
        setCustomer({
          id: offerData.customers.id,
          name: offerData.customers.name,
          location: offerData.customers.location || '',
          trn: offerData.customers.trn || undefined,
          contacts: [],
          activeProjects: 0,
          activePackages: 0,
          createdAt: '',
        });
      }
    } catch (err) {
      console.error('Error fetching offer:', err);
      toast.error('Failed to load offer');
    } finally {
      setLoading(false);
    }
  }

  const handleSendOffer = async () => {
    if (!offer) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'sent' })
        .eq('id', offer.id);

      if (error) throw error;

      toast.success('Offer sent to client!');
      setOffer({ ...offer, status: 'sent' });
    } catch (err) {
      console.error('Error sending offer:', err);
      toast.error('Failed to send offer');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAccepted = async () => {
    if (!offer) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offer.id);

      if (error) throw error;

      toast.success('Offer marked as accepted!');
      setOffer({ ...offer, status: 'accepted' });
    } catch (err) {
      console.error('Error updating offer:', err);
      toast.error('Failed to update offer');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkRejected = async () => {
    if (!offer) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offer.id);

      if (error) throw error;

      toast.success('Offer marked as rejected');
      setOffer({ ...offer, status: 'rejected' });
    } catch (err) {
      console.error('Error updating offer:', err);
      toast.error('Failed to update offer');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateInvoice = () => {
    if (!offer) return;
    // Store offer data in sessionStorage for invoice creation
    sessionStorage.setItem(
      'offerToInvoice',
      JSON.stringify({
        offerId: offer.id,
        customerId: offer.customerId,
        lineItems: offer.lineItems,
        subtotal: offer.subtotal,
        discountPercent: offer.discountPercent,
        discountAmount: offer.discountAmount,
        vatRate: offer.vatRate,
        vatAmount: offer.vatAmount,
        total: offer.total,
      })
    );
    router.push('/invoices/new');
  };

  const handleDuplicateOffer = async () => {
    if (!offer) return;
    setUpdating(true);
    try {
      // Calculate new valid_until (30 days from today)
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + 30);
      const validUntil = validUntilDate.toISOString().split('T')[0];

      // Create new offer (offer_number auto-generated)
      const { data: newOffer, error: offerError } = await supabase
        .from('offers')
        .insert({
          customer_id: offer.customerId,
          title: null,
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
      if (offer.lineItems.length > 0) {
        const lineItemsToInsert = offer.lineItems.map((item, index) => ({
          offer_id: newOffer.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total,
          sort_order: index,
        }));

        const { error: itemsError } = await supabase
          .from('offer_line_items')
          .insert(lineItemsToInsert);

        if (itemsError) throw itemsError;
      }

      toast.success('Offer duplicated!');
      router.push(`/offers/${newOffer.id}`);
    } catch (err) {
      console.error('Error duplicating offer:', err);
      toast.error('Failed to duplicate offer');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!offer) return;
    generateOfferPDF({
      offerNumber: offer.offerNumber,
      date: offer.date,
      customerName: offer.customerName,
      customerLocation: customer?.location || '',
      customerTrn: customer?.trn,
      projectTitle: undefined,
      lineItems: offer.lineItems.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: offer.subtotal,
      discountPercent: offer.discountPercent,
      discountAmount: offer.discountAmount,
      vatRate: offer.vatRate,
      vatAmount: offer.vatAmount,
      total: offer.total,
      terms: offer.terms,
    });

    toast.success('PDF downloaded!');
  };

  // Edit mode handlers
  const handleAddLineItem = () => {
    setEditLineItems([
      ...editLineItems,
      {
        id: `NEW-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setEditLineItems(editLineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setEditLineItems(
      editLineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const editSubtotal = editLineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const editDiscountAmount = editSubtotal * (editDiscount / 100);
  const editSubtotalAfterDiscount = editSubtotal - editDiscountAmount;
  const editVatAmount = editSubtotalAfterDiscount * (editVatRate / 100);
  const editTotal = editSubtotalAfterDiscount + editVatAmount;

  const handleSaveEdit = async () => {
    if (!offer) return;
    if (editLineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    setUpdating(true);
    try {
      // Update offer
      const { error: offerError } = await supabase
        .from('offers')
        .update({
          subtotal: editSubtotal,
          discount_percent: editDiscount,
          discount_amount: editDiscountAmount,
          vat_rate: editVatRate,
          vat_amount: editVatAmount,
          total: editTotal,
          terms: editTerms || null,
          notes: editNotes || null,
        })
        .eq('id', offer.id);

      if (offerError) throw offerError;

      // Delete old line items
      const { error: deleteError } = await supabase
        .from('offer_line_items')
        .delete()
        .eq('offer_id', offer.id);

      if (deleteError) throw deleteError;

      // Insert new line items
      const lineItemsToInsert = editLineItems.map((item, index) => ({
        offer_id: offer.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.quantity * item.unitPrice,
        sort_order: index,
      }));

      const { error: itemsError } = await supabase
        .from('offer_line_items')
        .insert(lineItemsToInsert);

      if (itemsError) throw itemsError;

      toast.success('Offer updated successfully!');
      router.push(`/offers/${offer.id}`);
    } catch (err) {
      console.error('Error updating offer:', err);
      toast.error('Failed to update offer');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    router.push(`/offers/${offer?.id}`);
  };

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (!offer) {
    return (
      <PageWrapper title="Offer Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The offer you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/offers">Back to Offers</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Internal cost calculations
  const hasInternalData = offer.laborCost && offer.laborCost > 0;
  const totalCost = (offer.laborCost || 0) + (offer.overheadAmount || 0);
  const subtotalAfterDiscount = offer.subtotal - (offer.discountAmount || 0);
  const actualProfit = subtotalAfterDiscount - totalCost;

  // Edit mode view
  if (isEditMode && offer.status === 'draft') {
    return (
      <PageWrapper
        title={`Edit ${offer.offerNumber}`}
        description={offer.customerName}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updating}>
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Line Items Editor */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Line Items</CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddLineItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {editLineItems.length > 0 ? (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Description</TableHead>
                          <TableHead className="w-20 text-center">Qty</TableHead>
                          <TableHead className="w-32 text-right">Unit Price</TableHead>
                          <TableHead className="w-32 text-right">Total</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editLineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                value={item.description}
                                onChange={(e) =>
                                  handleLineItemChange(item.id, 'description', e.target.value)
                                }
                                placeholder="Service description"
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleLineItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-center h-8"
                                min={1}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                                }
                                className="w-28 text-right h-8"
                                min={0}
                              />
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveLineItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                    No items. Click "Add Item" to get started.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terms & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea
                    value={editTerms}
                    onChange={(e) => setEditTerms(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Any internal notes..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(editSubtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Discount</span>
                      <Input
                        type="number"
                        value={editDiscount}
                        onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)}
                        className="w-16 h-6 text-center text-sm"
                        min={0}
                        max={100}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    {editDiscount > 0 && (
                      <span className="font-medium text-red-600">-{formatCurrency(editDiscountAmount)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">VAT</span>
                      <Input
                        type="number"
                        value={editVatRate}
                        onChange={(e) => setEditVatRate(parseFloat(e.target.value) || 0)}
                        className="w-16 h-6 text-center text-sm"
                        min={0}
                        max={100}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <span className="font-medium">{formatCurrency(editVatAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">{formatCurrency(editTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Normal view
  return (
    <PageWrapper
      title={offer.offerNumber}
      description={offer.customerName}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/offers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          {offer.status === 'draft' && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/offers/${offer.id}?edit=true`}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button onClick={handleSendOffer} disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Send
              </Button>
            </>
          )}
          {offer.status === 'sent' && (
            <>
              <Button variant="outline" onClick={handleMarkRejected} disabled={updating}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={handleMarkAccepted} disabled={updating}>
                {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Accept
              </Button>
            </>
          )}
          {offer.status === 'accepted' && (
            <Button onClick={handleCreateInvoice}>
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Offer Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{offer.offerNumber}</h2>
                  <Link
                    href={`/customers/${offer.customerId}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {offer.customerName}
                  </Link>
                </div>
                <Badge variant="secondary" className={statusColors[offer.status]}>
                  {offerStatusLabels[offer.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{formatDate(offer.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-semibold">{formatDate(offer.validUntil)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="font-semibold">{offer.lineItems.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offer.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium">{item.description}</p>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 space-y-2">
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(offer.subtotal)}</span>
                </div>
                {offer.discountPercent && offer.discountPercent > 0 && offer.discountAmount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount ({offer.discountPercent}%)</span>
                    <span className="font-medium text-red-600">-{formatCurrency(offer.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT ({offer.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(offer.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(offer.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          {offer.terms && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">{offer.terms}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(offer.total)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Total Amount</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Line Items</span>
                  <span>{offer.lineItems.length}</span>
                </div>
                {offer.discountPercent && offer.discountPercent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-red-600">{offer.discountPercent}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT Rate</span>
                  <span>{offer.vatRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Summary (if data exists) */}
          {hasInternalData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                  Internal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Labor Cost</span>
                  <span className="font-medium">{formatCurrency(offer.laborCost || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overhead ({offer.overheadPercent}%)</span>
                  <span className="font-medium">{formatCurrency(offer.overheadAmount || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-medium">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Profit</span>
                  <span className="font-medium text-green-600">+{formatCurrency(offer.profitAmount || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Profit</span>
                  <span className={`font-bold ${actualProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {actualProfit >= 0 ? '+' : ''}{formatCurrency(actualProfit)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {offer.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{offer.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleDuplicateOffer}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Duplicate Offer
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/customers/${offer.customerId}`}>
                  View Customer
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
