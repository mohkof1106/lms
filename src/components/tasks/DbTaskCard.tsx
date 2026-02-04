'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DbTask, DbTaskPriority, TaskBoardColumn } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { Calendar, CheckSquare, MoreVertical, MoveRight, Clock } from 'lucide-react';

interface DbTaskCardProps {
  task: DbTask;
  columns: TaskBoardColumn[];
  onMove?: (taskId: string, newColumnId: string) => Promise<void>;
}

const priorityColors: Record<DbTaskPriority, string> = {
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function DbTaskCard({ task, columns, onMove }: DbTaskCardProps) {
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  // Get unique assignees from subtasks
  const assigneeNames = new Set<string>();
  task.subtasks?.forEach((subtask) => {
    subtask.assignees?.forEach((a) => assigneeNames.add(a.employeeName));
  });
  const assigneeList = Array.from(assigneeNames);

  // Find other columns for move action
  const otherColumns = columns.filter((c) => c.id !== task.columnId);

  return (
    <Card className="group hover:border-primary transition-colors cursor-pointer relative">
      <Link href={`/tasks/${task.id}`}>
        <CardContent className="p-4 space-y-3">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <Badge variant="secondary" className={`shrink-0 text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>

          {/* Offer/Customer Info */}
          {(task.offerNumber || task.customerName) && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {task.offerNumber && <span className="font-medium">{task.offerNumber}</span>}
              {task.offerNumber && task.customerName && ' • '}
              {task.customerName}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {task.hoursEstimated > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{task.hoursEstimated}h</span>
              </div>
            )}
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
            {task.revisionCount > 0 && (
              <Badge variant="outline" className="text-xs">
                R{task.revisionCount}
              </Badge>
            )}
          </div>

          {/* Assignees (from subtasks) */}
          {assigneeList.length > 0 && (
            <div className="flex items-center gap-1">
              {assigneeList.slice(0, 3).map((name, index) => (
                <Avatar key={index} className="h-6 w-6">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assigneeList.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{assigneeList.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Link>

      {/* Move dropdown - show on hover */}
      {onMove && otherColumns.length > 0 && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {otherColumns.map((col) => (
                <DropdownMenuItem
                  key={col.id}
                  onClick={() => onMove(task.id, col.id)}
                  className="cursor-pointer"
                >
                  <MoveRight className="h-4 w-4 mr-2" />
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: col.color }}
                  />
                  {col.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Card>
  );
}
