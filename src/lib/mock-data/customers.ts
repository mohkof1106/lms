import { Customer, Contact } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'TAHSEEL Information Technology',
    contacts: [
      {
        id: 'CON-001',
        name: 'Hamad Al Shamsi',
        email: 'hamad@tahseel.ae',
        phone: '+971 6 555 1234',
        position: 'Marketing Manager',
        isPrimary: true,
      },
    ],
    location: 'Sharjah, UAE',
    industry: 'Information Technology',
    notes: 'Long-term client, prefers modern & innovative designs',
    createdAt: '2023-01-15',
    activeProjects: 1,
    activePackages: 0,
  },
  {
    id: 'CUS-002',
    name: 'Sharjah Economic Development Department (SEDD)',
    contacts: [
      {
        id: 'CON-002',
        name: 'Maryam Al Qassimi',
        email: 'maryam@sedd.gov.ae',
        phone: '+971 6 512 3456',
        position: 'Communications Director',
        isPrimary: true,
      },
      {
        id: 'CON-003',
        name: 'Abdullah Rashid',
        email: 'abdullah@sedd.gov.ae',
        phone: '+971 6 512 3457',
        position: 'Social Media Manager',
        isPrimary: false,
      },
    ],
    location: 'Sharjah, UAE',
    industry: 'Government',
    notes: 'Monthly social media package - requires bilingual content (Arabic/English)',
    createdAt: '2022-06-01',
    activeProjects: 0,
    activePackages: 1,
  },
  {
    id: 'CUS-003',
    name: 'Al Majaz Waterfront',
    contacts: [
      {
        id: 'CON-004',
        name: 'Fatima Hassan',
        email: 'fatima@almajaz.ae',
        phone: '+971 6 533 7890',
        position: 'Brand Manager',
        isPrimary: true,
      },
    ],
    location: 'Sharjah, UAE',
    website: 'almajaz.ae',
    industry: 'Tourism & Hospitality',
    notes: 'Premium client - high-quality visuals, event promotions',
    createdAt: '2021-09-20',
    activeProjects: 2,
    activePackages: 1,
  },
  {
    id: 'CUS-004',
    name: 'Sharjah Chamber of Commerce',
    contacts: [
      {
        id: 'CON-005',
        name: 'Ahmed Al Mualla',
        email: 'ahmed@sharjahchamber.ae',
        phone: '+971 6 530 2222',
        position: 'Marketing Director',
        isPrimary: true,
      },
    ],
    location: 'Sharjah, UAE',
    website: 'sharjahchamber.ae',
    industry: 'Government / Business',
    notes: 'Corporate branding, annual reports, event materials',
    createdAt: '2020-03-10',
    activeProjects: 1,
    activePackages: 0,
  },
  {
    id: 'CUS-005',
    name: 'Bee\'ah',
    contacts: [
      {
        id: 'CON-006',
        name: 'Sara Al Ketbi',
        email: 'sara@beeah.ae',
        phone: '+971 6 555 8888',
        position: 'PR & Communications',
        isPrimary: true,
      },
    ],
    location: 'Sharjah, UAE',
    website: 'beeah.ae',
    industry: 'Environmental Services',
    notes: 'Sustainability-focused campaigns, infographics',
    createdAt: '2022-01-05',
    activeProjects: 1,
    activePackages: 0,
  },
  {
    id: 'CUS-006',
    name: 'American University of Sharjah',
    contacts: [
      {
        id: 'CON-007',
        name: 'Dr. Nadia Youssef',
        email: 'nyoussef@aus.edu',
        phone: '+971 6 515 1234',
        position: 'Marketing Director',
        isPrimary: true,
      },
      {
        id: 'CON-008',
        name: 'Lina Abbas',
        email: 'labbas@aus.edu',
        phone: '+971 6 515 1235',
        position: 'Design Coordinator',
        isPrimary: false,
      },
    ],
    location: 'Sharjah, UAE',
    website: 'aus.edu',
    industry: 'Education',
    notes: 'Academic publications, event promotions, recruitment campaigns',
    createdAt: '2019-08-15',
    activeProjects: 0,
    activePackages: 1,
  },
  {
    id: 'CUS-007',
    name: 'Sharjah Art Foundation',
    contacts: [
      {
        id: 'CON-009',
        name: 'Noura Al Suwaidi',
        email: 'noura@sharjahart.org',
        phone: '+971 6 568 5050',
        position: 'Visual Communications',
        isPrimary: true,
      },
    ],
    location: 'Sharjah, UAE',
    website: 'sharjahart.org',
    industry: 'Arts & Culture',
    notes: 'Art exhibitions, catalogues, creative campaigns',
    createdAt: '2021-02-28',
    activeProjects: 1,
    activePackages: 0,
  },
  {
    id: 'CUS-008',
    name: 'Al Zarooni Group',
    contacts: [
      {
        id: 'CON-010',
        name: 'Rashid Al Zarooni',
        email: 'rashid@alzarooni.ae',
        phone: '+971 4 333 4444',
        position: 'CEO',
        isPrimary: true,
      },
      {
        id: 'CON-011',
        name: 'Mariam Khalid',
        email: 'mariam@alzarooni.ae',
        phone: '+971 4 333 4445',
        position: 'Marketing Manager',
        isPrimary: false,
      },
    ],
    location: 'Dubai, UAE',
    website: 'alzarooni.ae',
    industry: 'Real Estate',
    notes: 'Property launches, corporate materials, signage',
    createdAt: '2023-04-01',
    activeProjects: 2,
    activePackages: 0,
  },
];

// Get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find((c) => c.id === id);
};

// Get customers with active projects
export const getCustomersWithActiveProjects = (): Customer[] => {
  return mockCustomers.filter((c) => c.activeProjects > 0);
};

// Get customers with active packages
export const getCustomersWithActivePackages = (): Customer[] => {
  return mockCustomers.filter((c) => c.activePackages > 0);
};

// Search customers
export const searchCustomers = (query: string): Customer[] => {
  const lowerQuery = query.toLowerCase();
  return mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.location.toLowerCase().includes(lowerQuery) ||
      c.industry?.toLowerCase().includes(lowerQuery)
  );
};
