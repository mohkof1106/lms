'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Asset, AssetCategory } from '@/types';
import { formatCurrency } from '@/lib/utils/format';

const assetCategoryLabels: Record<AssetCategory, string> = {
  equipment: 'Equipment',
  software: 'Software',
  furniture: 'Furniture',
  vehicle: 'Vehicle',
  other: 'Other',
};

const assetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  category: z.enum(['equipment', 'software', 'furniture', 'vehicle', 'other'] as const),
  serialNumber: z.string().optional(),
  purchasePrice: z.number().min(0, 'Price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  usefulLifeYears: z.number().min(1, 'Must be at least 1 year').max(50, 'Maximum 50 years'),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;

interface Employee {
  id: string;
  fullName: string;
  jobTitle?: string;
}

interface AssetFormProps {
  asset?: Asset;
  employees: Employee[];
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

export function AssetForm({ asset, employees, onSubmit, onCancel }: AssetFormProps) {
  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: asset
      ? {
          name: asset.name,
          category: asset.category,
          serialNumber: asset.serialNumber || '',
          purchasePrice: asset.purchasePrice,
          purchaseDate: asset.purchaseDate,
          usefulLifeYears: asset.usefulLifeYears,
          assignedTo: asset.assignedTo || '',
          notes: asset.notes || '',
        }
      : {
          name: '',
          category: 'equipment',
          serialNumber: '',
          purchasePrice: 0,
          purchaseDate: new Date().toISOString().split('T')[0],
          usefulLifeYears: 3,
          assignedTo: '',
          notes: '',
        },
  });

  const purchasePrice = form.watch('purchasePrice');
  const usefulLifeYears = form.watch('usefulLifeYears');
  const depreciationPerYear = purchasePrice && usefulLifeYears ? purchasePrice / usefulLifeYears : 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Asset Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input placeholder="MacBook Pro 16 M3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(assetCategoryLabels).map(([value, label]) => (
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
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="C02Z12345ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Financial */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price (AED)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12500"
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
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Depreciation */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="usefulLifeYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depreciation Years</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 3)}
                  />
                </FormControl>
                <FormDescription>
                  How many years until fully depreciated (default: 3)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {depreciationPerYear > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yearly Depreciation:</span>
                <span className="font-medium">{formatCurrency(depreciationPerYear)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Monthly Depreciation:</span>
                <span className="font-medium">{formatCurrency(depreciationPerYear / 12)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Assignment */}
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Employee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.fullName}{emp.jobTitle ? ` - ${emp.jobTitle}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Asset depreciation will be added to the employee cost
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this asset..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{asset ? 'Save Changes' : 'Add Asset'}</Button>
        </div>
      </form>
    </Form>
  );
}
