'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { InvoiceTable } from '@/components/invoices';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockInvoices, invoiceStatusLabels, getOverdueInvoices } from '@/lib/mock-data/invoices';
import { formatCurrency } from '@/lib/utils/format';
import { Plus, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOutstanding = mockInvoices
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + i.balance, 0);
    const totalOverdue = getOverdueInvoices().reduce((sum, i) => sum + i.balance, 0);
    const totalPaid = mockInvoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0);

    return { totalOutstanding, totalOverdue, totalPaid };
  }, []);

  return (
    <PageWrapper
      title="Invoices"
      description={`${mockInvoices.length} total invoices`}
      actions={
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Link>
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalOutstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalOverdue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid (This Month)</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search invoices..."
          className="flex-1 max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(invoiceStatusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No invoices found matching your criteria.</p>
        </div>
      ) : (
        <InvoiceTable invoices={filteredInvoices} />
      )}
    </PageWrapper>
  );
}
