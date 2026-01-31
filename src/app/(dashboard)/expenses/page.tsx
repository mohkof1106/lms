'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { SearchInput } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Calendar,
  Box,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';
import { Expense, ExpenseCategory, ExpenseStatus, ExpensePaymentMethod, Employee, AssetCategory } from '@/types';
import { ExpenseForm, ExpenseFormData } from '@/components/expenses';
import {
  expenseCategoryLabels,
  expenseCategoryColors,
  expenseStatusLabels,
  expenseStatusColors,
  expenseCategories,
  expenseStatuses,
} from '@/lib/mock-data/expenses';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

  // Fetch expenses and employees from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [expensesRes, employeesRes] = await Promise.all([
          supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
          supabase.from('employees').select('id, full_name, job_title').eq('active', true),
        ]);

        if (expensesRes.error) throw expensesRes.error;
        if (employeesRes.error) throw employeesRes.error;

        const mappedExpenses: Expense[] = (expensesRes.data || []).map((e) => ({
          id: e.id,
          description: e.description,
          amount: Number(e.amount),
          category: e.category as ExpenseCategory,
          status: e.status as ExpenseStatus,
          expenseDate: e.expense_date,
          paymentDate: e.payment_date || undefined,
          dueDate: e.due_date || undefined,
          paymentMethod: (e.payment_method as ExpensePaymentMethod) || undefined,
          paymentReference: e.payment_reference || undefined,
          vendorName: e.vendor_name || undefined,
          isAssetPurchase: e.is_asset_purchase,
          assetId: e.asset_id || undefined,
          notes: e.notes || undefined,
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        }));

        const mappedEmployees: Employee[] = (employeesRes.data || []).map((e) => ({
          id: e.id,
          fullName: e.full_name,
          email: '',
          phone: '',
          role: 'designer',
          jobTitle: e.job_title || '',
          department: '',
          baseSalary: 0,
          compensation: 0,
          insurance: 0,
          ticketValue: 0,
          visaCost: 0,
          vacationDays: 0,
          startDate: '',
          active: true,
        }));

        setExpenses(mappedExpenses);
        setEmployees(mappedEmployees);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        expense.description.toLowerCase().includes(searchLower) ||
        expense.vendorName?.toLowerCase().includes(searchLower);

      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter, expenses]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const thisMonth = expenses
      .filter((e) => e.status !== 'voided' && new Date(e.expenseDate) >= startOfMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    const ytd = expenses
      .filter((e) => e.status !== 'voided' && new Date(e.expenseDate) >= startOfYear)
      .reduce((sum, e) => sum + e.amount, 0);

    const pending = expenses
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);

    return { thisMonth, ytd, pending };
  }, [expenses]);

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      let assetId: string | null = null;

      // Step 1: Create asset first if this is an asset purchase
      if (data.isAssetPurchase && data.assetName && data.assetCategory && data.assetCategory !== 'none') {
        const { data: newAsset, error: assetError } = await supabase
          .from('assets')
          .insert({
            name: data.assetName,
            category: data.assetCategory,
            purchase_date: data.expenseDate,
            purchase_price: data.amount,
            useful_life_years: data.assetUsefulLifeYears || 3,
            current_value: data.amount,
            depreciation_per_year: data.amount / (data.assetUsefulLifeYears || 3),
            assigned_to: data.assetAssignedTo === 'none' ? null : data.assetAssignedTo || null,
            serial_number: data.assetSerialNumber || null,
            notes: `Created from expense: ${data.description}`,
          })
          .select()
          .single();

        if (assetError) throw assetError;
        assetId = newAsset.id;
      }

      // Step 2: Create expense
      const { data: newExpense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          description: data.description,
          amount: data.amount,
          category: data.category,
          status: data.status,
          expense_date: data.expenseDate,
          payment_date: data.paymentDate || null,
          due_date: data.dueDate || null,
          payment_method: data.paymentMethod === 'none' ? null : data.paymentMethod || null,
          payment_reference: data.paymentReference || null,
          vendor_name: data.vendorName || null,
          is_asset_purchase: data.isAssetPurchase,
          asset_id: assetId,
          notes: data.notes || null,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      const mapped: Expense = {
        id: newExpense.id,
        description: newExpense.description,
        amount: Number(newExpense.amount),
        category: newExpense.category as ExpenseCategory,
        status: newExpense.status as ExpenseStatus,
        expenseDate: newExpense.expense_date,
        paymentDate: newExpense.payment_date || undefined,
        dueDate: newExpense.due_date || undefined,
        paymentMethod: (newExpense.payment_method as ExpensePaymentMethod) || undefined,
        paymentReference: newExpense.payment_reference || undefined,
        vendorName: newExpense.vendor_name || undefined,
        isAssetPurchase: newExpense.is_asset_purchase,
        assetId: newExpense.asset_id || undefined,
        notes: newExpense.notes || undefined,
        createdAt: newExpense.created_at,
        updatedAt: newExpense.updated_at,
      };

      setExpenses([mapped, ...expenses]);
      setIsAddSheetOpen(false);
      toast.success(assetId ? 'Expense added and asset created' : 'Expense added successfully');
    } catch (err) {
      console.error('Error adding expense:', err);
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!selectedExpense) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          description: data.description,
          amount: data.amount,
          category: data.category,
          status: data.status,
          expense_date: data.expenseDate,
          payment_date: data.paymentDate || null,
          due_date: data.dueDate || null,
          payment_method: data.paymentMethod === 'none' ? null : data.paymentMethod || null,
          payment_reference: data.paymentReference || null,
          vendor_name: data.vendorName || null,
          notes: data.notes || null,
        })
        .eq('id', selectedExpense.id);

      if (error) throw error;

      setExpenses(
        expenses.map((e) =>
          e.id === selectedExpense.id
            ? {
                ...e,
                description: data.description,
                amount: data.amount,
                category: data.category as ExpenseCategory,
                status: data.status as ExpenseStatus,
                expenseDate: data.expenseDate,
                paymentDate: data.paymentDate || undefined,
                dueDate: data.dueDate || undefined,
                paymentMethod: data.paymentMethod === 'none' ? undefined : data.paymentMethod || undefined,
                paymentReference: data.paymentReference || undefined,
                vendorName: data.vendorName || undefined,
                notes: data.notes || undefined,
              }
            : e
        )
      );
      setIsEditSheetOpen(false);
      setSelectedExpense(null);
      toast.success('Expense updated successfully');
    } catch (err) {
      console.error('Error updating expense:', err);
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async () => {
    if (!deleteExpenseId) return;

    try {
      const { error } = await supabase.from('expenses').delete().eq('id', deleteExpenseId);

      if (error) throw error;

      setExpenses(expenses.filter((e) => e.id !== deleteExpenseId));
      setDeleteExpenseId(null);
      toast.success('Expense deleted successfully');
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error('Failed to delete expense');
    }
  };

  const handleMarkAsPaid = async (expense: Expense) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'paid',
          payment_date: today,
        })
        .eq('id', expense.id);

      if (error) throw error;

      setExpenses(
        expenses.map((e) =>
          e.id === expense.id
            ? { ...e, status: 'paid' as ExpenseStatus, paymentDate: today }
            : e
        )
      );
      toast.success('Expense marked as paid');
    } catch (err) {
      console.error('Error marking expense as paid:', err);
      toast.error('Failed to update expense');
    }
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditSheetOpen(true);
  };

  if (loading) {
    return (
      <PageWrapper title="Expenses" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Expenses" description="Error">
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Expenses"
      description={`${expenses.length} total expenses`}
      actions={
        <Button onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Expense
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Year to Date</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.ytd)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <AedIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pending)}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search expenses..."
          className="flex-1 max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {expenseCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {expenseCategoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {expenseStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {expenseStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        {expense.vendorName && (
                          <p className="text-sm text-muted-foreground">{expense.vendorName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={expenseCategoryColors[expense.category]}>
                        {expenseCategoryLabels[expense.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(expense.expenseDate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={expenseStatusColors[expense.status]}>
                        {expenseStatusLabels[expense.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {expense.isAssetPurchase && expense.assetId && (
                        <Link href="/assets" title="Linked to asset">
                          <Box className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Link>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {expense.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsPaid(expense)}
                            title="Mark as paid"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(expense)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteExpenseId(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Expense Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Expense</SheetTitle>
            <SheetDescription>
              Record a new expense. Toggle asset purchase to create a linked asset.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 pb-4">
            <ExpenseForm
              employees={employees.map((e) => ({
                id: e.id,
                fullName: e.fullName,
                jobTitle: e.jobTitle,
              }))}
              onSubmit={handleAddExpense}
              onCancel={() => setIsAddSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Expense Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Expense</SheetTitle>
            <SheetDescription>Update expense information.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 px-4 pb-4">
            {selectedExpense && (
              <ExpenseForm
                expense={selectedExpense}
                employees={employees.map((e) => ({
                  id: e.id,
                  fullName: e.fullName,
                  jobTitle: e.jobTitle,
                }))}
                onSubmit={handleUpdateExpense}
                onCancel={() => {
                  setIsEditSheetOpen(false);
                  setSelectedExpense(null);
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteExpenseId} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
              {expenses.find((e) => e.id === deleteExpenseId)?.isAssetPurchase && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-400">
                  Note: The linked asset will NOT be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
