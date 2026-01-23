'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { ProjectForm } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProjectById, projectTypeLabels, projectStatusLabels } from '@/lib/mock-data/projects';
import { getTasksByProject } from '@/lib/mock-data/tasks';
import { mockEmployees } from '@/lib/mock-data/employees';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  DollarSign,
  Calendar,
  Building2,
  Users,
  ListTodo,
  Clock,
} from 'lucide-react';
import { ProjectStatus } from '@/types';

const statusColors: Record<ProjectStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  on_hold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const project = getProjectById(params.id as string);

  if (!project) {
    return (
      <PageWrapper title="Project Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const tasks = getTasksByProject(project.id);
  const assignedEmployees = mockEmployees.filter((e) =>
    project.assignedEmployees.includes(e.id)
  );

  const handleSave = (data: any) => {
    console.log('Updated project data:', data);
    toast.success('Project updated successfully!');
    router.push(`/projects/${project.id}`);
  };

  const handleCancel = () => {
    router.push(`/projects/${project.id}`);
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${project.name}`}
        description="Update project details"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/projects/${project.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <ProjectForm project={project} onSubmit={handleSave} onCancel={handleCancel} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={project.name}
      description={project.customerName}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${project.id}?edit=true`}>
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
          {/* Project Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">{project.name}</h2>
                  <Link
                    href={`/customers/${project.customerId}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {project.customerName}
                  </Link>
                </div>
                <Badge variant="secondary" className={statusColors[project.status]}>
                  {projectStatusLabels[project.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-semibold">{projectTypeLabels[project.type]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-semibold">
                      {project.deadline ? formatDate(project.deadline) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      {project.budget ? formatCurrency(project.budget) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {project.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p>{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Project Tasks</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/tasks?project=${project.id}`}>View All Tasks</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No tasks created yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {task.assigneeNames.join(', ')}
                            </p>
                          </div>
                          <Badge variant="secondary">{task.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    File management coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center py-8">
                    Project timeline coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedEmployees.length === 0 ? (
                <p className="text-muted-foreground text-sm">No team members assigned</p>
              ) : (
                <div className="space-y-3">
                  {assignedEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {employee.fullName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{employee.fullName}</p>
                        <p className="text-xs text-muted-foreground">{employee.jobTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ListTodo className="h-4 w-4" />
                  <span>Total Tasks</span>
                </div>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </div>
                <span className="font-semibold">{assignedEmployees.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Days Remaining</span>
                </div>
                <span className="font-semibold">
                  {project.deadline
                    ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        )
                      )
                    : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                Create Task
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/customers/${project.customerId}`}>
                  View Customer
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
