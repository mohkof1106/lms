'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  Settings2,
  Calendar,
  DollarSign,
  Save,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';

interface CompanySettings {
  id: string;
  name: string;
  address: string | null;
  trn: string | null;
  currency: string;
  default_vat_rate: number;
  default_profit_margin: number;
  working_hours_per_day: number;
  working_days_per_week: number;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  year: number;
}

interface OverheadCost {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  active: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [overheadCosts, setOverheadCosts] = useState<OverheadCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [trn, setTrn] = useState('');
  const [address, setAddress] = useState('');
  const [vatRate, setVatRate] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [profitMargin, setProfitMargin] = useState(30);

  // Add overhead cost dialog state
  const [isAddCostOpen, setIsAddCostOpen] = useState(false);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmount, setNewCostAmount] = useState('');
  const [newCostFrequency, setNewCostFrequency] = useState<'monthly' | 'yearly'>('monthly');

  // Fetch all settings data
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);

        const [settingsRes, holidaysRes, overheadRes] = await Promise.all([
          supabase.from('company_settings').select('*').single(),
          supabase.from('holidays').select('*').order('date'),
          supabase.from('overhead_costs').select('*').eq('active', true).order('name'),
        ]);

        if (settingsRes.error) throw settingsRes.error;
        if (holidaysRes.error) throw holidaysRes.error;
        if (overheadRes.error) throw overheadRes.error;

        const s = settingsRes.data;
        setSettings(s);
        setCompanyName(s.name);
        setTrn(s.trn || '');
        setAddress(s.address || '');
        setVatRate(Number(s.default_vat_rate));
        setHoursPerDay(s.working_hours_per_day);
        setDaysPerWeek(s.working_days_per_week);
        setProfitMargin(Number(s.default_profit_margin));

        setHolidays(holidaysRes.data || []);
        setOverheadCosts(
          (overheadRes.data || []).map((c) => ({
            id: c.id,
            name: c.name,
            amount: Number(c.amount),
            frequency: c.frequency as 'monthly' | 'yearly',
            active: c.active,
          }))
        );
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSaveCompany = async () => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          name: companyName,
          trn,
          address,
          default_vat_rate: vatRate,
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Company settings saved!');
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save settings');
    }
  };

  const handleSaveWork = async () => {
    if (!settings) return;
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          working_hours_per_day: hoursPerDay,
          working_days_per_week: daysPerWeek,
          default_profit_margin: profitMargin,
        })
        .eq('id', settings.id);

      if (error) throw error;
      toast.success('Work settings saved!');
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save settings');
    }
  };

  const handleAddOverheadCost = async () => {
    if (!newCostName || !newCostAmount) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('overhead_costs')
        .insert({
          name: newCostName,
          amount: parseFloat(newCostAmount),
          frequency: newCostFrequency,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setOverheadCosts([
        ...overheadCosts,
        {
          id: data.id,
          name: data.name,
          amount: Number(data.amount),
          frequency: data.frequency as 'monthly' | 'yearly',
          active: data.active,
        },
      ]);
      setIsAddCostOpen(false);
      setNewCostName('');
      setNewCostAmount('');
      setNewCostFrequency('monthly');
      toast.success('Overhead cost added!');
    } catch (err) {
      console.error('Error adding cost:', err);
      toast.error('Failed to add overhead cost');
    }
  };

  const handleDeleteOverheadCost = async (costId: string) => {
    try {
      const { error } = await supabase
        .from('overhead_costs')
        .update({ active: false })
        .eq('id', costId);

      if (error) throw error;

      setOverheadCosts(overheadCosts.filter((c) => c.id !== costId));
      toast.success('Overhead cost removed');
    } catch (err) {
      console.error('Error deleting cost:', err);
      toast.error('Failed to remove overhead cost');
    }
  };

  const totalMonthlyOverhead = overheadCosts
    .filter((c) => c.frequency === 'monthly')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalYearlyOverhead = overheadCosts
    .filter((c) => c.frequency === 'yearly')
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <PageWrapper title="Settings" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Settings" description="Error">
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
      title="Settings"
      description="Manage company settings and preferences"
    >
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="work">Work Settings</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="overhead">Overhead Costs</TabsTrigger>
        </TabsList>

        {/* Company Info */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>
              <CardDescription>
                Basic company details that appear on invoices and quotes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trn">Tax Registration Number (TRN)</Label>
                  <Input
                    id="trn"
                    value={trn}
                    onChange={(e) => setTrn(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings?.currency || 'AED'}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatRate">Default VAT Rate (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveCompany}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Settings */}
        <TabsContent value="work">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Work Settings
              </CardTitle>
              <CardDescription>
                Configure working hours and default pricing margins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hoursPerDay">Working Hours Per Day</Label>
                  <Input
                    id="hoursPerDay"
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysPerWeek">Working Days Per Week</Label>
                  <Input
                    id="daysPerWeek"
                    type="number"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profitMargin">Default Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveWork}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Public Holidays
                </CardTitle>
                <CardDescription>
                  Holidays affect working days calculation for cost estimates
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">{holiday.name}</TableCell>
                      <TableCell>{holiday.date}</TableCell>
                      <TableCell>{holiday.year}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overhead Costs */}
        <TabsContent value="overhead">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Overhead</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalMonthlyOverhead)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Yearly Fixed Costs</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalYearlyOverhead)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overhead Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Overhead Costs
                  </CardTitle>
                  <CardDescription>
                    Estimated overhead costs used for the Cost Estimator tool only (not actual expenses)
                  </CardDescription>
                </div>
                <Dialog open={isAddCostOpen} onOpenChange={setIsAddCostOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cost
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Overhead Cost</DialogTitle>
                      <DialogDescription>
                        Add an estimated overhead cost for the Cost Estimator.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="costName">Description</Label>
                        <Input
                          id="costName"
                          value={newCostName}
                          onChange={(e) => setNewCostName(e.target.value)}
                          placeholder="e.g., Office Rent"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costAmount">Amount (AED)</Label>
                        <Input
                          id="costAmount"
                          type="number"
                          value={newCostAmount}
                          onChange={(e) => setNewCostAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costFrequency">Frequency</Label>
                        <Select value={newCostFrequency} onValueChange={(v) => setNewCostFrequency(v as 'monthly' | 'yearly')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCostOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddOverheadCost}>
                        Add Cost
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overheadCosts.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell className="font-medium">{cost.name}</TableCell>
                        <TableCell className="capitalize">{cost.frequency}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(cost.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteOverheadCost(cost.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
