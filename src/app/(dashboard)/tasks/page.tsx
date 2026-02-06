'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { DbKanbanBoard } from '@/components/tasks/DbKanbanBoard';
import { TasksByEmployeeView } from '@/components/tasks/TasksByEmployeeView';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { DbTask, DbTaskPriority, TaskBoardColumn } from '@/types';
import { Plus, Loader2, Settings, User, Users, Check, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<DbTask[]>([]);
  const [columns, setColumns] = useState<TaskBoardColumn[]>([]);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Employee filter
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [employees, setEmployees] = useState<{ id: string; full_name: string }[]>([]);
  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<'board' | 'by-employee'>('board');

  // Starred filter
  const [starredFilter, setStarredFilter] = useState(false);

  // Task edit dialog
  const [selectedTask, setSelectedTask] = useState<DbTask | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Load employees for filter
  useEffect(() => {
    supabase
      .from('employees')
      .select('id, full_name')
      .eq('active', true)
      .order('full_name')
      .then(({ data }) => setEmployees(data || []));
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
        isStarred: task.is_starred || false,
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

      // Employee filter: task matches if ANY subtask has an assignee in selectedEmployeeIds
      const matchesEmployee =
        selectedEmployeeIds.length === 0 ||
        task.subtasks?.some((sub) =>
          sub.assignees?.some((a) => selectedEmployeeIds.includes(a.employeeId))
        );

      const matchesStarred = !starredFilter || task.isStarred;

      return matchesSearch && matchesPriority && matchesOffer && matchesEmployee && matchesStarred;
    });
  }, [tasks, search, priorityFilter, offerFilter, selectedEmployeeIds, starredFilter]);

  // Count active tasks (not in Completed column)
  const completedColumn = columns.find((c) => c.name === 'Completed');
  const activeTasks = tasks.filter((t) => t.columnId !== completedColumn?.id).length;

  const handleTaskClick = (task: DbTask) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleToggleStar = async (taskId: string, currentStarred: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ is_starred: !currentStarred })
        .eq('id', taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, isStarred: !currentStarred } : task
        )
      );
      // Also update selectedTask if it's the same one (for dialog)
      setSelectedTask((prev) =>
        prev && prev.id === taskId ? { ...prev, isStarred: !currentStarred } : prev
      );
    } catch (err) {
      console.error('Error toggling star:', err);
      toast.error('Failed to update star');
    }
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
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as 'board' | 'by-employee')}
        >
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="by-employee">By Employee</TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          className="flex-1 max-w-sm"
        />
        <div className="flex gap-2 flex-wrap">
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

          {/* Assigned to Me button */}
          {user?.employeeId && (
            <Button
              variant={selectedEmployeeIds.includes(user.employeeId) ? 'default' : 'outline'}
              size="default"
              onClick={() => {
                if (selectedEmployeeIds.includes(user.employeeId!)) {
                  setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== user.employeeId));
                } else {
                  setSelectedEmployeeIds([user.employeeId!]);
                }
              }}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Assigned to Me
            </Button>
          )}

          {/* Starred filter */}
          <Button
            variant={starredFilter ? 'default' : 'outline'}
            size="default"
            onClick={() => setStarredFilter(!starredFilter)}
            className="gap-2"
          >
            <Star className={cn('h-4 w-4', starredFilter && 'fill-current')} />
            Starred
          </Button>

          {/* Employee multi-select */}
          <Popover open={employeePopoverOpen} onOpenChange={setEmployeePopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[140px] justify-start">
                <Users className="h-4 w-4" />
                {selectedEmployeeIds.length === 0
                  ? 'All Employees'
                  : `${selectedEmployeeIds.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search employees..." />
                <CommandList>
                  <CommandEmpty>No employees found.</CommandEmpty>
                  <CommandGroup>
                    {/* Clear all option */}
                    {selectedEmployeeIds.length > 0 && (
                      <CommandItem
                        onSelect={() => setSelectedEmployeeIds([])}
                        className="text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear selection
                      </CommandItem>
                    )}
                    {employees.map((emp) => {
                      const isSelected = selectedEmployeeIds.includes(emp.id);
                      return (
                        <CommandItem
                          key={emp.id}
                          onSelect={() => {
                            if (isSelected) {
                              setSelectedEmployeeIds(
                                selectedEmployeeIds.filter((id) => id !== emp.id)
                              );
                            } else {
                              setSelectedEmployeeIds([...selectedEmployeeIds, emp.id]);
                            }
                          }}
                        >
                          <Checkbox checked={isSelected} className="mr-2" />
                          <span className={cn(isSelected && 'font-medium')}>{emp.full_name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Task Views */}
      {filteredTasks.length === 0 && tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tasks yet.</p>
          <p className="text-sm text-muted-foreground">
            Accept an offer and click &quot;Initiate Tasks&quot; to create tasks from deliverables.
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching your criteria.</p>
        </div>
      ) : viewMode === 'board' ? (
        <DbKanbanBoard
          tasks={filteredTasks}
          columns={columns}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onToggleStar={handleToggleStar}
        />
      ) : (
        <TasksByEmployeeView
          tasks={filteredTasks}
          columns={columns}
          onTaskClick={handleTaskClick}
          onToggleStar={handleToggleStar}
          onTaskMove={handleTaskMove}
        />
      )}

      {/* Task Edit Dialog */}
      <TaskEditDialog
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        columns={columns}
        onUpdate={handleTaskUpdate}
        onToggleStar={handleToggleStar}
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
