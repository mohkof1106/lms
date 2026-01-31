'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInvoiceById, invoiceStatusLabels, paymentMethodLabels } from '@/lib/mock-data/invoices';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CreditCard,
  FileText,
  Building2,
  Calendar,
} from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';
import { InvoiceStatus } from '@/types';

const statusColors: Record<InvoiceStatus, string> = {
  unpaid: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
};

export default function InvoiceDetailPage() {
  const params = useParams();

  const invoice = getInvoiceById(params.id as string);

  if (!invoice) {
    return (
      <PageWrapper title="Invoice Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The invoice you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const paidPercent = Math.round((invoice.paidAmount / invoice.total) * 100);
  const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();

  const handleRecordPayment = () => {
    toast.success('Payment recorded!');
  };

  return (
    <PageWrapper
      title={invoice.invoiceNumber}
      description={invoice.customerName}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/invoices">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          {invoice.status !== 'paid' && (
            <Button onClick={handleRecordPayment}>
              <CreditCard className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{invoice.invoiceNumber}</h2>
                  <Link
                    href={`/customers/${invoice.customerId}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {invoice.customerName}
                  </Link>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className={statusColors[invoice.status]}>
                    {invoiceStatusLabels[invoice.status]}
                  </Badge>
                  {isOverdue && (
                    <p className="text-sm text-red-600 mt-1">Overdue</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{formatDate(invoice.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className={`font-semibold ${isOverdue ? 'text-red-600' : ''}`}>
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AedIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <p className="font-semibold">{formatCurrency(invoice.paidAmount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AedIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-semibold">{formatCurrency(invoice.balance)}</p>
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
                  {invoice.lineItems.map((item) => (
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
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT ({invoice.vatRate}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.vatAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No payments recorded</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{paymentMethodLabels[payment.method]}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.reference || '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          +{formatCurrency(payment.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Payment Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-primary">{paidPercent}%</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(invoice.paidAmount)} of {formatCurrency(invoice.total)}
                </p>
              </div>
              <Progress value={paidPercent} className="h-3" />
              {invoice.balance > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {formatCurrency(invoice.balance)} remaining
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Send Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/customers/${invoice.customerId}`}>
                  <Building2 className="h-4 w-4 mr-2" />
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
