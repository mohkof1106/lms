import { Task, TaskStatus, TaskPriority } from '@/types';

export const mockTasks: Task[] = [
  // TAHSEEL Brand Refresh tasks
  {
    id: 'TSK-001',
    title: 'Logo Concepts',
    description: 'Create 3 initial logo concepts for client review',
    projectId: 'PRJ-001',
    projectName: 'TAHSEEL Brand Refresh',
    status: 'revisions',
    priority: 'high',
    assigneeIds: ['EMP-003'],
    assigneeNames: ['Omar Hassan'],
    dueDate: '2024-11-20',
    revisionCount: 2,
    subtasks: [
      { id: 'SUB-001', title: 'Research competitors', completed: true },
      { id: 'SUB-002', title: 'Sketch initial ideas', completed: true },
      { id: 'SUB-003', title: 'Digitize concepts', completed: true },
      { id: 'SUB-004', title: 'Apply client feedback', completed: false },
    ],
    comments: [
      {
        id: 'COM-001',
        authorId: 'EMP-001',
        authorName: 'Ahmed Al Mansouri',
        content: 'Client prefers concept B but wants to see variations',
        createdAt: '2024-11-15T10:30:00Z',
      },
    ],
    createdAt: '2024-10-05T09:00:00Z',
    updatedAt: '2024-11-15T10:30:00Z',
  },
  {
    id: 'TSK-002',
    title: 'Brand Guidelines Document',
    description: 'Create comprehensive brand guidelines based on approved logo',
    projectId: 'PRJ-001',
    projectName: 'TAHSEEL Brand Refresh',
    status: 'brief',
    priority: 'medium',
    assigneeIds: ['EMP-003', 'EMP-004'],
    assigneeNames: ['Omar Hassan', 'Fatima Al Zahra'],
    dueDate: '2024-12-10',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-10-05T09:00:00Z',
    updatedAt: '2024-10-05T09:00:00Z',
  },
  {
    id: 'TSK-003',
    title: 'Stationery Design',
    description: 'Business cards, letterhead, envelope designs',
    projectId: 'PRJ-001',
    projectName: 'TAHSEEL Brand Refresh',
    status: 'brief',
    priority: 'low',
    assigneeIds: ['EMP-004'],
    assigneeNames: ['Fatima Al Zahra'],
    dueDate: '2024-12-12',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-10-05T09:00:00Z',
    updatedAt: '2024-10-05T09:00:00Z',
  },

  // Al Majaz Event Campaign tasks
  {
    id: 'TSK-004',
    title: 'Campaign Key Visual',
    description: 'Main visual identity for New Year campaign',
    projectId: 'PRJ-002',
    projectName: 'Al Majaz Event Campaign',
    status: 'approval',
    priority: 'urgent',
    assigneeIds: ['EMP-004'],
    assigneeNames: ['Fatima Al Zahra'],
    dueDate: '2024-11-18',
    revisionCount: 1,
    subtasks: [
      { id: 'SUB-005', title: 'Mood board', completed: true },
      { id: 'SUB-006', title: 'Initial concept', completed: true },
      { id: 'SUB-007', title: 'Final artwork', completed: true },
    ],
    comments: [],
    createdAt: '2024-11-02T09:00:00Z',
    updatedAt: '2024-11-16T14:00:00Z',
  },
  {
    id: 'TSK-005',
    title: 'Social Media Adaptations',
    description: 'Adapt key visual for Instagram, Facebook, Twitter',
    projectId: 'PRJ-002',
    projectName: 'Al Majaz Event Campaign',
    status: 'design',
    priority: 'high',
    assigneeIds: ['EMP-005'],
    assigneeNames: ['Sara Ahmed'],
    dueDate: '2024-11-22',
    revisionCount: 0,
    subtasks: [
      { id: 'SUB-008', title: 'Instagram posts (5)', completed: false },
      { id: 'SUB-009', title: 'Stories templates (3)', completed: false },
      { id: 'SUB-010', title: 'Facebook covers', completed: false },
    ],
    comments: [],
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-17T11:00:00Z',
  },
  {
    id: 'TSK-006',
    title: 'Event Countdown Video',
    description: '15-second countdown video for social media',
    projectId: 'PRJ-002',
    projectName: 'Al Majaz Event Campaign',
    status: 'concept',
    priority: 'medium',
    assigneeIds: ['EMP-006'],
    assigneeNames: ['Khalid Ibrahim'],
    dueDate: '2024-11-25',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-05T09:00:00Z',
  },

  // Chamber Annual Report tasks
  {
    id: 'TSK-007',
    title: 'Report Layout Design',
    description: 'Create master layout and template pages',
    projectId: 'PRJ-004',
    projectName: 'Chamber Annual Report 2024',
    status: 'design',
    priority: 'high',
    assigneeIds: ['EMP-003'],
    assigneeNames: ['Omar Hassan'],
    dueDate: '2024-11-30',
    revisionCount: 0,
    subtasks: [
      { id: 'SUB-011', title: 'Cover design', completed: true },
      { id: 'SUB-012', title: 'Chapter openers', completed: true },
      { id: 'SUB-013', title: 'Content pages', completed: false },
      { id: 'SUB-014', title: 'Infographic templates', completed: false },
    ],
    comments: [],
    createdAt: '2024-10-20T09:00:00Z',
    updatedAt: '2024-11-15T16:00:00Z',
  },
  {
    id: 'TSK-008',
    title: 'Data Infographics',
    description: 'Create infographics for economic data section',
    projectId: 'PRJ-004',
    projectName: 'Chamber Annual Report 2024',
    status: 'brief',
    priority: 'medium',
    assigneeIds: ['EMP-004'],
    assigneeNames: ['Fatima Al Zahra'],
    dueDate: '2024-12-15',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-10-20T09:00:00Z',
    updatedAt: '2024-10-20T09:00:00Z',
  },

  // Al Zarooni Property Launch tasks
  {
    id: 'TSK-009',
    title: 'Project Logo & Identity',
    description: 'Create logo and identity for new residential development',
    projectId: 'PRJ-007',
    projectName: 'Al Zarooni Property Launch',
    status: 'revisions',
    priority: 'urgent',
    assigneeIds: ['EMP-003'],
    assigneeNames: ['Omar Hassan'],
    dueDate: '2024-11-25',
    revisionCount: 3,
    subtasks: [
      { id: 'SUB-015', title: 'Initial concepts', completed: true },
      { id: 'SUB-016', title: 'Refined direction', completed: true },
      { id: 'SUB-017', title: 'Final logo', completed: false },
    ],
    comments: [
      {
        id: 'COM-002',
        authorId: 'EMP-002',
        authorName: 'Mariam Al Shamsi',
        content: 'CEO wants more premium feel, reference attached',
        createdAt: '2024-11-18T09:00:00Z',
      },
    ],
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-18T09:00:00Z',
  },
  {
    id: 'TSK-010',
    title: 'Marketing Collateral',
    description: 'Brochures, flyers, and sales materials',
    projectId: 'PRJ-007',
    projectName: 'Al Zarooni Property Launch',
    status: 'brief',
    priority: 'high',
    assigneeIds: ['EMP-004', 'EMP-005'],
    assigneeNames: ['Fatima Al Zahra', 'Sara Ahmed'],
    dueDate: '2024-12-20',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-11-05T09:00:00Z',
    updatedAt: '2024-11-05T09:00:00Z',
  },

  // SAF Exhibition tasks
  {
    id: 'TSK-011',
    title: 'Exhibition Wayfinding',
    description: 'Signage system for exhibition halls',
    projectId: 'PRJ-006',
    projectName: 'SAF Exhibition Design',
    status: 'concept',
    priority: 'medium',
    assigneeIds: ['EMP-003'],
    assigneeNames: ['Omar Hassan'],
    dueDate: '2024-12-15',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-11-12T09:00:00Z',
    updatedAt: '2024-11-12T09:00:00Z',
  },
  {
    id: 'TSK-012',
    title: 'Exhibition Catalogue',
    description: 'Design exhibition catalogue (80 pages)',
    projectId: 'PRJ-006',
    projectName: 'SAF Exhibition Design',
    status: 'brief',
    priority: 'medium',
    assigneeIds: ['EMP-005'],
    assigneeNames: ['Sara Ahmed'],
    dueDate: '2025-01-15',
    revisionCount: 0,
    subtasks: [],
    comments: [],
    createdAt: '2024-11-12T09:00:00Z',
    updatedAt: '2024-11-12T09:00:00Z',
  },

  // Delivered tasks
  {
    id: 'TSK-013',
    title: 'Website Mockups',
    description: 'Complete website UI mockups',
    projectId: 'PRJ-009',
    projectName: 'SEDD Website Redesign',
    status: 'delivered',
    priority: 'high',
    assigneeIds: ['EMP-005'],
    assigneeNames: ['Sara Ahmed'],
    dueDate: '2024-07-15',
    revisionCount: 2,
    subtasks: [
      { id: 'SUB-018', title: 'Homepage', completed: true },
      { id: 'SUB-019', title: 'Inner pages', completed: true },
      { id: 'SUB-020', title: 'Responsive views', completed: true },
    ],
    comments: [],
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2024-07-15T16:00:00Z',
  },
];

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find((t) => t.id === id);
};

export const getTasksByProject = (projectId: string): Task[] => {
  return mockTasks.filter((t) => t.projectId === projectId);
};

export const getTasksByStatus = (status: TaskStatus): Task[] => {
  return mockTasks.filter((t) => t.status === status);
};

export const getTasksByAssignee = (employeeId: string): Task[] => {
  return mockTasks.filter((t) => t.assigneeIds.includes(employeeId));
};

export const taskStatusLabels: Record<TaskStatus, string> = {
  brief: 'Brief',
  concept: 'Concept',
  design: 'Design',
  revisions: 'Revisions',
  approval: 'Approval',
  delivered: 'Delivered',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const taskStatusOrder: TaskStatus[] = [
  'brief',
  'concept',
  'design',
  'revisions',
  'approval',
  'delivered',
];
