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
import { StatusBadge } from '@/components/shared';
import { Service, ServiceCategory } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  powerpoint: 'Power Point',
  video: 'Video',
  branding: 'Branding',
};

interface ServiceTableProps {
  services: Service[];
  onDelete?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  social: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  print: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  branding: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  video: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  web: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  packaging: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  signage: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  motion: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

export function ServiceTable({ services, onDelete }: ServiceTableProps) {
  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Service</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Base Price</TableHead>
            <TableHead className="text-right">Est. Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <Link
                    href={`/services/${service.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {service.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={categoryColors[service.category] || ''}
                >
                  {serviceCategoryLabels[service.category]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-medium">{formatCurrency(service.basePrice)}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-muted-foreground">{service.estimatedHours}h</span>
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={service.active ? 'Active' : 'Inactive'}
                  variant={service.active ? 'success' : 'destructive'}
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
                      <Link href={`/services/${service.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/services/${service.id}?edit=true`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete?.(service.id)}
                    >
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
