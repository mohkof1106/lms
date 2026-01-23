'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task, TaskPriority } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { Calendar, MessageSquare, CheckSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export function TaskCard({ task }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardContent className="p-4 space-y-3">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <Badge variant="secondary" className={`shrink-0 text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>

          {/* Project */}
          <p className="text-xs text-muted-foreground line-clamp-1">
            {task.projectName}
          </p>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </div>
            )}
            {task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.revisionCount > 0 && (
              <Badge variant="outline" className="text-xs">
                R{task.revisionCount}
              </Badge>
            )}
          </div>

          {/* Assignees */}
          {task.assigneeNames.length > 0 && (
            <div className="flex items-center gap-1">
              {task.assigneeNames.slice(0, 3).map((name, index) => (
                <Avatar key={index} className="h-6 w-6">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assigneeNames.length > 3 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{task.assigneeNames.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
