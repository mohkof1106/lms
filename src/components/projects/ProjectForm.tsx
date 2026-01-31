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
  FormDescription,
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
import { Project, ProjectType, ProjectStatus } from '@/types';
import { mockCustomers } from '@/lib/mock-data/customers';
import { mockEmployees } from '@/lib/mock-data/employees';
import { projectTypeLabels, projectStatusLabels } from '@/lib/mock-data/projects';
import { FolderOpen, Users } from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string(),
  type: z.enum(['brand_identity', 'print', 'digital', 'packaging', 'signage', 'motion', 'retainer'] as const),
  status: z.enum(['active', 'on_hold', 'completed', 'cancelled'] as const),
  startDate: z.string().min(1, 'Start date is required'),
  deadline: z.string().optional(),
  budget: z.number().optional(),
  description: z.string().optional(),
  assignedEmployees: z.array(z.string()),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          name: project.name,
          customerId: project.customerId,
          customerName: project.customerName,
          type: project.type,
          status: project.status,
          startDate: project.startDate,
          deadline: project.deadline || '',
          budget: project.budget || 0,
          description: project.description || '',
          assignedEmployees: project.assignedEmployees,
        }
      : {
          name: '',
          customerId: '',
          customerName: '',
          type: 'digital',
          status: 'active',
          startDate: new Date().toISOString().split('T')[0],
          deadline: '',
          budget: 0,
          description: '',
          assignedEmployees: [],
        },
  });

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (customer) {
      form.setValue('customerId', customerId);
      form.setValue('customerName', customer.name);
    }
  };

  const activeEmployees = mockEmployees.filter((e) => e.active);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderOpen className="h-5 w-5 text-primary" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand Identity Refresh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={handleCustomerChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(projectTypeLabels).map(([value, label]) => (
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(projectStatusLabels).map(([value, label]) => (
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
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                      placeholder="Project description and scope..."
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

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AedIcon className="h-5 w-5 text-primary" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel>Project Budget (AED)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>Total budget for this project</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Team Assignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Team Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="assignedEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Team Members</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {activeEmployees.map((employee) => (
                      <label
                        key={employee.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                          field.value.includes(employee.id)
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={field.value.includes(employee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, employee.id]);
                            } else {
                              field.onChange(field.value.filter((id) => id !== employee.id));
                            }
                          }}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
        </div>
      </form>
    </Form>
  );
}
