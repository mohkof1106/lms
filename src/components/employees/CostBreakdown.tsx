'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Employee, EmployeeCostBreakdown, Asset } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Calculator, Clock, Calendar, TrendingUp, Monitor } from 'lucide-react';

interface CostBreakdownProps {
  employee: Employee;
  costs: EmployeeCostBreakdown;
  assets?: Asset[];
}

export function CostBreakdown({ employee, costs, assets = [] }: CostBreakdownProps) {
  const assignedAssets = assets;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assigned Assets */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Assigned Assets
          </h4>
          {assignedAssets.length > 0 ? (
            <div className="grid gap-2">
              {assignedAssets.map((asset) => (
                <div key={asset.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[180px]">{asset.name}</span>
                  <span>{formatCurrency(asset.depreciationPerYear / 12)}/mo</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="font-medium">Total Asset Depreciation</span>
                <span className="font-medium">{formatCurrency(costs.assetDepreciationMonthly)}/mo</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No assets assigned</p>
          )}
        </div>

        <Separator />

        {/* Monthly Cost Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Monthly Cost Breakdown</h4>
          <div className="grid gap-2 text-sm">
            {/* Monthly Salary Group */}
            <div className="p-2 rounded bg-primary/5 space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Salary</span>
                <span>{formatCurrency(employee.baseSalary)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>+ Compensation</span>
                <span>{formatCurrency(employee.compensation || 0)}</span>
              </div>
              <div className="flex justify-between font-medium pt-1 border-t border-primary/20">
                <span>= Monthly Salary</span>
                <span className="text-primary">{formatCurrency(employee.baseSalary + (employee.compensation || 0))}</span>
              </div>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Insurance ({formatCurrency(employee.insurance)}/yr ÷ 12)</span>
              <span>{formatCurrency(employee.insurance / 12)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Ticket ({formatCurrency(employee.ticketValue)}/yr ÷ 12)</span>
              <span>{formatCurrency(employee.ticketValue / 12)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Visa ({formatCurrency(employee.visaCost)}/2yr ÷ 24)</span>
              <span>{formatCurrency(employee.visaCost / 24)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ 13th Month ({formatCurrency(employee.baseSalary)} ÷ 12)</span>
              <span>{formatCurrency(employee.baseSalary / 12)}</span>
            </div>
            {costs.assetDepreciationMonthly > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>+ Asset Depreciation</span>
                <span>{formatCurrency(costs.assetDepreciationMonthly)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-medium">
              <span>= Monthly Cost (before overhead)</span>
              <span>{formatCurrency(costs.monthlyCost)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* With Overhead */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Full Cost (with Overhead)</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Monthly Cost</span>
              <span>{formatCurrency(costs.monthlyCost)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>+ Overhead Share (company costs ÷ employees)</span>
              <span>{formatCurrency(costs.overheadShare || 0)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-medium">= Full Monthly Cost</span>
              <span className="font-semibold text-primary">{formatCurrency(costs.fullCost)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>× 12 months = Yearly Cost</span>
              <span>{formatCurrency(costs.yearlyCost)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Hourly Rate Calculation */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Hourly Rate Calculation</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Working days: 260 - {employee.vacationDays} vacation - 13 holidays</span>
              <span>{costs.workingDaysPerYear} days</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Effective hours: {costs.workingDaysPerYear} days × 8 hrs</span>
              <span>{costs.workingDaysPerYear * 8} hrs/yr</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span>Yearly ÷ Hours = Hourly Rate</span>
              <span className="font-semibold text-primary">{formatCurrency(costs.hourlyCost)}/hr</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Hourly × 8 = Daily Rate</span>
              <span>{formatCurrency(costs.dailyCost)}/day</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-center">
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
            <p className="text-xl font-bold">{formatCurrency(costs.dailyCost)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
