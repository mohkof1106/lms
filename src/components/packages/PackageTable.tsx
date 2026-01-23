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
import { StatusBadge } from '@/components/shared';
import { Package } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface PackageTableProps {
  packages: Package[];
}

export function PackageTable({ packages }: PackageTableProps) {
  const getDeliverableProgress = (pkg: Package) => {
    const total = pkg.deliverables.reduce((sum, d) => sum + d.quantity, 0);
    const completed = pkg.deliverables.reduce((sum, d) => sum + d.completedThisPeriod, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Package</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Monthly Fee</TableHead>
            <TableHead>Deliverables</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => {
            const progress = getDeliverableProgress(pkg);
            return (
              <TableRow key={pkg.id}>
                <TableCell>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {pkg.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/customers/${pkg.customerId}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {pkg.customerName}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{formatCurrency(pkg.monthlyFee)}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{pkg.deliverables.length} items</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-20 h-2" />
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={pkg.active ? 'Active' : 'Inactive'}
                    variant={pkg.active ? 'success' : 'destructive'}
                  />
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
                        <Link href={`/packages/${pkg.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/packages/${pkg.id}?edit=true`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
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
