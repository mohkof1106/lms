'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { EmployeeForm } from '@/components/employees';
import { supabase } from '@/lib/supabase';
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
        emergency_contact: data.emergencyContact || null,
        documents: data.documents || null,
      };

      const { error } = await supabase
        .from('employees')
        .insert([dbData]);

      if (error) throw error;

      toast.success('Employee created successfully!');
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
