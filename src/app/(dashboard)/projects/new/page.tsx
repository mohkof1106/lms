'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ProjectForm } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = (data: any) => {
    console.log('New project data:', data);
    toast.success('Project created successfully!');
    router.push('/projects');
  };

  const handleCancel = () => {
    router.push('/projects');
  };

  return (
    <PageWrapper
      title="New Project"
      description="Create a new project"
      actions={
        <Button variant="outline" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      }
    >
      <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </PageWrapper>
  );
}
