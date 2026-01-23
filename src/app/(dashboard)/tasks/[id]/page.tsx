'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { TaskForm } from '@/components/tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { getTaskById, taskStatusLabels, taskPriorityLabels } from '@/lib/mock-data/tasks';
import { formatDate } from '@/lib/utils/format';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Calendar,
  FolderOpen,
  Users,
  MessageSquare,
  CheckSquare,
  RefreshCw,
} from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types';

const statusColors: Record<TaskStatus, string> = {
  brief: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  concept: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  design: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  revisions: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const task = getTaskById(params.id as string);

  if (!task) {
    return (
      <PageWrapper title="Task Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The task you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/tasks">Back to Tasks</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const handleSave = (data: any) => {
    console.log('Updated task data:', data);
    toast.success('Task updated successfully!');
    router.push(`/tasks/${task.id}`);
  };

  const handleCancel = () => {
    router.push(`/tasks/${task.id}`);
  };

  if (isEditMode) {
    return (
      <PageWrapper
        title={`Edit ${task.title}`}
        description="Update task details"
        actions={
          <Button variant="outline" asChild>
            <Link href={`/tasks/${task.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        }
      >
        <TaskForm task={task} onSubmit={handleSave} onCancel={handleCancel} />
      </PageWrapper>
    );
  }

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <PageWrapper
      title={task.title}
      description={task.projectName}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/tasks/${task.id}?edit=true`}>
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
          {/* Task Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{task.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={statusColors[task.status]}>
                      {taskStatusLabels[task.status]}
                    </Badge>
                    <Badge variant="secondary" className={priorityColors[task.priority]}>
                      {taskPriorityLabels[task.priority]}
                    </Badge>
                    {task.revisionCount > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {task.revisionCount} revisions
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Project</p>
                    <Link
                      href={`/projects/${task.projectId}`}
                      className="font-semibold hover:text-primary"
                    >
                      {task.projectName}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-semibold">
                      {task.dueDate ? formatDate(task.dueDate) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assignees</p>
                    <p className="font-semibold">{task.assigneeNames.length}</p>
                  </div>
                </div>
              </div>

              {task.description && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p>{task.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Subtasks ({completedSubtasks}/{task.subtasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <Checkbox checked={subtask.completed} disabled />
                      <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments ({task.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {comment.authorName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Assignees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Assignees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {task.assigneeNames.length === 0 ? (
                <p className="text-muted-foreground text-sm">No assignees</p>
              ) : (
                <div className="space-y-3">
                  {task.assigneeNames.map((name, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Created</span>
                <span>{formatDate(task.createdAt)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Last updated</span>
                <span>{formatDate(task.updatedAt)}</span>
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
                Move to Next Status
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Add Comment
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/projects/${task.projectId}`}>
                  View Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
