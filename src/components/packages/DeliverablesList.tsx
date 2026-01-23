'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PackageDeliverable } from '@/types';
import { deliverablePeriodLabels } from '@/lib/mock-data/packages';
import { CheckCircle2, Circle } from 'lucide-react';

interface DeliverablesListProps {
  deliverables: PackageDeliverable[];
}

export function DeliverablesList({ deliverables }: DeliverablesListProps) {
  if (deliverables.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        No deliverables defined.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {deliverables.map((deliverable) => {
        const progress = Math.round((deliverable.completedThisPeriod / deliverable.quantity) * 100);
        const isComplete = deliverable.completedThisPeriod >= deliverable.quantity;

        return (
          <Card key={deliverable.id} className={isComplete ? 'border-green-500/50' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-medium">{deliverable.serviceName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {deliverable.quantity} / {deliverablePeriodLabels[deliverable.period]}
                    </p>
                  </div>
                </div>
                <Badge variant={isComplete ? 'default' : 'secondary'}>
                  {deliverable.completedThisPeriod} / {deliverable.quantity}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={progress} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {progress}%
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
