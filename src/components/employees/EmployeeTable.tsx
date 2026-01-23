'use client';

import { useState } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared';
import { Employee } from '@/types';
import { formatCurrency, roleLabels } from '@/lib/utils/format';
import { calculateEmployeeCost } from '@/lib/mock-data/employees';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-right">Hourly Cost</TableHead>
            <TableHead className="text-right">Monthly Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const costs = calculateEmployeeCost(employee);
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
                  <span className="font-medium">{formatCurrency(costs.hourlyCost)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium">{formatCurrency(costs.fullCost)}</span>
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
                      <DropdownMenuItem className="text-destructive">
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
    </div>
  );
}
