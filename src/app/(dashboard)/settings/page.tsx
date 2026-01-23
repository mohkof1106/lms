'use client';

import { PageWrapper } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockCompanySettings, mockHolidays, mockOverheadCosts } from '@/lib/mock-data/settings';
import { formatCurrency } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  Building2,
  Settings2,
  Calendar,
  DollarSign,
  Save,
  Plus,
  Trash2,
} from 'lucide-react';

export default function SettingsPage() {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const totalMonthlyOverhead = mockOverheadCosts
    .filter((c) => c.frequency === 'monthly')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalYearlyOverhead = mockOverheadCosts
    .filter((c) => c.frequency === 'yearly')
    .reduce((sum, c) => sum + c.amount, 0);

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
                    defaultValue={mockCompanySettings.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trn">Tax Registration Number (TRN)</Label>
                  <Input
                    id="trn"
                    defaultValue={mockCompanySettings.trn}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    defaultValue={mockCompanySettings.address}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    defaultValue={mockCompanySettings.currency}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatRate">Default VAT Rate (%)</Label>
                  <Input
                    id="vatRate"
                    type="number"
                    defaultValue={mockCompanySettings.defaultVatRate}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
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
                    defaultValue={mockCompanySettings.workingHoursPerDay}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysPerWeek">Working Days Per Week</Label>
                  <Input
                    id="daysPerWeek"
                    type="number"
                    defaultValue={mockCompanySettings.workingDaysPerWeek}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profitMargin">Default Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    defaultValue={mockCompanySettings.defaultProfitMargin}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
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
                  {mockHolidays.map((holiday) => (
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
                    Fixed costs distributed across employee hourly rates
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cost
                </Button>
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
                    {mockOverheadCosts.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell className="font-medium">{cost.name}</TableCell>
                        <TableCell className="capitalize">{cost.frequency}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(cost.amount)}
                        </TableCell>
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
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
