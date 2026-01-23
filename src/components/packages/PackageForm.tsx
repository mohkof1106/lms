'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Package, DeliverablePeriod } from '@/types';
import { mockCustomers } from '@/lib/mock-data/customers';
import { mockServices } from '@/lib/mock-data/services';
import { deliverablePeriodLabels } from '@/lib/mock-data/packages';
import { Package as PackageIcon, ListChecks, Plus, Trash2 } from 'lucide-react';

const deliverableSchema = z.object({
  id: z.string(),
  serviceId: z.string().min(1, 'Service is required'),
  serviceName: z.string(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  period: z.enum(['daily', 'weekly', 'monthly'] as const),
  completedThisPeriod: z.number().min(0),
});

const packageSchema = z.object({
  name: z.string().min(2, 'Package name is required'),
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string(),
  monthlyFee: z.number().min(0, 'Monthly fee must be positive'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  active: z.boolean(),
  deliverables: z.array(deliverableSchema).min(1, 'At least one deliverable is required'),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  pkg?: Package;
  onSubmit: (data: PackageFormData) => void;
  onCancel: () => void;
}

export function PackageForm({ pkg, onSubmit, onCancel }: PackageFormProps) {
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: pkg
      ? {
          name: pkg.name,
          customerId: pkg.customerId,
          customerName: pkg.customerName,
          monthlyFee: pkg.monthlyFee,
          startDate: pkg.startDate,
          endDate: pkg.endDate || '',
          active: pkg.active,
          deliverables: pkg.deliverables,
        }
      : {
          name: '',
          customerId: '',
          customerName: '',
          monthlyFee: 0,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          active: true,
          deliverables: [
            {
              id: `DEL-NEW-${Date.now()}`,
              serviceId: '',
              serviceName: '',
              quantity: 1,
              period: 'monthly' as DeliverablePeriod,
              completedThisPeriod: 0,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deliverables',
  });

  const handleAddDeliverable = () => {
    append({
      id: `DEL-NEW-${Date.now()}`,
      serviceId: '',
      serviceName: '',
      quantity: 1,
      period: 'monthly',
      completedThisPeriod: 0,
    });
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId);
    if (customer) {
      form.setValue('customerId', customerId);
      form.setValue('customerName', customer.name);
    }
  };

  const handleServiceChange = (index: number, serviceId: string) => {
    const service = mockServices.find((s) => s.id === serviceId);
    if (service) {
      form.setValue(`deliverables.${index}.serviceId`, serviceId);
      form.setValue(`deliverables.${index}.serviceName`, service.name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Package Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackageIcon className="h-5 w-5 text-primary" />
              Package Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Social Media Management - Client Name" {...field} />
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
              name="monthlyFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Fee (AED)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Leave empty for ongoing packages</FormDescription>
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
                    <FormLabel>Active Package</FormLabel>
                    <FormDescription>
                      Inactive packages won't generate invoices
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Deliverables */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="h-5 w-5 text-primary" />
              Deliverables
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={handleAddDeliverable}>
              <Plus className="h-4 w-4 mr-2" />
              Add Deliverable
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Deliverable {index + 1}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`deliverables.${index}.serviceId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service</FormLabel>
                        <Select
                          onValueChange={(value) => handleServiceChange(index, value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockServices.filter((s) => s.active).map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
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
                    name={`deliverables.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`deliverables.${index}.period`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(deliverablePeriodLabels).map(([value, label]) => (
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
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{pkg ? 'Save Changes' : 'Create Package'}</Button>
        </div>
      </form>
    </Form>
  );
}
