'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Invoice, InvoiceStatus } from '@/types';
import { invoiceStatusLabels } from '@/lib/mock-data/invoices';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { MoreHorizontal, Eye, CreditCard, FileText, Trash2 } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
}

const statusColors: Record<InvoiceStatus, string> = {
  unpaid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  partial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead className="w-[250px]">Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const paidPercent = Math.round((invoice.paidAmount / invoice.total) * 100);
            const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();

            return (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/customers/${invoice.customerId}`}
                    className="text-sm hover:text-primary"
                  >
                    {invoice.customerName}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDate(invoice.date)}</span>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                    {formatDate(invoice.dueDate)}
                    {isOverdue && ' (Overdue)'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={paidPercent} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">{paidPercent}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[invoice.status]}>
                    {invoiceStatusLabels[invoice.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/invoices/${invoice.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {invoice.status !== 'paid' && (
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Record Payment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
