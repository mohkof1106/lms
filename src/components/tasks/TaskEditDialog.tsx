'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { DbTask, DbTaskPriority, DbTaskSubtaskStatus, TaskBoardColumn, DbTaskSubtask, Employee, DbTaskComment } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  Loader2,
  Calendar,
  Clock,
  CheckSquare,
  MessageSquare,
  Send,
  X,
  Plus,
} from 'lucide-react';

interface TaskEditDialogProps {
  task: DbTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TaskBoardColumn[];
  onUpdate: () => void;
}

const priorityOptions: { value: DbTaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-slate-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

const subtaskStatusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
  columns,
  onUpdate,
}: TaskEditDialogProps) {
  const [saving, setSaving] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<DbTaskPriority>('medium');
  const [columnId, setColumnId] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Subtasks state
  const [subtasks, setSubtasks] = useState<DbTaskSubtask[]>([]);

  // Employees for assignee selection
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Comments
  const [comments, setComments] = useState<DbTaskComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load task data when dialog opens
  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setColumnId(task.columnId);
      setDueDate(task.dueDate || '');
      setSubtasks(task.subtasks || []);

      loadEmployees();
      loadComments(task.id);
    }
  }, [open, task]);

  async function loadEmployees() {
    setLoadingEmployees(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, job_title')
        .eq('active', true)
        .order('full_name');

      if (error) throw error;

      setEmployees(
        (data || []).map((e: any) => ({
          id: e.id,
          fullName: e.full_name,
          jobTitle: e.job_title,
        } as Employee))
      );
    } catch (err) {
      console.error('Error loading employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  }

  async function loadComments(taskId: string) {
    setLoadingComments(true);
    try {
      const { data, error } = await (supabase as any)
        .from('task_comments')
        .select(`
          id,
          content,
          created_at,
          author_id,
          employees (full_name)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(
        (data || []).map((c: any) => ({
          id: c.id,
          taskId,
          authorId: c.author_id,
          authorName: c.employees?.full_name || 'Unknown',
          content: c.content,
          createdAt: c.created_at,
        }))
      );
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  }

  const handleSave = async () => {
    if (!task) return;

    setSaving(true);
    try {
      // Update task
      const { error: taskError } = await (supabase as any)
        .from('tasks')
        .update({
          title,
          description: description || null,
          priority,
          column_id: columnId,
          due_date: dueDate || null,
        })
        .eq('id', task.id);

      if (taskError) throw taskError;

      // Update subtasks
      for (const subtask of subtasks) {
        const isCompleted = subtask.status === 'completed';
        const { error: subtaskError } = await (supabase as any)
          .from('task_subtasks')
          .update({
            status: subtask.status,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          })
          .eq('id', subtask.id);

        if (subtaskError) throw subtaskError;
      }

      toast.success('Task updated');
      onUpdate();
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving task:', err);
      toast.error('Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleSubtaskStatusChange = (subtaskId: string, status: DbTaskSubtaskStatus) => {
    setSubtasks((prev) =>
      prev.map((s) =>
        s.id === subtaskId
          ? { ...s, status, completed: status === 'completed' }
          : s
      )
    );
  };

  const handleAddAssignee = async (subtaskId: string, employeeId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('task_subtask_assignees')
        .insert({
          task_subtask_id: subtaskId,
          employee_id: employeeId,
        })
        .select(`
          id,
          employee_id,
          employees (full_name, job_title)
        `)
        .single();

      if (error) throw error;

      setSubtasks((prev) =>
        prev.map((s) =>
          s.id === subtaskId
            ? {
                ...s,
                assignees: [
                  ...s.assignees,
                  {
                    id: data.id,
                    employeeId: data.employee_id,
                    employeeName: data.employees?.full_name || 'Unknown',
                    employeeJobTitle: data.employees?.job_title,
                  },
                ],
              }
            : s
        )
      );

      toast.success('Assignee added');
    } catch (err) {
      console.error('Error adding assignee:', err);
      toast.error('Failed to add assignee');
    }
  };

  const handleRemoveAssignee = async (subtaskId: string, assigneeId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('task_subtask_assignees')
        .delete()
        .eq('id', assigneeId);

      if (error) throw error;

      setSubtasks((prev) =>
        prev.map((s) =>
          s.id === subtaskId
            ? { ...s, assignees: s.assignees.filter((a) => a.id !== assigneeId) }
            : s
        )
      );

      toast.success('Assignee removed');
    } catch (err) {
      console.error('Error removing assignee:', err);
      toast.error('Failed to remove assignee');
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      // Get current user (in real app, get from auth context)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      // Get employee ID from user email
      const userEmail = userData.user.email || '';
      const { data: empData } = await supabase
        .from('employees')
        .select('id, full_name')
        .eq('email', userEmail)
        .single();

      const authorId = empData?.id || userData.user.id;
      const authorName = empData?.full_name || userEmail || 'Unknown';

      const { data, error } = await (supabase as any)
        .from('task_comments')
        .insert({
          task_id: task.id,
          author_id: authorId,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setComments((prev) => [
        ...prev,
        {
          id: data.id,
          taskId: task.id,
          authorId,
          authorName,
          content: newComment.trim(),
          createdAt: data.created_at,
        },
      ]);

      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (!task) return null;

  const sortedSubtasks = [...subtasks].sort((a, b) => a.sortOrder - b.sortOrder);
  const completedCount = subtasks.filter((s) => s.completed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="truncate">{task.title}</span>
            {task.offerNumber && (
              <Badge variant="outline" className="shrink-0">
                {task.offerNumber}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4 space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Column</Label>
              <Select value={columnId} onValueChange={setColumnId}>
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
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as DbTaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* Task Meta */}
          {task.customerName && (
            <div className="text-sm text-muted-foreground">
              Customer: <span className="font-medium">{task.customerName}</span>
            </div>
          )}

          <Separator />

          {/* Subtasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Subtasks
                <span className="text-sm text-muted-foreground">
                  ({completedCount}/{subtasks.length})
                </span>
              </h4>
            </div>

            {sortedSubtasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subtasks</p>
            ) : (
              <div className="space-y-2">
                {sortedSubtasks.map((subtask) => {
                  const statusOption = subtaskStatusOptions.find((o) => o.value === subtask.status);
                  return (
                  <div
                    key={subtask.id}
                    className={`p-3 border rounded-lg space-y-2 ${
                      subtask.status === 'completed' ? 'bg-muted/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Select
                        value={subtask.status}
                        onValueChange={(v) => handleSubtaskStatusChange(subtask.id, v as DbTaskSubtaskStatus)}
                      >
                        <SelectTrigger className="w-28 h-7 text-xs shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${statusOption?.color || 'bg-slate-500'}`} />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {subtaskStatusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                                {opt.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-medium text-sm ${
                              subtask.status === 'completed' ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {subtask.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {subtask.percentage}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {subtask.targetDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(subtask.targetDate)}
                            </span>
                          )}
                          {subtask.hoursEstimated > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {subtask.hoursEstimated}h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Assignees */}
                    <div className="flex items-center gap-2 ml-8 flex-wrap">
                      {subtask.assignees.map((assignee) => (
                        <Badge
                          key={assignee.id}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[10px]">
                              {assignee.employeeName.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{assignee.employeeName}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAssignee(subtask.id, assignee.id)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}

                      {/* Add assignee dropdown */}
                      {!loadingEmployees && (
                        <Select
                          value=""
                          onValueChange={(employeeId) => handleAddAssignee(subtask.id, employeeId)}
                        >
                          <SelectTrigger className="h-6 w-6 p-0 border-dashed">
                            <Plus className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees
                              .filter(
                                (e) => !subtask.assignees.some((a) => a.employeeId === e.id)
                              )
                              .map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.fullName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </h4>

            {loadingComments ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs">
                        {comment.authorName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment... (use @name to mention)"
                rows={2}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleAddComment}
                disabled={!newComment.trim() || submittingComment}
              >
                {submittingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
