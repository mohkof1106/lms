'use client';

import { useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '@/types';
import { taskStatusLabels, taskStatusOrder } from '@/lib/mock-data/tasks';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
}

const columnColors: Record<TaskStatus, string> = {
  brief: 'border-t-slate-500',
  concept: 'border-t-purple-500',
  design: 'border-t-blue-500',
  revisions: 'border-t-orange-500',
  approval: 'border-t-yellow-500',
  delivered: 'border-t-green-500',
};

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const columns = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      brief: [],
      concept: [],
      design: [],
      revisions: [],
      approval: [],
      delivered: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    return taskStatusOrder.map((status) => ({
      status,
      label: taskStatusLabels[status],
      tasks: grouped[status],
    }));
  }, [tasks]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className={cn(
            'flex-shrink-0 w-72 bg-muted/50 rounded-lg border-t-4',
            columnColors[column.status]
          )}
        >
          {/* Column Header */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{column.label}</h3>
              <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                {column.tasks.length}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div className="p-2 space-y-2 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto">
            {column.tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground">No tasks</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
