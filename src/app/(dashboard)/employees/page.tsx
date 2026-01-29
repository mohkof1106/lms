'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { EmployeeTable } from '@/components/employees';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Employee } from '@/types';
import { Plus, Download, Loader2 } from 'lucide-react';
import { roleLabels } from '@/lib/utils/format';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch employees from Supabase
  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .order('full_name');

        if (error) throw error;

        // Map database fields to Employee type (snake_case → camelCase)
        const mapped: Employee[] = (data || []).map((e) => ({
          id: e.id,
          fullName: e.full_name,
          email: e.email,
          phone: e.phone || '',
          role: e.role,
          jobTitle: e.job_title || '',
          department: e.department || '',
          baseSalary: Number(e.base_salary),
          insurance: Number(e.insurance),
          ticketValue: Number(e.ticket_value),
          visaCost: Number(e.visa_cost),
          vacationDays: e.vacation_days,
          startDate: e.start_date,
          endDate: e.end_date || undefined,
          active: e.active,
          emergencyContact: e.emergency_contact as Employee['emergencyContact'],
          documents: e.documents as Employee['documents'],
        }));

        setEmployees(mapped);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        employee.fullName.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.jobTitle.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = roleFilter === 'all' || employee.role === roleFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && employee.active) ||
        (statusFilter === 'inactive' && !employee.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, employees]);

  if (loading) {
    return (
      <PageWrapper title="Employees" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Employees" description="Error">
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
      title="Employees"
      description={`${employees.length} team members`}
      actions={
        <Button asChild>
          <Link href="/employees/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search employees..."
          className="flex-1 max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.entries(roleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your criteria.</p>
        </div>
      ) : (
        <EmployeeTable employees={filteredEmployees} />
      )}
    </PageWrapper>
  );
}
