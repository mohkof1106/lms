'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Service } from '@/types';
import { CategoryCombobox } from '@/components/shared/CategoryCombobox';
import { Palette, Clock, ListChecks, Plus, Trash2 } from 'lucide-react';

const subtaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Subtask title is required'),
  percentage: z.number().min(1, 'Percentage must be at least 1').max(100, 'Percentage cannot exceed 100'),
});

const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedHours: z.number().min(0.5, 'Estimated hours must be at least 0.5'),
  categoryId: z.string().min(1, 'Category is required'),
  active: z.boolean(),
  subtasks: z.array(subtaskSchema).min(1, 'At least one subtask is required'),
}).refine(
  (data) => {
    const total = data.subtasks.reduce((sum, st) => sum + st.percentage, 0);
    return total === 100;
  },
  {
    message: 'Subtask percentages must sum to exactly 100%',
    path: ['subtasks'],
  }
);

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          estimatedHours: service.estimatedHours,
          categoryId: service.categoryId,
          active: service.active,
          subtasks: service.subtasks && service.subtasks.length > 0
            ? service.subtasks.map((st) => ({
                id: st.id,
                title: st.title,
                percentage: st.percentage,
              }))
            : [{ title: service.name, percentage: 100 }],
        }
      : {
          name: '',
          description: '',
          estimatedHours: 1,
          categoryId: '',
          active: true,
          subtasks: [{ title: '', percentage: 100 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subtasks',
  });

  const watchSubtasks = form.watch('subtasks');
  const watchEstimatedHours = form.watch('estimatedHours');
  const totalPercentage = watchSubtasks?.reduce((sum, st) => sum + (st.percentage || 0), 0) || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5 text-primary" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Social Media Post Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryCombobox
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Service</FormLabel>
                    <FormDescription>
                      Inactive services won't appear in quotes and projects
                    </FormDescription>
                  </div>
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
                      placeholder="Describe what this service includes..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This description will appear on quotes and project briefs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Estimated Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Estimated Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="estimatedHours"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Total Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="2"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Average time to complete this service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" />
                Subtasks
              </CardTitle>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                totalPercentage === 100
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                Total: {totalPercentage}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormDescription>
              Break down this service into subtasks. Percentages must sum to exactly 100%.
            </FormDescription>

            {fields.map((field, index) => {
              const subtaskPercentage = watchSubtasks?.[index]?.percentage || 0;
              const subtaskHours = ((subtaskPercentage / 100) * watchEstimatedHours).toFixed(1);

              return (
                <div key={field.id} className="flex gap-3 items-end">
                  <FormField
                    control={form.control}
                    name={`subtasks.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Subtask Name</FormLabel>}
                        <FormControl>
                          <Input placeholder="e.g., Brainstorming, Editing..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subtasks.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        {index === 0 && <FormLabel>%</FormLabel>}
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-16 h-10 flex items-center justify-end text-sm text-muted-foreground">
                    {subtaskHours}h
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 ${fields.length === 1 ? 'invisible' : ''}`}
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: '', percentage: 0 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Subtask
            </Button>

            {form.formState.errors.subtasks?.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.subtasks.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{service ? 'Save Changes' : 'Create Service'}</Button>
        </div>
      </form>
    </Form>
  );
}
