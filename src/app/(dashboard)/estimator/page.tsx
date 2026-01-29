'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mockEmployees, calculateEmployeeCost } from '@/lib/mock-data/employees';
import { mockServices } from '@/lib/mock-data/services';
import { mockCustomers } from '@/lib/mock-data/customers';
import { formatCurrency } from '@/lib/utils/format';
import {
  Calculator,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Minus,
  FileText,
  Package,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface EmployeeHours {
  employeeId: string;
  hours: number;
}

interface SelectedService {
  serviceId: string;
  qty: number;
}

export default function EstimatorPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [employeeHours, setEmployeeHours] = useState<EmployeeHours[]>([]);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [profitMargin, setProfitMargin] = useState(30);
  const [discount, setDiscount] = useState(0);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Service selection state
  const [serviceToAdd, setServiceToAdd] = useState<string>('');
  const [qtyToAdd, setQtyToAdd] = useState<number>(1);

  const activeEmployees = mockEmployees.filter((e) => e.active);
  const activeServices = mockServices.filter((s) => s.active);

  // Calculate service totals
  const serviceTotals = useMemo(() => {
    let totalHours = 0;
    let totalPrice = 0;

    selectedServices.forEach(({ serviceId, qty }) => {
      const service = activeServices.find((s) => s.id === serviceId);
      if (service) {
        totalHours += service.estimatedHours * qty;
        totalPrice += service.basePrice * qty;
      }
    });

    return { totalHours, totalPrice };
  }, [selectedServices, activeServices]);

  // Handle adding a service
  const handleAddService = () => {
    if (!serviceToAdd || qtyToAdd < 1) return;

    setSelectedServices((prev) => {
      const existing = prev.find((s) => s.serviceId === serviceToAdd);
      if (existing) {
        return prev.map((s) =>
          s.serviceId === serviceToAdd ? { ...s, qty: s.qty + qtyToAdd } : s
        );
      }
      return [...prev, { serviceId: serviceToAdd, qty: qtyToAdd }];
    });

    setServiceToAdd('');
    setQtyToAdd(1);
  };

  // Handle removing a service
  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
  };

  // Handle service qty change
  const handleServiceQtyChange = (serviceId: string, qty: number) => {
    if (qty < 1) {
      handleRemoveService(serviceId);
      return;
    }
    setSelectedServices((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, qty } : s))
    );
  };

  const handleHoursChange = (employeeId: string, hours: number) => {
    setEmployeeHours((prev) => {
      const existing = prev.find((e) => e.employeeId === employeeId);
      if (existing) {
        if (hours === 0) {
          return prev.filter((e) => e.employeeId !== employeeId);
        }
        return prev.map((e) =>
          e.employeeId === employeeId ? { ...e, hours } : e
        );
      }
      if (hours > 0) {
        return [...prev, { employeeId, hours }];
      }
      return prev;
    });
  };

  const calculation = useMemo(() => {
    let totalCost = 0;
    const breakdown: {
      employeeId: string;
      employeeName: string;
      hours: number;
      hourlyCost: number;
      totalCost: number;
    }[] = [];

    employeeHours.forEach(({ employeeId, hours }) => {
      const employee = activeEmployees.find((e) => e.id === employeeId);
      if (employee && hours > 0) {
        const costs = calculateEmployeeCost(employee);
        const cost = costs.hourlyCost * hours;
        totalCost += cost;
        breakdown.push({
          employeeId,
          employeeName: employee.fullName,
          hours,
          hourlyCost: costs.hourlyCost,
          totalCost: cost,
        });
      }
    });

    const overheadAmount = totalCost * (overheadPercent / 100);
    const costWithOverhead = totalCost + overheadAmount;
    const profitAmount = costWithOverhead * (profitMargin / 100);
    const suggestedPrice = costWithOverhead + profitAmount;
    const totalHours = employeeHours.reduce((sum, e) => sum + e.hours, 0);

    return {
      breakdown,
      totalCost,
      overheadAmount,
      costWithOverhead,
      profitAmount,
      suggestedPrice,
      totalHours,
    };
  }, [employeeHours, overheadPercent, profitMargin, activeEmployees]);

  // Validation: team hours must be >= service hours
  const hoursShortfall = serviceTotals.totalHours - calculation.totalHours;
  const isHoursValid = hoursShortfall <= 0;

  const handleCreateOffer = () => {
    if (!isHoursValid) {
      setShowErrorDialog(true);
      return;
    }

    // Build line items from selected services with calculated prices
    const lineItems = selectedServices.map(({ serviceId, qty }) => {
      const service = activeServices.find((s) => s.id === serviceId);
      // Use suggested price distributed proportionally, or service base price
      const unitPrice = service ? Math.round(calculation.suggestedPrice / selectedServices.length / qty) : 0;
      return {
        id: `LI-${serviceId}`,
        description: service?.name || '',
        quantity: qty,
        unitPrice: service?.basePrice || 0,
      };
    });

    // Pass data to offers/new via sessionStorage
    sessionStorage.setItem('estimateToOffer', JSON.stringify({
      customerId,
      title,
      lineItems,
      discount,
      laborCost: calculation.totalCost,
      overheadPercent,
      overheadAmount: calculation.overheadAmount,
      profitAmount: calculation.profitAmount,
    }));

    router.push('/offers/new');
  };

  return (
    <PageWrapper
      title="Cost Estimator"
      description="Calculate project costs based on services and team hours"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Estimate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Estimate Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brand Identity Project"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Services Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Selected Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Service Row */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor="service">Service</Label>
                  <Select value={serviceToAdd} onValueChange={setServiceToAdd}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.estimatedHours}h)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Label htmlFor="qty">Qty</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    value={qtyToAdd}
                    onChange={(e) => setQtyToAdd(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={handleAddService} disabled={!serviceToAdd}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Services Table */}
              {selectedServices.length > 0 ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="w-20 text-center">Qty</TableHead>
                        <TableHead className="w-24 text-right">Hrs/Unit</TableHead>
                        <TableHead className="w-24 text-right">Total Hrs</TableHead>
                        <TableHead className="w-28 text-right">Unit Cost</TableHead>
                        <TableHead className="w-28 text-right">Total Cost</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedServices.map(({ serviceId, qty }) => {
                        const service = activeServices.find((s) => s.id === serviceId);
                        if (!service) return null;
                        return (
                          <TableRow key={serviceId}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) =>
                                  handleServiceQtyChange(serviceId, parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-center h-8"
                              />
                            </TableCell>
                            <TableCell className="text-right">{service.estimatedHours}h</TableCell>
                            <TableCell className="text-right font-medium">
                              {service.estimatedHours * qty}h
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(service.basePrice)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(service.basePrice * qty)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveService(serviceId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} className="font-semibold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {serviceTotals.totalHours}h
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(serviceTotals.totalPrice)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                  No services selected. Add services above to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Team Hours
              </CardTitle>
              {/* Hours validation indicator */}
              {serviceTotals.totalHours > 0 && (
                <div
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${
                    isHoursValid
                      ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                  }`}
                >
                  {!isHoursValid && <AlertTriangle className="h-4 w-4" />}
                  <span>
                    Required: <strong>{serviceTotals.totalHours}h</strong> | Assigned:{' '}
                    <strong>{calculation.totalHours}h</strong>
                    {!isHoursValid && ` (${hoursShortfall}h short)`}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeEmployees.map((employee) => {
                  const costs = calculateEmployeeCost(employee);
                  const hours =
                    employeeHours.find((e) => e.employeeId === employee.id)?.hours || 0;

                  return (
                    <div
                      key={employee.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{employee.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.jobTitle} • {formatCurrency(costs.hourlyCost)}/hr
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleHoursChange(employee.id, Math.max(0, hours - 1))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={hours}
                          onChange={(e) =>
                            handleHoursChange(employee.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 text-center"
                          min={0}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleHoursChange(employee.id, hours + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-24 text-right">
                          {formatCurrency(costs.hourlyCost * hours)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Margins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Margins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Overhead (%)</Label>
                  <span className="font-medium">{overheadPercent}%</span>
                </div>
                <Slider
                  value={[overheadPercent]}
                  onValueChange={([value]) => setOverheadPercent(value)}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Profit Margin (%)</Label>
                  <span className="font-medium">{profitMargin}%</span>
                </div>
                <Slider
                  value={[profitMargin]}
                  onValueChange={([value]) => setProfitMargin(value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Summary */}
              {selectedServices.length > 0 && (
                <div className="space-y-2 pb-4 border-b">
                  <p className="text-sm font-medium text-muted-foreground">Services</p>
                  <div className="flex justify-between text-sm">
                    <span>Service Hours</span>
                    <span className="font-medium">{serviceTotals.totalHours}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Cost (ref)</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(serviceTotals.totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Team Breakdown */}
              {calculation.breakdown.length > 0 && (
                <div className="space-y-2 pb-4 border-b">
                  <p className="text-sm font-medium text-muted-foreground">Team Breakdown</p>
                  {calculation.breakdown.map((item) => (
                    <div key={item.employeeId} className="flex justify-between text-sm">
                      <span>
                        {item.employeeName} ({item.hours}h)
                      </span>
                      <span>{formatCurrency(item.totalCost)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Hours</span>
                  <span className="font-medium">{calculation.totalHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor Cost</span>
                  <span className="font-medium">{formatCurrency(calculation.totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overhead ({overheadPercent}%)</span>
                  <span className="font-medium">{formatCurrency(calculation.overheadAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost</span>
                  <span className="font-medium">{formatCurrency(calculation.costWithOverhead)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Profit (</span>
                    <Input
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                      min={0}
                      max={100}
                      className="w-14 h-6 text-center text-sm px-1"
                    />
                    <span className="text-muted-foreground">%)</span>
                  </div>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(calculation.profitAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Suggested Price</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(calculation.suggestedPrice)}
                  </span>
                </div>
                <Separator />
                {/* Discount Section */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      min={0}
                      max={100}
                      placeholder="0"
                    />
                  </div>
                  {discount > 0 && (() => {
                    const discountAmount = calculation.suggestedPrice * (discount / 100);
                    const finalPrice = calculation.suggestedPrice - discountAmount;
                    const profitAfterDiscount = calculation.profitAmount - discountAmount;
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Discount Amount</span>
                          <span className="font-medium text-red-600">
                            -{formatCurrency(discountAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Final Price</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(finalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Profit After Discount</span>
                          <span
                            className={`font-medium ${
                              profitAfterDiscount >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {profitAfterDiscount >= 0 ? '+' : ''}
                            {formatCurrency(profitAfterDiscount)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button
                className="w-full"
                disabled={calculation.totalHours === 0 || !title || !isHoursValid}
                onClick={handleCreateOffer}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Save as Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Dialog for insufficient hours */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Insufficient Team Hours
            </AlertDialogTitle>
            <AlertDialogDescription>
              The selected services require <strong>{serviceTotals.totalHours} hours</strong>, but
              only <strong>{calculation.totalHours} hours</strong> have been assigned to team
              members. Please assign at least{' '}
              <strong>{serviceTotals.totalHours - calculation.totalHours} more hours</strong> to
              proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
