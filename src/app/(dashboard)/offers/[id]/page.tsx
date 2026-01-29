'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOfferById, offerStatusLabels } from '@/lib/mock-data/offers';
import { getCustomerById } from '@/lib/mock-data/customers';
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
} from 'lucide-react';
import { OfferStatus } from '@/types';

const statusColors: Record<OfferStatus, string> = {
  draft: 'bg-slate-100 text-slate-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-yellow-100 text-yellow-800',
};

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();

  const offer = getOfferById(params.id as string);
  const customer = offer ? getCustomerById(offer.customerId) : undefined;

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

  const handleSendOffer = () => {
    toast.success('Offer sent to client!');
  };

  const handleMarkAccepted = () => {
    toast.success('Offer marked as accepted!');
  };

  const handleCreateInvoice = () => {
    toast.success('Invoice created!');
    router.push('/invoices');
  };

  const handleDownloadPDF = () => {
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

  // Internal cost calculations
  const hasInternalData = offer.laborCost && offer.laborCost > 0;
  const totalCost = (offer.laborCost || 0) + (offer.overheadAmount || 0);
  const actualProfit = offer.total - totalCost;

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
              <Button onClick={handleSendOffer}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </>
          )}
          {offer.status === 'sent' && (
            <>
              <Button variant="outline" onClick={() => toast.info('Marked as rejected')}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={handleMarkAccepted}>
                <CheckCircle className="h-4 w-4 mr-2" />
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
              <Button variant="outline" className="w-full justify-start" disabled>
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
