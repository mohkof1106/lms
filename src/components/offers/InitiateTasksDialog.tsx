'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Rocket, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { OfferLineItem, ServiceSubtask } from '@/types';
import { formatDate } from '@/lib/utils/format';

interface LineItemWithDate {
  lineItem: OfferLineItem;
  targetDate: string;
  subtasks: ServiceSubtask[];
  estimatedHours: number;
}

interface InitiateTasksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string;
  offerNumber: string;
  lineItems: OfferLineItem[];
  onSuccess: () => void;
}

// Calculate subtask dates backward from completion date
function calculateSubtaskDates(
  completionDate: Date,
  subtasks: ServiceSubtask[]
): { title: string; percentage: number; targetDate: string; sortOrder: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completion = new Date(completionDate);
  completion.setHours(0, 0, 0, 0);

  const totalDays = Math.max(1, Math.ceil((completion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const sorted = [...subtasks].sort((a, b) => a.sortOrder - b.sortOrder);

  let cumulativePercent = 0;
  return sorted.map((subtask) => {
    cumulativePercent += subtask.percentage;
    const daysFromStart = Math.ceil(totalDays * (cumulativePercent / 100));
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysFromStart);

    return {
      title: subtask.title,
      percentage: subtask.percentage,
      targetDate: targetDate.toISOString().split('T')[0],
      sortOrder: subtask.sortOrder,
    };
  });
}

export function InitiateTasksDialog({
  open,
  onOpenChange,
  offerId,
  offerNumber,
  lineItems,
  onSuccess,
}: InitiateTasksDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [items, setItems] = useState<LineItemWithDate[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Default target date: 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  const defaultDateStr = defaultDate.toISOString().split('T')[0];

  // Load service subtasks when dialog opens
  useEffect(() => {
    if (open && lineItems.length > 0) {
      loadServiceData();
    }
  }, [open, lineItems]);

  async function loadServiceData() {
    setLoadingServices(true);
    try {
      // Get unique service IDs
      const serviceIds = lineItems
        .filter((item) => item.serviceId)
        .map((item) => item.serviceId!);

      let servicesMap: Record<string, { subtasks: ServiceSubtask[]; estimatedHours: number }> = {};

      if (serviceIds.length > 0) {
        const { data: services } = await supabase
          .from('services')
          .select(`
            id,
            estimated_hours,
            service_subtasks (id, title, percentage, sort_order)
          `)
          .in('id', serviceIds);

        if (services) {
          services.forEach((service: any) => {
            servicesMap[service.id] = {
              estimatedHours: service.estimated_hours || 0,
              subtasks: (service.service_subtasks || []).map((st: any) => ({
                id: st.id,
                serviceId: service.id,
                title: st.title,
                percentage: Number(st.percentage),
                sortOrder: st.sort_order || 0,
              })),
            };
          });
        }
      }

      // Build items with dates
      const itemsWithDates: LineItemWithDate[] = lineItems.map((item) => {
        const serviceData = item.serviceId ? servicesMap[item.serviceId] : null;
        return {
          lineItem: item,
          targetDate: defaultDateStr,
          subtasks: serviceData?.subtasks || [],
          estimatedHours: serviceData?.estimatedHours || 0,
        };
      });

      setItems(itemsWithDates);
    } catch (err) {
      console.error('Error loading service data:', err);
    } finally {
      setLoadingServices(false);
    }
  }

  const updateItemDate = (itemId: string, date: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.lineItem.id === itemId ? { ...item, targetDate: date } : item
      )
    );
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Calculate total tasks to be created (one per line item)
  const totalTasks = items.length;

  const handleInitiate = async () => {
    setLoading(true);
    try {
      // Get backlog column ID
      const { data: columns } = await (supabase as any)
        .from('task_board_columns')
        .select('id')
        .eq('name', 'Backlog')
        .single();

      if (!columns) throw new Error('Backlog column not found');
      const backlogColumnId = columns.id;

      // Create ONE task per line item (not per quantity)
      for (const item of items) {
        const completionDate = new Date(item.targetDate);
        const totalHours = item.estimatedHours * item.lineItem.quantity;

        // Create task
        const { data: task, error: taskError } = await (supabase as any)
          .from('tasks')
          .insert({
            offer_id: offerId,
            offer_line_item_id: item.lineItem.id,
            service_id: item.lineItem.serviceId || null,
            column_id: backlogColumnId,
            title: item.lineItem.description,
            priority: 'medium',
            target_completion_date: item.targetDate,
            due_date: item.targetDate,
            hours_estimated: totalHours,
          })
          .select()
          .single();

        if (taskError) throw taskError;

        // Create subtasks if service has subtasks
        if (item.subtasks.length > 0) {
          const subtaskDates = calculateSubtaskDates(completionDate, item.subtasks);

          const subtasksToInsert = subtaskDates.map((st, index) => ({
            task_id: task.id,
            service_subtask_id: item.subtasks[index]?.id || null,
            title: st.title,
            percentage: st.percentage,
            hours_estimated: (totalHours * st.percentage) / 100,
            target_date: st.targetDate,
            sort_order: st.sortOrder,
          }));

          const { error: subtaskError } = await (supabase as any)
            .from('task_subtasks')
            .insert(subtasksToInsert);

          if (subtaskError) throw subtaskError;
        }
      }

      // Mark offer as tasks initiated
      const { error: offerError } = await supabase
        .from('offers')
        .update({ tasks_initiated: true })
        .eq('id', offerId);

      if (offerError) throw offerError;

      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Error initiating tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Initiate Tasks
          </DialogTitle>
          <DialogDescription>
            Set target completion dates for each deliverable in{' '}
            <span className="font-medium">{offerNumber}</span>. Tasks will be
            created in Backlog with calculated subtask milestones.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          {loadingServices ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const isExpanded = expandedItems.has(item.lineItem.id);
                const hasSubtasks = item.subtasks.length > 0;
                const subtaskDates = hasSubtasks
                  ? calculateSubtaskDates(new Date(item.targetDate), item.subtasks)
                  : [];

                return (
                  <div
                    key={item.lineItem.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3">
                        {hasSubtasks && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(item.lineItem.id)}
                            className="mt-1 text-muted-foreground hover:text-foreground"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium truncate">
                              {item.lineItem.description}
                            </span>
                            {item.lineItem.quantity > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                x{item.lineItem.quantity}
                              </Badge>
                            )}
                            {hasSubtasks && (
                              <Badge variant="outline" className="text-xs">
                                {item.subtasks.length} subtasks
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            value={item.targetDate}
                            onChange={(e) =>
                              updateItemDate(item.lineItem.id, e.target.value)
                            }
                            className="w-40 h-8"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtask preview */}
                    {isExpanded && hasSubtasks && (
                      <div className="border-t bg-background">
                        <div className="p-3 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Subtask Milestones
                          </p>
                          {subtaskDates.map((st, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-sm py-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-12 text-muted-foreground">
                                  {st.percentage}%
                                </span>
                                <span>{st.title}</span>
                              </div>
                              <span className="text-muted-foreground">
                                {formatDate(st.targetDate)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleInitiate} disabled={loading || loadingServices}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4 mr-2" />
            )}
            Create {totalTasks} Task{totalTasks !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
