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
import { Offer, OfferStatus } from '@/types';
import { offerStatusLabels } from '@/lib/mock-data/offers';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { MoreHorizontal, Eye, Pencil, FileText, Trash2 } from 'lucide-react';

interface OfferTableProps {
  offers: Offer[];
}

const statusColors: Record<OfferStatus, string> = {
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  expired: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export function OfferTable({ offers }: OfferTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer #</TableHead>
            <TableHead className="w-[250px]">Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>
                <Link
                  href={`/offers/${offer.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {offer.offerNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Link
                  href={`/customers/${offer.customerId}`}
                  className="text-sm hover:text-primary"
                >
                  {offer.customerName}
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-sm">{formatDate(offer.date)}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDate(offer.validUntil)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium">{formatCurrency(offer.total)}</span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[offer.status]}>
                  {offerStatusLabels[offer.status]}
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
                      <Link href={`/offers/${offer.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/offers/${offer.id}?edit=true`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {offer.status === 'accepted' && (
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Create Invoice
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
