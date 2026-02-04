'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
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
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  CheckSquare,
  RefreshCw,
  FileText,
  User,
  Plus,
  X,
} from 'lucide-react';
import { DbTask, DbTaskPriority, DbTaskSubtask, TaskBoardColumn, Employee } from '@/types';

const priorityColors: Record<DbTaskPriority, string> = {
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const priorityLabels: Record<DbTaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<DbTask | null>(null);
  const [columns, setColumns] = useState<TaskBoardColumn[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [taskId]);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch task with subtasks and assignees
      const { data: taskData, error: taskError } = await (supabase as any)
        .from('tasks')
        .select(`
          *,
          offers (offer_number, customers (name)),
          services (name),
          task_board_columns (id, name, color),
          task_subtasks (
            id,
            title,
            percentage,
            hours_estimated,
            hours_actual,
            target_date,
            completed,
            completed_at,
            sort_order,
            task_subtask_assignees (
              id,
              employee_id,
              employees (full_name, job_title)
            )
          )
        `)
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      const mapped: DbTask = {
        id: taskData.id,
        offerId: taskData.offer_id,
        offerLineItemId: taskData.offer_line_item_id,
        serviceId: taskData.service_id,
        columnId: taskData.column_id,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority as DbTaskPriority,
        dueDate: taskData.due_date,
        targetCompletionDate: taskData.target_completion_date,
        hoursEstimated: Number(taskData.hours_estimated) || 0,
        hoursActual: Number(taskData.hours_actual) || 0,
        revisionCount: taskData.revision_count || 0,
        createdAt: taskData.created_at,
        updatedAt: taskData.updated_at,
        offerNumber: taskData.offers?.offer_number,
        customerName: taskData.offers?.customers?.name,
        serviceName: taskData.services?.name,
        columnName: taskData.task_board_columns?.name,
        columnColor: taskData.task_board_columns?.color,
        subtasks: (taskData.task_subtasks || [])
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((st: any) => ({
            id: st.id,
            taskId: taskData.id,
            title: st.title,
            percentage: Number(st.percentage),
            hoursEstimated: Number(st.hours_estimated) || 0,
            hoursActual: Number(st.hours_actual) || 0,
            targetDate: st.target_date,
            completed: st.completed,
            completedAt: st.completed_at,
            sortOrder: st.sort_order || 0,
            assignees: (st.task_subtask_assignees || []).map((a: any) => ({
              id: a.id,
              employeeId: a.employee_id,
              employeeName: a.employees?.full_name || 'Unknown',
              employeeJobTitle: a.employees?.job_title,
            })),
          })),
      };

      setTask(mapped);

      // Fetch columns for move dropdown
      const { data: columnsData } = await (supabase as any)
        .from('task_board_columns')
        .select('*')
        .order('sort_order');

      setColumns(
        (columnsData || []).map((col: any) => ({
          id: col.id,
          name: col.name,
          color: col.color,
          sortOrder: col.sort_order,
          isSystem: col.is_system,
        }))
      );

      // Fetch employees for assignee selector
      const { data: employeesData } = await supabase
        .from('employees')
        .select('id, full_name, job_title')
        .eq('active', true)
        .order('full_name');

      setEmployees(
        (employeesData || []).map((emp: any) => ({
          id: emp.id,
          fullName: emp.full_name,
          jobTitle: emp.job_title,
          email: '',
          phone: '',
          role: 'designer' as const,
          department: '',
          baseSalary: 0,
          compensation: 0,
          insurance: 0,
          ticketValue: 0,
          visaCost: 0,
          vacationDays: 0,
          startDate: '',
          active: true,
        }))
      );
    } catch (err) {
      console.error('Error fetching task:', err);
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  }

  const handleSubtaskToggle = async (subtaskId: string, completed: boolean) => {
    if (!task) return;
    try {
      const { error } = await (supabase as any)
        .from('task_subtasks')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', subtaskId);

      if (error) throw error;

      setTask({
        ...task,
        subtasks: task.subtasks.map((st) =>
          st.id === subtaskId
            ? { ...st, completed, completedAt: completed ? new Date().toISOString() : undefined }
            : st
        ),
      });
    } catch (err) {
      console.error('Error updating subtask:', err);
      toast.error('Failed to update subtask');
    }
  };

  const handleAddAssignee = async (subtaskId: string, employeeId: string) => {
    if (!task) return;
    try {
      const { data, error } = await (supabase as any)
        .from('task_subtask_assignees')
        .insert({ task_subtask_id: subtaskId, employee_id: employeeId })
        .select('id, employee_id, employees (full_name, job_title)')
        .single();

      if (error) throw error;

      const employee = employees.find((e) => e.id === employeeId);

      setTask({
        ...task,
        subtasks: task.subtasks.map((st) =>
          st.id === subtaskId
            ? {
                ...st,
                assignees: [
                  ...st.assignees,
                  {
                    id: data.id,
                    employeeId: employeeId,
                    employeeName: employee?.fullName || 'Unknown',
                    employeeJobTitle: employee?.jobTitle,
                  },
                ],
              }
            : st
        ),
      });
      toast.success('Assignee added');
    } catch (err) {
      console.error('Error adding assignee:', err);
      toast.error('Failed to add assignee');
    }
  };

  const handleRemoveAssignee = async (subtaskId: string, assigneeId: string) => {
    if (!task) return;
    try {
      const { error } = await (supabase as any)
        .from('task_subtask_assignees')
        .delete()
        .eq('id', assigneeId);

      if (error) throw error;

      setTask({
        ...task,
        subtasks: task.subtasks.map((st) =>
          st.id === subtaskId
            ? { ...st, assignees: st.assignees.filter((a) => a.id !== assigneeId) }
            : st
        ),
      });
      toast.success('Assignee removed');
    } catch (err) {
      console.error('Error removing assignee:', err);
      toast.error('Failed to remove assignee');
    }
  };

  const handleMoveTask = async (newColumnId: string) => {
    if (!task) return;
    setUpdating(true);
    try {
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ column_id: newColumnId })
        .eq('id', task.id);

      if (error) throw error;

      const newColumn = columns.find((c) => c.id === newColumnId);
      setTask({
        ...task,
        columnId: newColumnId,
        columnName: newColumn?.name,
        columnColor: newColumn?.color,
      });
      toast.success('Task moved');
    } catch (err) {
      console.error('Error moving task:', err);
      toast.error('Failed to move task');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (!task) {
    return (
      <PageWrapper title="Task Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The task you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  // Get all unique assignees from subtasks
  const allAssignees = new Map<string, { name: string; jobTitle?: string }>();
  task.subtasks.forEach((st) => {
    st.assignees.forEach((a) => {
      if (!allAssignees.has(a.employeeId)) {
        allAssignees.set(a.employeeId, { name: a.employeeName, jobTitle: a.employeeJobTitle });
      }
    });
  });

  return (
    <PageWrapper
      title={task.title}
      description={task.customerName || task.offerNumber || 'Task'}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{task.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      style={{ backgroundColor: task.columnColor + '20', color: task.columnColor }}
                    >
                      {task.columnName}
                    </Badge>
                    <Badge variant="secondary" className={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                    {task.revisionCount > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {task.revisionCount} revisions
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {task.offerNumber && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Offer</p>
                      <Link
                        href={`/offers/${task.offerId}`}
                        className="font-semibold hover:text-primary"
                      >
                        {task.offerNumber}
                      </Link>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-semibold">
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Est. Hours</p>
                    <p className="font-semibold">{task.hoursEstimated}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assignees</p>
                    <p className="font-semibold">{allAssignees.size}</p>
                  </div>
                </div>
              </div>

              {task.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p>{task.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subtasks with Assignees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-primary" />
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.subtasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No subtasks</p>
              ) : (
                <div className="space-y-3">
                  {task.subtasks.map((subtask) => {
                    // Get employees not yet assigned to this subtask
                    const availableEmployees = employees.filter(
                      (emp) => !subtask.assignees.some((a) => a.employeeId === emp.id)
                    );

                    return (
                      <div key={subtask.id} className="p-4 rounded-lg border">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={(checked) =>
                              handleSubtaskToggle(subtask.id, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={
                                  subtask.completed ? 'line-through text-muted-foreground' : 'font-medium'
                                }
                              >
                                {subtask.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {subtask.percentage}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {subtask.hoursEstimated}h
                              </span>
                            </div>
                            {subtask.targetDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Target: {formatDate(subtask.targetDate)}
                              </p>
                            )}

                            {/* Assignees */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {subtask.assignees.map((assignee) => (
                                <Badge
                                  key={assignee.id}
                                  variant="secondary"
                                  className="gap-1 pr-1"
                                >
                                  <Avatar className="h-4 w-4">
                                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                      {assignee.employeeName
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{assignee.employeeName}</span>
                                  <button
                                    onClick={() => handleRemoveAssignee(subtask.id, assignee.id)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}

                              {/* Add assignee popover */}
                              {availableEmployees.length > 0 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 px-2">
                                      <Plus className="h-3 w-3 mr-1" />
                                      Assign
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-56 p-2" align="start">
                                    <div className="space-y-1">
                                      {availableEmployees.map((emp) => (
                                        <button
                                          key={emp.id}
                                          onClick={() => handleAddAssignee(subtask.id, emp.id)}
                                          className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted text-left"
                                        >
                                          <Avatar className="h-6 w-6">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                              {emp.fullName
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                              {emp.fullName}
                                            </p>
                                            {emp.jobTitle && (
                                              <p className="text-xs text-muted-foreground truncate">
                                                {emp.jobTitle}
                                              </p>
                                            )}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Move Task */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={task.columnId}
                onValueChange={handleMoveTask}
                disabled={updating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: col.color }}
                        />
                        {col.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Team (all assignees from subtasks) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team</CardTitle>
            </CardHeader>
            <CardContent>
              {allAssignees.size === 0 ? (
                <p className="text-muted-foreground text-sm">No assignees yet</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(allAssignees.entries()).map(([id, { name, jobTitle }]) => (
                    <div key={id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{name}</p>
                        {jobTitle && (
                          <p className="text-xs text-muted-foreground">{jobTitle}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Created</span>
                <span>{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last updated</span>
                <span>{formatDate(task.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {task.offerId && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/offers/${task.offerId}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Offer
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
