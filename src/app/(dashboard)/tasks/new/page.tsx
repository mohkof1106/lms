'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { TaskForm } from '@/components/tasks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewTaskPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('New task data:', data);
    toast.success('Task created successfully!');
    router.push('/tasks');
  };

  const handleCancel = () => {
    router.push('/tasks');
  };

  return (
    <PageWrapper
      title="New Task"
      description="Create a new task"
      actions={
        <Button variant="outline" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
