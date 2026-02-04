'use client';

import { useMemo } from 'react';
import { DbTaskCard } from './DbTaskCard';
import { DbTask, TaskBoardColumn } from '@/types';
import { cn } from '@/lib/utils';

interface DbKanbanBoardProps {
  tasks: DbTask[];
  columns: TaskBoardColumn[];
  onTaskMove?: (taskId: string, newColumnId: string) => Promise<void>;
}

export function DbKanbanBoard({ tasks, columns, onTaskMove }: DbKanbanBoardProps) {
  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [columns]);

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, DbTask[]> = {};
    columns.forEach((col) => {
      grouped[col.id] = [];
    });
    tasks.forEach((task) => {
      if (grouped[task.columnId]) {
        grouped[task.columnId].push(task);
      }
    });
    return grouped;
  }, [tasks, columns]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {sortedColumns.map((column) => {
        const columnTasks = tasksByColumn[column.id] || [];

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-72 bg-muted/50 rounded-lg border-t-4"
            style={{ borderTopColor: column.color }}
          >
            {/* Column Header */}
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{column.name}</h3>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-2 space-y-2 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <DbTaskCard
                    key={task.id}
                    task={task}
                    columns={sortedColumns}
                    onMove={onTaskMove}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
