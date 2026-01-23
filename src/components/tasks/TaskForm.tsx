'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { mockProjects } from '@/lib/mock-data/projects';
import { mockEmployees } from '@/lib/mock-data/employees';
import { taskStatusLabels, taskPriorityLabels } from '@/lib/mock-data/tasks';
import { ListTodo, Users } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  projectName: z.string(),
  status: z.enum(['brief', 'concept', 'design', 'revisions', 'approval', 'delivered'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  assigneeIds: z.array(z.string()),
  assigneeNames: z.array(z.string()),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          projectId: task.projectId,
          projectName: task.projectName,
          status: task.status,
          priority: task.priority,
          assigneeIds: task.assigneeIds,
          assigneeNames: task.assigneeNames,
          dueDate: task.dueDate || '',
        }
      : {
          title: '',
          description: '',
          projectId: '',
          projectName: '',
          status: 'brief',
          priority: 'medium',
          assigneeIds: [],
          assigneeNames: [],
          dueDate: '',
        },
  });

  const handleProjectChange = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId);
    if (project) {
      form.setValue('projectId', projectId);
      form.setValue('projectName', project.name);
    }
  };

  const handleAssigneeToggle = (employeeId: string) => {
    const currentIds = form.getValues('assigneeIds');
    const employee = mockEmployees.find((e) => e.id === employeeId);

    if (!employee) return;

    if (currentIds.includes(employeeId)) {
      form.setValue(
        'assigneeIds',
        currentIds.filter((id) => id !== employeeId)
      );
      form.setValue(
        'assigneeNames',
        form.getValues('assigneeNames').filter((name) => name !== employee.fullName)
      );
    } else {
      form.setValue('assigneeIds', [...currentIds, employeeId]);
      form.setValue('assigneeNames', [...form.getValues('assigneeNames'), employee.fullName]);
    }
  };

  const activeProjects = mockProjects.filter((p) => p.status === 'active');
  const activeEmployees = mockEmployees.filter((e) => e.active);
  const selectedAssignees = form.watch('assigneeIds');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListTodo className="h-5 w-5 text-primary" />
              Task Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Logo Concepts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={handleProjectChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(taskStatusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(taskPriorityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Task details and requirements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Assignees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Assignees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activeEmployees.map((employee) => (
                <label
                  key={employee.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAssignees.includes(employee.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAssignees.includes(employee.id)}
                    onChange={() => handleAssigneeToggle(employee.id)}
                    className="sr-only"
                  />
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {employee.fullName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{employee.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{employee.jobTitle}</p>
                  </div>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{task ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Form>
  );
}
