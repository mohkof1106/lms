'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Employee, EmployeeCostBreakdown } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Calculator, Clock, Calendar, TrendingUp } from 'lucide-react';

interface CostBreakdownProps {
  employee: Employee;
  costs: EmployeeCostBreakdown;
}

export function CostBreakdown({ employee, costs }: CostBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Costs */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Input Costs</h4>
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Base Salary</span>
              <span className="font-medium">{formatCurrency(employee.baseSalary)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Insurance</span>
              <span className="text-muted-foreground">{formatCurrency(employee.insurance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Annual Ticket Value</span>
              <span className="text-muted-foreground">{formatCurrency(employee.ticketValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Visa Cost (2 years)</span>
              <span className="text-muted-foreground">{formatCurrency(employee.visaCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>13th Month Salary</span>
              <span className="text-muted-foreground">{formatCurrency(employee.baseSalary / 12)}/mo</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculated Costs */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Calculated Costs</h4>
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Monthly Cost</span>
              </div>
              <span className="font-semibold">{formatCurrency(costs.monthlyCost)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Full Cost (with overhead)</span>
              </div>
              <span className="font-semibold">{formatCurrency(costs.fullCost)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Yearly Cost</span>
              </div>
              <span className="font-semibold">{formatCurrency(costs.yearlyCost)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Billable Rates */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Billable Rates</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-border text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Hourly</span>
              </div>
              <p className="text-xl font-bold text-primary">{formatCurrency(costs.hourlyCost)}</p>
            </div>
            <div className="p-4 rounded-lg border border-border text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Daily</span>
              </div>
              <p className="text-xl font-bold text-primary">{formatCurrency(costs.dailyCost)}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Working Days */}
        <div className="p-3 rounded-lg bg-primary/5 text-sm">
          <p className="text-muted-foreground">
            Working days per year: <span className="font-medium text-foreground">{costs.workingDaysPerYear} days</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {employee.vacationDays} vacation days + public holidays
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
