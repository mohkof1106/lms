import { Project, ProjectType, ProjectStatus } from '@/types';

export const mockProjects: Project[] = [
  {
    id: 'PRJ-001',
    name: 'TAHSEEL Brand Refresh',
    customerId: 'CUS-001',
    customerName: 'TAHSEEL Information Technology',
    type: 'brand_identity',
    status: 'active',
    startDate: '2024-10-01',
    deadline: '2024-12-15',
    budget: 25000,
    description: 'Complete brand identity refresh including logo redesign, brand guidelines, and stationery',
    assignedEmployees: ['EMP-003', 'EMP-004'],
  },
  {
    id: 'PRJ-002',
    name: 'Al Majaz Event Campaign',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    type: 'digital',
    status: 'active',
    startDate: '2024-11-01',
    deadline: '2024-11-30',
    budget: 15000,
    description: 'New Year celebration campaign across all digital channels',
    assignedEmployees: ['EMP-004', 'EMP-005'],
  },
  {
    id: 'PRJ-003',
    name: 'Al Majaz Signage Update',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    type: 'signage',
    status: 'active',
    startDate: '2024-09-15',
    deadline: '2024-12-01',
    budget: 35000,
    description: 'Wayfinding and directional signage for the waterfront area',
    assignedEmployees: ['EMP-003'],
  },
  {
    id: 'PRJ-004',
    name: 'Chamber Annual Report 2024',
    customerId: 'CUS-004',
    customerName: 'Sharjah Chamber of Commerce',
    type: 'print',
    status: 'active',
    startDate: '2024-10-15',
    deadline: '2025-01-31',
    budget: 30000,
    description: 'Design and layout of the 2024 annual report with infographics',
    assignedEmployees: ['EMP-003', 'EMP-004'],
  },
  {
    id: 'PRJ-005',
    name: 'Bee\'ah Sustainability Video',
    customerId: 'CUS-005',
    customerName: 'Bee\'ah',
    type: 'motion',
    status: 'on_hold',
    startDate: '2024-08-01',
    deadline: '2024-10-30',
    budget: 45000,
    description: 'Corporate sustainability video highlighting environmental initiatives',
    assignedEmployees: ['EMP-006'],
  },
  {
    id: 'PRJ-006',
    name: 'SAF Exhibition Design',
    customerId: 'CUS-007',
    customerName: 'Sharjah Art Foundation',
    type: 'signage',
    status: 'active',
    startDate: '2024-11-10',
    deadline: '2025-02-01',
    budget: 50000,
    description: 'Exhibition design for the upcoming contemporary art show',
    assignedEmployees: ['EMP-003', 'EMP-005'],
  },
  {
    id: 'PRJ-007',
    name: 'Al Zarooni Property Launch',
    customerId: 'CUS-008',
    customerName: 'Al Zarooni Group',
    type: 'brand_identity',
    status: 'active',
    startDate: '2024-11-01',
    deadline: '2025-01-15',
    budget: 60000,
    description: 'Complete branding for new residential development launch',
    assignedEmployees: ['EMP-003', 'EMP-004', 'EMP-005'],
  },
  {
    id: 'PRJ-008',
    name: 'Al Zarooni Corporate Brochure',
    customerId: 'CUS-008',
    customerName: 'Al Zarooni Group',
    type: 'print',
    status: 'active',
    startDate: '2024-11-15',
    deadline: '2024-12-20',
    budget: 12000,
    description: 'Company profile brochure update',
    assignedEmployees: ['EMP-004'],
  },
  {
    id: 'PRJ-009',
    name: 'SEDD Website Redesign',
    customerId: 'CUS-002',
    customerName: 'Sharjah Economic Development Department (SEDD)',
    type: 'digital',
    status: 'completed',
    startDate: '2024-03-01',
    deadline: '2024-07-30',
    completedDate: '2024-07-28',
    budget: 80000,
    description: 'Complete website UI/UX redesign',
    assignedEmployees: ['EMP-003', 'EMP-005'],
  },
  {
    id: 'PRJ-010',
    name: 'AUS Recruitment Campaign',
    customerId: 'CUS-006',
    customerName: 'American University of Sharjah',
    type: 'digital',
    status: 'completed',
    startDate: '2024-04-01',
    deadline: '2024-06-15',
    completedDate: '2024-06-10',
    budget: 20000,
    description: 'Student recruitment campaign for Fall 2024',
    assignedEmployees: ['EMP-004', 'EMP-005'],
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find((p) => p.id === id);
};

export const getProjectsByCustomer = (customerId: string): Project[] => {
  return mockProjects.filter((p) => p.customerId === customerId);
};

export const getProjectsByStatus = (status: ProjectStatus): Project[] => {
  return mockProjects.filter((p) => p.status === status);
};

export const getActiveProjects = (): Project[] => {
  return mockProjects.filter((p) => p.status === 'active');
};

export const projectTypeLabels: Record<ProjectType, string> = {
  brand_identity: 'Brand Identity',
  print: 'Print Design',
  digital: 'Digital',
  packaging: 'Packaging',
  signage: 'Signage',
  motion: 'Motion Graphics',
  retainer: 'Retainer',
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
