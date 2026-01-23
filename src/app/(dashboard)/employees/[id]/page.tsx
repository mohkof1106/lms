'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { CostBreakdown, EmployeeForm } from '@/components/employees';
import { StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEmployeeById, calculateEmployeeCost } from '@/lib/mock-data/employees';
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
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const employee = getEmployeeById(params.id as string);

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

  const costs = calculateEmployeeCost(employee);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = (data: any) => {
    console.log('Updated employee data:', data);
    toast.success('Employee updated successfully!');
    router.push(`/employees/${employee.id}`);
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
        <EmployeeForm employee={employee} onSubmit={handleSave} onCancel={handleCancel} />
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
                    <div>
                      <p className="text-sm text-muted-foreground">Base Salary</p>
                      <p className="font-medium">{employee.baseSalary.toLocaleString()} AED/mo</p>
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
          <CostBreakdown employee={employee} costs={costs} />
        </div>
      </div>
    </PageWrapper>
  );
}
