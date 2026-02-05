'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { EmployeeForm } from '@/components/employees';
import { supabase } from '@/lib/supabase';
import { createUserAction } from '@/app/(dashboard)/settings/users/actions';
import { toast } from 'sonner';

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
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
        emergency_contact: data.emergencyContactName
          ? {
              name: data.emergencyContactName,
              phone: data.emergencyContactPhone,
              relationship: data.emergencyContactRelation,
            }
          : null,
        documents: data.documents || null,
      };

      const { data: newEmployee, error } = await supabase
        .from('employees')
        .insert([dbData])
        .select('id')
        .single();

      if (error) throw error;

      // Create user account if requested
      if (data.createUserAccount && newEmployee) {
        try {
          await createUserAction({
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            systemRole: data.systemRole || 'member',
            employeeId: newEmployee.id,
          });
          toast.success('Employee and user account created successfully!');
        } catch (userErr: any) {
          console.error('User account creation failed:', userErr);
          toast.warning('Employee created, but user account failed: ' + userErr.message);
        }
      } else {
        toast.success('Employee created successfully!');
      }

      router.push('/employees');
    } catch (err) {
      console.error('Error creating employee:', err);
      toast.error('Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/employees');
  };

  return (
    <PageWrapper
      title="Add Employee"
      description="Add a new team member to the organization"
    >
      <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </PageWrapper>
  );
}
