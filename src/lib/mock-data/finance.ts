import { Cost, Revenue, MonthlyPnL, CostCategory } from '@/types';

export const mockCosts: Cost[] = [
  // Recurring costs
  {
    id: 'COST-001',
    category: 'rent',
    description: 'Office rent - Sharjah Media City',
    expectedAmount: 15000,
    actualAmount: 15000,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: 'COST-002',
    category: 'utilities',
    description: 'Electricity & Water',
    expectedAmount: 2000,
    actualAmount: 1850,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: 'COST-003',
    category: 'software',
    description: 'Adobe Creative Cloud (Team)',
    expectedAmount: 3500,
    actualAmount: 3500,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: 'COST-004',
    category: 'software',
    description: 'Figma Team',
    expectedAmount: 600,
    actualAmount: 600,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: 'COST-005',
    category: 'software',
    description: 'Microsoft 365 Business',
    expectedAmount: 800,
    actualAmount: 800,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  {
    id: 'COST-006',
    category: 'marketing',
    description: 'Social media advertising',
    expectedAmount: 2000,
    actualAmount: 2500,
    date: '2024-11-01',
    recurring: true,
    frequency: 'monthly',
  },
  // One-time costs
  {
    id: 'COST-007',
    category: 'equipment',
    description: 'MacBook Pro M3 - New designer',
    expectedAmount: 12000,
    actualAmount: 11500,
    date: '2024-11-10',
    recurring: false,
  },
  {
    id: 'COST-008',
    category: 'equipment',
    description: 'External monitors (2x)',
    expectedAmount: 4000,
    actualAmount: 3800,
    date: '2024-11-10',
    recurring: false,
  },
  {
    id: 'COST-009',
    category: 'other',
    description: 'Team building event',
    expectedAmount: 5000,
    actualAmount: 4500,
    date: '2024-11-15',
    recurring: false,
  },
];

export const mockRevenue: Revenue[] = [
  {
    id: 'REV-001',
    invoiceId: 'INV-001',
    customerId: 'CUS-001',
    customerName: 'TAHSEEL Information Technology',
    projectId: 'PRJ-001',
    amount: 23625,
    date: '2024-10-20',
  },
  {
    id: 'REV-002',
    invoiceId: 'INV-003',
    customerId: 'CUS-008',
    customerName: 'Al Zarooni Group',
    projectId: 'PRJ-007',
    amount: 16380,
    date: '2024-11-08',
  },
  {
    id: 'REV-003',
    invoiceId: 'INV-005',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    amount: 12600,
    date: '2024-11-10',
  },
  {
    id: 'REV-004',
    invoiceId: 'INV-006',
    customerId: 'CUS-006',
    customerName: 'American University of Sharjah',
    amount: 8400,
    date: '2024-11-05',
  },
];

export const mockMonthlyPnL: MonthlyPnL[] = [
  {
    month: 'January',
    year: 2024,
    revenue: 85000,
    costs: 72000,
    grossProfit: 13000,
    profitMargin: 15.3,
  },
  {
    month: 'February',
    year: 2024,
    revenue: 92000,
    costs: 74000,
    grossProfit: 18000,
    profitMargin: 19.6,
  },
  {
    month: 'March',
    year: 2024,
    revenue: 78000,
    costs: 71000,
    grossProfit: 7000,
    profitMargin: 9.0,
  },
  {
    month: 'April',
    year: 2024,
    revenue: 105000,
    costs: 75000,
    grossProfit: 30000,
    profitMargin: 28.6,
  },
  {
    month: 'May',
    year: 2024,
    revenue: 88000,
    costs: 73000,
    grossProfit: 15000,
    profitMargin: 17.0,
  },
  {
    month: 'June',
    year: 2024,
    revenue: 95000,
    costs: 76000,
    grossProfit: 19000,
    profitMargin: 20.0,
  },
  {
    month: 'July',
    year: 2024,
    revenue: 82000,
    costs: 72000,
    grossProfit: 10000,
    profitMargin: 12.2,
  },
  {
    month: 'August',
    year: 2024,
    revenue: 68000,
    costs: 70000,
    grossProfit: -2000,
    profitMargin: -2.9,
  },
  {
    month: 'September',
    year: 2024,
    revenue: 110000,
    costs: 78000,
    grossProfit: 32000,
    profitMargin: 29.1,
  },
  {
    month: 'October',
    year: 2024,
    revenue: 125000,
    costs: 82000,
    grossProfit: 43000,
    profitMargin: 34.4,
  },
  {
    month: 'November',
    year: 2024,
    revenue: 61005,
    costs: 85000,
    grossProfit: -23995,
    profitMargin: -39.3,
  },
];

export const getCostsByCategory = (category: CostCategory): Cost[] => {
  return mockCosts.filter((c) => c.category === category);
};

export const getRecurringCosts = (): Cost[] => {
  return mockCosts.filter((c) => c.recurring);
};

export const getMonthlyTotalCosts = (): number => {
  return mockCosts
    .filter((c) => c.recurring && c.frequency === 'monthly')
    .reduce((sum, c) => sum + (c.actualAmount || c.expectedAmount), 0);
};

export const costCategoryLabels: Record<CostCategory, string> = {
  salary: 'Salaries',
  overhead: 'Overhead',
  software: 'Software',
  equipment: 'Equipment',
  marketing: 'Marketing',
  rent: 'Rent',
  utilities: 'Utilities',
  other: 'Other',
};
