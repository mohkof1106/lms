'use client';

import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DbTask, DbTaskPriority, TaskBoardColumn } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckSquare,
  Clock,
  Star,
  UserX,
  GripVertical,
} from 'lucide-react';

const priorityColors: Record<DbTaskPriority, string> = {
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

interface TasksByEmployeeViewProps {
  tasks: DbTask[];
  columns: TaskBoardColumn[];
  onTaskClick: (task: DbTask) => void;
  onToggleStar?: (taskId: string, currentStarred: boolean) => void;
  onTaskMove?: (taskId: string, newColumnId: string) => Promise<void>;
}

interface EmployeeGroup {
  employeeId: string;
  employeeName: string;
  tasks: DbTask[];
}

export function TasksByEmployeeView({
  tasks,
  columns,
  onTaskClick,
  onToggleStar,
  onTaskMove,
}: TasksByEmployeeViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['__all__']));

  // Find Today and Completed columns by name
  const todayColumn = columns.find((c) => c.name === 'Today');
  const completedColumn = columns.find((c) => c.name === 'Completed');
  // Default backlog column (first column, usually "Backlog")
  const backlogColumn = columns.find((c) => c.name === 'Backlog');

  const { grouped, unassigned } = useMemo(() => {
    const map = new Map<string, EmployeeGroup>();
    const unassignedTasks: DbTask[] = [];

    tasks.forEach((task) => {
      // Skip completed tasks
      if (completedColumn && task.columnId === completedColumn.id) return;

      const employeeIds = new Set<string>();
      const employeeNames = new Map<string, string>();

      task.subtasks?.forEach((st) => {
        st.assignees?.forEach((a) => {
          employeeIds.add(a.employeeId);
          employeeNames.set(a.employeeId, a.employeeName);
        });
      });

      if (employeeIds.size === 0) {
        unassignedTasks.push(task);
      } else {
        employeeIds.forEach((empId) => {
          if (!map.has(empId)) {
            map.set(empId, {
              employeeId: empId,
              employeeName: employeeNames.get(empId) || 'Unknown',
              tasks: [],
            });
          }
          map.get(empId)!.tasks.push(task);
        });
      }
    });

    const sorted = Array.from(map.values()).sort((a, b) =>
      a.employeeName.localeCompare(b.employeeName)
    );

    return { grouped: sorted, unassigned: unassignedTasks };
  }, [tasks, completedColumn]);

  const isExpanded = (id: string) =>
    expandedSections.has('__all__') || expandedSections.has(id);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has('__all__')) {
        next.delete('__all__');
        grouped.forEach((g) => next.add(g.employeeId));
        if (unassigned.length > 0) next.add('__unassigned__');
        next.delete(id);
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    if (!onTaskMove) return;

    // Droppable IDs are like "empId-today" or "empId-backlog"
    const destType = destination.droppableId.endsWith('-today') ? 'today' : 'backlog';

    if (destType === 'today' && todayColumn) {
      await onTaskMove(draggableId, todayColumn.id);
    } else if (destType === 'backlog' && backlogColumn) {
      await onTaskMove(draggableId, backlogColumn.id);
    }
  };

  const splitTasks = (sectionTasks: DbTask[]) => {
    const backlog: DbTask[] = [];
    const today: DbTask[] = [];

    sectionTasks.forEach((task) => {
      if (todayColumn && task.columnId === todayColumn.id) {
        today.push(task);
      } else {
        backlog.push(task);
      }
    });

    return { backlog, today };
  };

  const renderTaskRow = (task: DbTask, index: number) => {
    const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    return (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md border bg-card hover:bg-muted/30 cursor-pointer transition-colors',
              snapshot.isDragging && 'shadow-lg opacity-90'
            )}
            onClick={() => onTaskClick(task)}
          >
            {/* Drag handle */}
            <div {...provided.dragHandleProps} className="shrink-0 text-muted-foreground/40 hover:text-muted-foreground">
              <GripVertical className="h-3.5 w-3.5" />
            </div>

            {/* Star - fixed with larger click area */}
            {onToggleStar && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(task.id, task.isStarred);
                }}
                className="shrink-0 p-1 rounded hover:bg-muted/50"
              >
                <Star
                  className={cn(
                    'h-4 w-4 transition-colors',
                    task.isStarred
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/40 hover:text-yellow-400'
                  )}
                />
              </button>
            )}

            {/* Title */}
            <span className="font-medium text-sm flex-1 truncate">{task.title}</span>

            {/* Column badge */}
            {task.columnName && (
              <Badge variant="outline" className="text-[10px] gap-1 shrink-0 px-1.5 py-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: task.columnColor || '#666' }}
                />
                {task.columnName}
              </Badge>
            )}

            {/* Priority */}
            <Badge
              variant="secondary"
              className={cn('text-[10px] shrink-0 px-1.5 py-0', priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>

            {/* Due date */}
            {task.dueDate && (
              <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(task.dueDate)}
              </span>
            )}

            {/* Hours */}
            {task.hoursEstimated > 0 && (
              <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                <Clock className="h-2.5 w-2.5" />
                {task.hoursEstimated}h
              </span>
            )}

            {/* Subtask progress */}
            {totalSubtasks > 0 && (
              <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                <CheckSquare className="h-2.5 w-2.5" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  const renderSection = (
    id: string,
    name: string,
    sectionTasks: DbTask[],
    icon?: React.ReactNode
  ) => {
    const expanded = isExpanded(id);
    const { backlog, today } = splitTasks(sectionTasks);

    return (
      <div key={id} className="border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          {icon || (
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          )}
          <span className="font-medium text-sm">{name}</span>
          <Badge variant="secondary" className="ml-auto">
            {sectionTasks.length} {sectionTasks.length === 1 ? 'task' : 'tasks'}
          </Badge>
        </button>
        {expanded && (
          <div className="border-t">
            <div className="grid grid-cols-2 gap-0">
              {/* Backlog column */}
              <div className="border-r">
                <div className="px-3 py-2 bg-muted/30 border-b flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Backlog</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {backlog.length}
                  </Badge>
                </div>
                <Droppable droppableId={`${id}-backlog`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'p-2 space-y-1.5 min-h-[60px] transition-colors',
                        snapshot.isDraggingOver && 'bg-muted/40'
                      )}
                    >
                      {backlog.length === 0 && !snapshot.isDraggingOver ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No backlog tasks</p>
                      ) : (
                        backlog.map((task, index) => renderTaskRow(task, index))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Today column */}
              <div>
                <div className="px-3 py-2 bg-muted/30 border-b flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Today</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {today.length}
                  </Badge>
                </div>
                <Droppable droppableId={`${id}-today`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'p-2 space-y-1.5 min-h-[60px] transition-colors',
                        snapshot.isDraggingOver && 'bg-primary/5'
                      )}
                    >
                      {today.length === 0 && !snapshot.isDraggingOver ? (
                        <p className="text-xs text-muted-foreground text-center py-3">No tasks for today</p>
                      ) : (
                        today.map((task, index) => renderTaskRow(task, index))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (grouped.length === 0 && unassigned.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks match your filters.</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-3">
        {grouped.map((group) =>
          renderSection(group.employeeId, group.employeeName, group.tasks)
        )}
        {unassigned.length > 0 &&
          renderSection(
            '__unassigned__',
            'Unassigned',
            unassigned,
            <UserX className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
      </div>
    </DragDropContext>
  );
}
