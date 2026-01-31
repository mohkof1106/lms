'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Expense, ExpenseCategory, ExpenseStatus, AssetCategory } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import {
  expenseCategoryLabels,
  expenseStatusLabels,
  expensePaymentMethodLabels,
  expenseCategories,
  expenseStatuses,
  expensePaymentMethods,
} from '@/lib/mock-data/expenses';
import { Box } from 'lucide-react';

const assetCategoryLabels: Record<AssetCategory, string> = {
  equipment: 'Equipment',
  software: 'Software',
  furniture: 'Furniture',
  vehicle: 'Vehicle',
  other: 'Other',
};

const expenseSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(expenseCategories as [ExpenseCategory, ...ExpenseCategory[]]),
  status: z.enum(expenseStatuses as [ExpenseStatus, ...ExpenseStatus[]]),
  expenseDate: z.string().min(1, 'Expense date is required'),
  paymentDate: z.string().optional(),
  dueDate: z.string().optional(),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'credit_card', 'cheque', 'none'] as const).optional(),
  paymentReference: z.string().optional(),
  vendorName: z.string().optional(),
  isAssetPurchase: z.boolean(),
  // Asset fields (conditional)
  assetName: z.string().optional(),
  assetCategory: z.enum(['equipment', 'software', 'furniture', 'vehicle', 'other', 'none'] as const).optional(),
  assetSerialNumber: z.string().optional(),
  assetUsefulLifeYears: z.number().min(1).max(50).optional(),
  assetAssignedTo: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.isAssetPurchase) {
      return !!data.assetName && data.assetCategory && data.assetCategory !== 'none';
    }
    return true;
  },
  {
    message: 'Asset name and category are required for asset purchases',
    path: ['assetName'],
  }
);

export type ExpenseFormData = z.infer<typeof expenseSchema>;

interface Employee {
  id: string;
  fullName: string;
  jobTitle?: string;
}

interface ExpenseFormProps {
  expense?: Expense;
  employees: Employee[];
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, employees, onSubmit, onCancel }: ExpenseFormProps) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          status: expense.status,
          expenseDate: expense.expenseDate,
          paymentDate: expense.paymentDate || '',
          dueDate: expense.dueDate || '',
          paymentMethod: expense.paymentMethod || 'none',
          paymentReference: expense.paymentReference || '',
          vendorName: expense.vendorName || '',
          isAssetPurchase: expense.isAssetPurchase,
          assetName: '',
          assetCategory: 'none',
          assetSerialNumber: '',
          assetUsefulLifeYears: 3,
          assetAssignedTo: 'none',
          notes: expense.notes || '',
        }
      : {
          description: '',
          amount: 0,
          category: 'other',
          status: 'pending',
          expenseDate: new Date().toISOString().split('T')[0],
          paymentDate: '',
          dueDate: '',
          paymentMethod: 'none',
          paymentReference: '',
          vendorName: '',
          isAssetPurchase: false,
          assetName: '',
          assetCategory: 'equipment',
          assetSerialNumber: '',
          assetUsefulLifeYears: 3,
          assetAssignedTo: 'none',
          notes: '',
        },
  });

  const isAssetPurchase = form.watch('isAssetPurchase');
  const amount = form.watch('amount');
  const assetUsefulLifeYears = form.watch('assetUsefulLifeYears');
  const depreciationPerYear = amount && assetUsefulLifeYears ? amount / assetUsefulLifeYears : 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Core Expense Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Office rent - January 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (AED)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000"
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
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {expenseCategoryLabels[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="expenseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel>
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
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {expenseStatusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dubai Properties LLC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Payment Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>When payment is due (for pending expenses)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>When payment was made</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Not specified</SelectItem>
                      {expensePaymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {expensePaymentMethodLabels[method]}
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
              name="paymentReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="CHK-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Asset Purchase Toggle */}
        <FormField
          control={form.control}
          name="isAssetPurchase"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">This is an asset purchase</FormLabel>
                <FormDescription>
                  Creates an asset record for depreciation tracking
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!!expense}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Conditional Asset Fields */}
        {isAssetPurchase && !expense && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Box className="h-4 w-4" />
              Asset Details
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assetName"
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

              <FormField
                control={form.control}
                name="assetCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Category</FormLabel>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="assetSerialNumber"
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

              <FormField
                control={form.control}
                name="assetUsefulLifeYears"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetAssignedTo"
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
                      <SelectItem value="none">Unassigned</SelectItem>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.fullName}
                          {emp.jobTitle ? ` - ${emp.jobTitle}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {depreciationPerYear > 0 && (
              <div className="p-3 rounded-lg bg-background text-sm">
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
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this expense..."
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
          <Button type="submit">{expense ? 'Save Changes' : 'Add Expense'}</Button>
        </div>
      </form>
    </Form>
  );
}
