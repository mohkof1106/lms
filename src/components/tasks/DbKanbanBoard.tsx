'use client';

import { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DbTaskCard } from './DbTaskCard';
import { DbTask, TaskBoardColumn } from '@/types';

interface DbKanbanBoardProps {
  tasks: DbTask[];
  columns: TaskBoardColumn[];
  onTaskMove?: (taskId: string, newColumnId: string) => Promise<void>;
  onTaskClick?: (task: DbTask) => void;
}

export function DbKanbanBoard({ tasks, columns, onTaskMove, onTaskClick }: DbKanbanBoardProps) {
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

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Call the move handler if column changed
    if (destination.droppableId !== source.droppableId && onTaskMove) {
      await onTaskMove(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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

              {/* Column Content - Droppable */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 space-y-2 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto transition-colors ${
                      snapshot.isDraggingOver ? 'bg-muted/80' : ''
                    }`}
                  >
                    {columnTasks.length === 0 && !snapshot.isDraggingOver ? (
                      <div className="text-center py-8">
                        <p className="text-xs text-muted-foreground">No tasks</p>
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'opacity-90' : ''}
                            >
                              <DbTaskCard
                                task={task}
                                columns={sortedColumns}
                                onMove={onTaskMove}
                                onClick={onTaskClick}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
