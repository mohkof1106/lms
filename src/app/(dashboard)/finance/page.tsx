'use client';

import { useMemo, useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  mockMonthlyPnL,
  mockRevenue,
} from '@/lib/mock-data/finance';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { AedIcon } from '@/components/ui/aed-icon';
import { supabase } from '@/lib/supabase';
import { Expense, ExpenseCategory, ExpenseStatus, ExpensePaymentMethod } from '@/types';
import { expenseCategoryLabels } from '@/lib/mock-data/expenses';

export default function FinancePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses from Supabase
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .neq('status', 'voided')
          .order('expense_date', { ascending: false });

        if (error) throw error;

        const mapped: Expense[] = (data || []).map((e) => ({
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

        setExpenses(mapped);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  // Calculate YTD costs from real expenses
  const ytdCosts = useMemo(() => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    return expenses
      .filter((e) => new Date(e.expenseDate) >= startOfYear)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Calculate year-to-date stats (revenue still from mock for now)
  const ytdStats = useMemo(() => {
    const totalRevenue = mockMonthlyPnL.reduce((sum, m) => sum + m.revenue, 0);
    const totalCosts = ytdCosts; // Use real expenses
    const totalProfit = totalRevenue - totalCosts;
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return { totalRevenue, totalCosts, totalProfit, avgMargin };
  }, [ytdCosts]);

  // Group costs by category from real expenses
  const costsByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses.forEach((expense) => {
      grouped[expense.category] = (grouped[expense.category] || 0) + expense.amount;
    });
    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        label: expenseCategoryLabels[category as ExpenseCategory] || category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  return (
    <PageWrapper
      title="Finance"
      description="Financial overview and reports"
    >
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(ytdStats.totalRevenue)}</p>
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
                <p className="text-sm text-muted-foreground">YTD Costs</p>
                <p className="text-2xl font-bold">{formatCurrency(ytdStats.totalCosts)}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">YTD Profit</p>
                <p className={`text-2xl font-bold ${ytdStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(ytdStats.totalProfit)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${ytdStats.totalProfit >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                {ytdStats.totalProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Margin</p>
                <p className="text-2xl font-bold">{ytdStats.avgMargin.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly P&L */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Profit & Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Costs</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMonthlyPnL.map((month) => (
                    <TableRow key={`${month.month}-${month.year}`}>
                      <TableCell className="font-medium">
                        {month.month} {month.year}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(month.revenue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(month.costs)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${month.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.grossProfit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={month.profitMargin >= 0 ? 'default' : 'destructive'}
                          className="font-mono"
                        >
                          {month.profitMargin.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Recent Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRevenue.map((rev) => (
                    <TableRow key={rev.id}>
                      <TableCell>{rev.date}</TableCell>
                      <TableCell>{rev.customerName}</TableCell>
                      <TableCell className="font-mono text-sm">{rev.invoiceId}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        +{formatCurrency(rev.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Costs by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Costs by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : costsByCategory.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No expenses recorded yet</p>
                ) : (
                  <div className="space-y-4">
                    {costsByCategory.map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Costs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : expenses.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No expenses recorded yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.slice(0, 8).map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {expenseCategoryLabels[expense.category]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
