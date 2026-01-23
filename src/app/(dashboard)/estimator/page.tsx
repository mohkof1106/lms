'use client';

import { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockEmployees, calculateEmployeeCost } from '@/lib/mock-data/employees';
import { formatCurrency } from '@/lib/utils/format';
import { Calculator, Users, DollarSign, TrendingUp, Plus, Minus, FileText } from 'lucide-react';

interface EmployeeHours {
  employeeId: string;
  hours: number;
}

export default function EstimatorPage() {
  const [title, setTitle] = useState('');
  const [employeeHours, setEmployeeHours] = useState<EmployeeHours[]>([]);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [profitMargin, setProfitMargin] = useState(30);

  const activeEmployees = mockEmployees.filter((e) => e.active);

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

    return {
      breakdown,
      totalCost,
      overheadAmount,
      costWithOverhead,
      profitAmount,
      suggestedPrice,
      totalHours: employeeHours.reduce((sum, e) => sum + e.hours, 0),
    };
  }, [employeeHours, overheadPercent, profitMargin, activeEmployees]);

  const handleCreateOffer = () => {
    console.log('Create offer with:', { title, calculation });
    // TODO: Navigate to offers/new with pre-filled data
  };

  return (
    <PageWrapper
      title="Cost Estimator"
      description="Calculate project costs based on team hours"
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
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="title">Estimate Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brand Identity Project - Client Name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Team Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeEmployees.map((employee) => {
                  const costs = calculateEmployeeCost(employee);
                  const hours = employeeHours.find((e) => e.employeeId === employee.id)?.hours || 0;

                  return (
                    <div
                      key={employee.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {employee.fullName.split(' ').map((n) => n[0]).join('')}
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
                          onClick={() => handleHoursChange(employee.id, Math.max(0, hours - 1))}
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
              {/* Breakdown */}
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
                  <span className="text-muted-foreground">Total Hours</span>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit ({profitMargin}%)</span>
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
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Button
                className="w-full"
                disabled={calculation.totalHours === 0 || !title}
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
    </PageWrapper>
  );
}
