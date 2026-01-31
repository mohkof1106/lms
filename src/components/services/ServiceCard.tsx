'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Service, ServiceCategory } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Clock, Trash2 } from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  powerpoint: 'Power Point',
  video: 'Video',
  branding: 'Branding',
};

interface ServiceCardProps {
  service: Service;
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

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(service.id);
  };

  return (
    <Link href={`/services/${service.id}`}>
      <Card className="h-full hover:border-primary transition-colors cursor-pointer relative group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{service.name}</h3>
              <Badge
                variant="secondary"
                className={`mt-2 ${categoryColors[service.category] || ''}`}
              >
                {serviceCategoryLabels[service.category]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {!service.active && (
                <Badge variant="outline" className="text-muted-foreground shrink-0">
                  Inactive
                </Badge>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {service.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <AedIcon className="h-4 w-4" />
              <span className="font-medium text-foreground">
                {formatCurrency(service.basePrice)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{service.estimatedHours}h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
