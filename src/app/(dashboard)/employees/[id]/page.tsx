'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CostBreakdown, EmployeeForm } from '@/components/employees';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Employee, EmployeeCostBreakdown, Asset, AssetCategory } from '@/types';
import { formatDate, roleLabels } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  User,
  Shield,
  Loader2,
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [costs, setCosts] = useState<EmployeeCostBreakdown | null>(null);
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employee from Supabase
  useEffect(() => {
    async function fetchEmployee() {
      try {
        setLoading(true);
        const employeeId = params.id as string;

        // Fetch employee, costs, and assets in parallel
        const [employeeRes, assetsRes] = await Promise.all([
          supabase.from('employees').select('*').eq('id', employeeId).single(),
          supabase.from('assets').select('*').eq('assigned_to', employeeId),
        ]);

        if (employeeRes.error) throw employeeRes.error;

        if (employeeRes.data) {
          const data = employeeRes.data;
          // Map snake_case to camelCase
          const mapped: Employee = {
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            phone: data.phone || '',
            role: data.role,
            jobTitle: data.job_title || '',
            department: data.department || '',
            baseSalary: Number(data.base_salary),
            compensation: Number((data as any).compensation || 0),
            insurance: Number(data.insurance),
            ticketValue: Number(data.ticket_value),
            visaCost: Number(data.visa_cost),
            vacationDays: data.vacation_days,
            startDate: data.start_date,
            endDate: data.end_date || undefined,
            active: data.active,
            emergencyContact: (data as any).emergency_contact as Employee['emergencyContact'],
            documents: (data as any).documents as Employee['documents'],
          };
          setEmployee(mapped);

          // Map assets
          if (assetsRes.data) {
            const mappedAssets: Asset[] = assetsRes.data.map((a) => ({
              id: a.id,
              name: a.name,
              category: a.category as AssetCategory,
              purchaseDate: a.purchase_date,
              purchasePrice: Number(a.purchase_price),
              usefulLifeYears: a.useful_life_years,
              currentValue: Number(a.current_value),
              depreciationPerYear: Number(a.depreciation_per_year),
              assignedTo: a.assigned_to || undefined,
              serialNumber: a.serial_number || undefined,
              notes: a.notes || undefined,
            }));
            setAssignedAssets(mappedAssets);
          }

          // Fetch costs using RPC
          const { data: costData } = await supabase
            .rpc('calculate_employee_hourly_cost', { p_employee_id: data.id });

          if (costData && costData[0]) {
            const c = costData[0];
            // Calculate benefits cost client-side if not returned from DB
            const benefitsCost = (c as any).benefits_cost ??
              (mapped.insurance / 12 + mapped.ticketValue / 12 + mapped.visaCost / 24 + mapped.baseSalary / 12);
            setCosts({
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
            });
          }
        }
      } catch (err) {
        console.error('Error fetching employee:', err);
        toast.error('Failed to load employee');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [params.id]);

  if (loading) {
    return (
      <PageWrapper title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    );
  }

  if (!employee) {
    return (
      <PageWrapper title="Employee Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The employee you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/employees">Back to Employees</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Map camelCase form data to snake_case for database
      const dbData = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        role: data.role,
        job_title: data.jobTitle || null,
        department: data.department || null,
        base_salary: data.baseSalary,
        compensation: data.compensation,
        insurance: data.insurance,
        ticket_value: data.ticketValue,
        visa_cost: data.visaCost,
        vacation_days: data.vacationDays,
        start_date: data.startDate,
        end_date: data.endDate || null,
        active: data.active ?? true,
        emergency_contact: data.emergencyContact || null,
        documents: data.documents || null,
      };

      const { error } = await supabase
        .from('employees')
        .update(dbData)
        .eq('id', employee.id);

      if (error) throw error;

      toast.success('Employee updated successfully!');
      router.push(`/employees/${employee.id}`);
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error('Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/employees/${employee.id}`);
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${employee.fullName}`}
        description="Update employee information"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/employees/${employee.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <EmployeeForm employee={employee} onSubmit={handleSave} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={employee.fullName}
      description={employee.jobTitle}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/employees">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/employees/${employee.id}?edit=true`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {getInitials(employee.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold">{employee.fullName}</h2>
                      <StatusBadge
                        status={employee.active ? 'Active' : 'Inactive'}
                        variant={employee.active ? 'success' : 'destructive'}
                      />
                    </div>
                    <p className="text-muted-foreground">{employee.jobTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${employee.email}`} className="hover:text-primary">
                        {employee.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{roleLabels[employee.role]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {formatDate(employee.startDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4 space-y-4">
              {/* Compensation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compensation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Monthly Salary Group */}
                    <div className="col-span-2 md:col-span-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm text-muted-foreground mb-2">Monthly Salary</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-semibold text-primary">
                          {(employee.baseSalary + (employee.compensation || 0)).toLocaleString()} AED
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ({employee.baseSalary.toLocaleString()} base + {(employee.compensation || 0).toLocaleString()} compensation)
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Insurance (Annual)</p>
                      <p className="font-medium">{employee.insurance.toLocaleString()} AED</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Allowance</p>
                      <p className="font-medium">{employee.ticketValue.toLocaleString()} AED</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Visa Cost (2 yrs)</p>
                      <p className="font-medium">{employee.visaCost.toLocaleString()} AED</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vacation Days</p>
                      <p className="font-medium">{employee.vacationDays} days/year</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              {employee.emergencyContact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{employee.emergencyContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{employee.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Relationship</p>
                        <p className="font-medium">{employee.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    No projects assigned to this employee yet.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Document management will be available after Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Cost Breakdown */}
        <div>
          {costs && <CostBreakdown employee={employee} costs={costs} assets={assignedAssets} />}
        </div>
      </div>
    </PageWrapper>
  );
}
