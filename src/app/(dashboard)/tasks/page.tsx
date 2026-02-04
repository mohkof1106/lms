'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { DbKanbanBoard } from '@/components/tasks/DbKanbanBoard';
import { TaskEditDialog } from '@/components/tasks/TaskEditDialog';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { DbTask, DbTaskPriority, TaskBoardColumn } from '@/types';
import { Plus, Loader2, Settings } from 'lucide-react';
import { toast } from 'sonner';

const priorityLabels: Record<DbTaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

function TasksContent() {
  const searchParams = useSearchParams();
  const offerFilter = searchParams.get('offer') || '';

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [columns, setColumns] = useState<TaskBoardColumn[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Task edit dialog
  const [selectedTask, setSelectedTask] = useState<DbTask | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch columns
      const { data: columnsData, error: columnsError } = await (supabase as any)
        .from('task_board_columns')
        .select('*')
        .order('sort_order');

      if (columnsError) throw columnsError;

      const mappedColumns: TaskBoardColumn[] = (columnsData || []).map((col: any) => ({
        id: col.id,
        name: col.name,
        color: col.color,
        sortOrder: col.sort_order,
        isSystem: col.is_system,
      }));
      setColumns(mappedColumns);

      // Fetch tasks with subtasks and assignees
      const { data: tasksData, error: tasksError } = await (supabase as any)
        .from('tasks')
        .select(`
          *,
          offers (offer_number, customers (name)),
          services (name),
          task_board_columns (name, color),
          task_subtasks (
            id,
            title,
            percentage,
            hours_estimated,
            hours_actual,
            target_date,
            completed,
            completed_at,
            status,
            sort_order,
            task_subtask_assignees (
              id,
              employee_id,
              employees (full_name, job_title)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      const mappedTasks: DbTask[] = (tasksData || []).map((task: any) => ({
        id: task.id,
        offerId: task.offer_id,
        offerLineItemId: task.offer_line_item_id,
        serviceId: task.service_id,
        columnId: task.column_id,
        title: task.title,
        description: task.description,
        priority: task.priority as DbTaskPriority,
        dueDate: task.due_date,
        targetCompletionDate: task.target_completion_date,
        hoursEstimated: Number(task.hours_estimated) || 0,
        hoursActual: Number(task.hours_actual) || 0,
        revisionCount: task.revision_count || 0,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        offerNumber: task.offers?.offer_number,
        customerName: task.offers?.customers?.name,
        serviceName: task.services?.name,
        columnName: task.task_board_columns?.name,
        columnColor: task.task_board_columns?.color,
        subtasks: (task.task_subtasks || []).map((st: any) => ({
          id: st.id,
          taskId: task.id,
          title: st.title,
          percentage: Number(st.percentage),
          hoursEstimated: Number(st.hours_estimated) || 0,
          hoursActual: Number(st.hours_actual) || 0,
          targetDate: st.target_date,
          completed: st.completed,
          completedAt: st.completed_at,
          status: st.status || 'pending',
          sortOrder: st.sort_order || 0,
          assignees: (st.task_subtask_assignees || []).map((a: any) => ({
            id: a.id,
            employeeId: a.employee_id,
            employeeName: a.employees?.full_name || 'Unknown',
            employeeJobTitle: a.employees?.job_title,
          })),
        })),
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  const handleTaskMove = async (taskId: string, newColumnId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ column_id: newColumnId })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                columnId: newColumnId,
                columnName: columns.find((c) => c.id === newColumnId)?.name,
                columnColor: columns.find((c) => c.id === newColumnId)?.color,
              }
            : task
        )
      );

      toast.success('Task moved');
    } catch (err) {
      console.error('Error moving task:', err);
      toast.error('Failed to move task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(searchLower) ||
        task.offerNumber?.toLowerCase().includes(searchLower) ||
        task.customerName?.toLowerCase().includes(searchLower);

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesOffer = !offerFilter || task.offerId === offerFilter;

      return matchesSearch && matchesPriority && matchesOffer;
    });
  }, [tasks, search, priorityFilter, offerFilter]);

  // Count active tasks (not in Completed column)
  const completedColumn = columns.find((c) => c.name === 'Completed');
  const activeTasks = tasks.filter((t) => t.columnId !== completedColumn?.id).length;

  const handleTaskClick = (task: DbTask) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleTaskUpdate = () => {
    fetchData();
  };

  if (loading) {
    return (
      <PageWrapper title="Tasks">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Tasks"
      description={`${activeTasks} active tasks`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tasks/columns">
              <Settings className="h-4 w-4 mr-2" />
              Manage Columns
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Link>
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          className="flex-1 max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {Object.entries(priorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      {filteredTasks.length === 0 && tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks yet.</p>
          <p className="text-sm text-muted-foreground">
            Accept an offer and click "Initiate Tasks" to create tasks from deliverables.
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching your criteria.</p>
        </div>
      ) : (
        <DbKanbanBoard
          tasks={filteredTasks}
          columns={columns}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Task Edit Dialog */}
      <TaskEditDialog
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        columns={columns}
        onUpdate={handleTaskUpdate}
      />
    </PageWrapper>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
