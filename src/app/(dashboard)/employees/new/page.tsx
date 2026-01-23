'use client';

import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { EmployeeForm } from '@/components/employees';
import { toast } from 'sonner';

export default function NewEmployeePage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    // In Phase 1, we just show a toast and redirect
    // In Phase 2, this will call the Supabase API
    console.log('New employee data:', data);
    toast.success('Employee created successfully!');
    router.push('/employees');
  };

  const handleCancel = () => {
    router.push('/employees');
  };

  return (
    <PageWrapper
      title="Add Employee"
      description="Add a new team member to the organization"
    >
      <EmployeeForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
