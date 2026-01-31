'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared';
import { Employee, EmployeeCostBreakdown } from '@/types';
import { formatCurrency, roleLabels } from '@/lib/utils/format';
import { supabase } from '@/lib/supabase';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onDelete?: (employeeId: string) => void;
}

export function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const [costs, setCosts] = useState<Record<string, EmployeeCostBreakdown>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch costs from Supabase for all employees
  useEffect(() => {
    async function fetchCosts() {
      const costsMap: Record<string, EmployeeCostBreakdown> = {};

      // Fetch costs for each employee using the database function
      await Promise.all(
        employees.map(async (emp) => {
          const { data, error } = await supabase
            .rpc('calculate_employee_hourly_cost', { p_employee_id: emp.id });

          if (!error && data && Array.isArray(data) && data[0]) {
            const c = data[0] as any;
            // Calculate benefits cost client-side if not returned from DB
            const benefitsCost = (c as any).benefits_cost ??
              (emp.insurance / 12 + emp.ticketValue / 12 + emp.visaCost / 24 + emp.baseSalary / 12);
            costsMap[emp.id] = {
              monthlyCost: c.monthly_cost,
              fullCost: c.full_monthly_cost,
              yearlyCost: c.yearly_cost,
              dailyCost: c.daily_cost,
              hourlyCost: c.hourly_cost,
              workingDaysPerYear: c.working_days_per_year,
              assetDepreciationYearly: c.asset_depreciation_monthly * 12,
              assetDepreciationMonthly: c.asset_depreciation_monthly,
              overheadShare: c.overhead_share || 0,
              benefitsCost: benefitsCost,
            };
          }
        })
      );

      setCosts(costsMap);
    }

    if (employees.length > 0) {
      fetchCosts();
    }
  }, [employees]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete && onDelete) {
      onDelete(employeeToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Monthly Salary</TableHead>
            <TableHead className="text-right">Benefits</TableHead>
            <TableHead className="text-right">Overhead</TableHead>
            <TableHead className="text-right">Hourly</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const employeeCosts = costs[employee.id];
            return (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(employee.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/employees/${employee.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {employee.fullName}
                      </Link>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{roleLabels[employee.role] || employee.role}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{employee.department}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    <span className="font-medium">{formatCurrency(employee.baseSalary + (employee.compensation || 0))}</span>
                    {(employee.compensation || 0) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(employee.baseSalary)} + {formatCurrency(employee.compensation)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {employeeCosts ? formatCurrency(employeeCosts.benefitsCost) : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {employeeCosts ? formatCurrency(employeeCosts.overheadShare) : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    {employeeCosts ? formatCurrency(employeeCosts.hourlyCost) : '—'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">
                    {employeeCosts ? formatCurrency(employeeCosts.fullCost) : '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={employee.active ? 'Active' : 'Inactive'}
                    variant={employee.active ? 'success' : 'destructive'}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/employees/${employee.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/employees/${employee.id}?edit=true`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteClick(employee)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {employeeToDelete?.fullName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
