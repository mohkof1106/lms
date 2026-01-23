'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { KanbanBoard } from '@/components/tasks';
import { SearchInput } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTasks, taskPriorityLabels } from '@/lib/mock-data/tasks';
import { mockProjects } from '@/lib/mock-data/projects';
import { Plus } from 'lucide-react';

function TasksContent() {
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get('project') || 'all';

  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(projectFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    return mockTasks.filter((task) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(searchLower) ||
        task.projectName.toLowerCase().includes(searchLower) ||
        task.assigneeNames.some((name) => name.toLowerCase().includes(searchLower));

      const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesProject && matchesPriority;
    });
  }, [search, selectedProject, priorityFilter]);

  const activeProjects = mockProjects.filter((p) => p.status === 'active');
  const activeTasks = mockTasks.filter((t) => t.status !== 'delivered').length;

  return (
    <PageWrapper
      title="Tasks"
      description={`${activeTasks} active tasks`}
      actions={
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Link>
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tasks..."
          className="flex-1 max-w-sm"
        />
        <div className="flex gap-2">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {activeProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {Object.entries(taskPriorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kanban Board */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found matching your criteria.</p>
        </div>
      ) : (
        <KanbanBoard tasks={filteredTasks} />
      )}
    </PageWrapper>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
  );
}
