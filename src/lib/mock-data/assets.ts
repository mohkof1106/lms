import { Asset, AssetCategory } from '@/types';

export const mockAssets: Asset[] = [
  {
    id: 'AST-001',
    name: 'MacBook Pro 16" M3 Pro',
    category: 'equipment',
    purchaseDate: '2024-01-15',
    purchasePrice: 12500,
    usefulLifeYears: 4,
    currentValue: 10156,
    depreciationPerYear: 3125,
    assignedTo: 'EMP-003',
    serialNumber: 'C02Z12345ABC',
    notes: 'Primary workstation for senior designer',
  },
  {
    id: 'AST-002',
    name: 'MacBook Pro 14" M3',
    category: 'equipment',
    purchaseDate: '2024-03-10',
    purchasePrice: 9500,
    usefulLifeYears: 4,
    currentValue: 8313,
    depreciationPerYear: 2375,
    assignedTo: 'EMP-004',
    serialNumber: 'C02Z12346ABC',
  },
  {
    id: 'AST-003',
    name: 'MacBook Pro 14" M3',
    category: 'equipment',
    purchaseDate: '2024-03-10',
    purchasePrice: 9500,
    usefulLifeYears: 4,
    currentValue: 8313,
    depreciationPerYear: 2375,
    assignedTo: 'EMP-005',
    serialNumber: 'C02Z12347ABC',
  },
  {
    id: 'AST-004',
    name: 'iMac 27" M3',
    category: 'equipment',
    purchaseDate: '2024-06-01',
    purchasePrice: 11000,
    usefulLifeYears: 5,
    currentValue: 10083,
    depreciationPerYear: 2200,
    assignedTo: 'EMP-006',
    serialNumber: 'C02Z12348ABC',
    notes: 'Video editing workstation',
  },
  {
    id: 'AST-005',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'equipment',
    purchaseDate: '2024-01-15',
    purchasePrice: 3200,
    usefulLifeYears: 5,
    currentValue: 2667,
    depreciationPerYear: 640,
    assignedTo: 'EMP-003',
    serialNumber: 'DEL-32-001',
  },
  {
    id: 'AST-006',
    name: 'Dell UltraSharp 32" 4K Monitor',
    category: 'equipment',
    purchaseDate: '2024-01-15',
    purchasePrice: 3200,
    usefulLifeYears: 5,
    currentValue: 2667,
    depreciationPerYear: 640,
    assignedTo: 'EMP-003',
    serialNumber: 'DEL-32-002',
    notes: 'Dual monitor setup',
  },
  {
    id: 'AST-007',
    name: 'Herman Miller Aeron Chair',
    category: 'furniture',
    purchaseDate: '2023-06-01',
    purchasePrice: 5500,
    usefulLifeYears: 10,
    currentValue: 4675,
    depreciationPerYear: 550,
    assignedTo: 'EMP-001',
    serialNumber: 'HM-AER-001',
  },
  {
    id: 'AST-008',
    name: 'Standing Desk - Electric',
    category: 'furniture',
    purchaseDate: '2024-02-01',
    purchasePrice: 2800,
    usefulLifeYears: 8,
    currentValue: 2538,
    depreciationPerYear: 350,
    assignedTo: 'EMP-003',
    notes: 'Height adjustable standing desk',
  },
  {
    id: 'AST-009',
    name: 'Canon EOS R5',
    category: 'equipment',
    purchaseDate: '2023-09-15',
    purchasePrice: 15000,
    usefulLifeYears: 5,
    currentValue: 11250,
    depreciationPerYear: 3000,
    serialNumber: 'CAN-R5-001',
    notes: 'Studio photography camera',
  },
  {
    id: 'AST-010',
    name: 'Adobe Creative Cloud (Enterprise)',
    category: 'software',
    purchaseDate: '2024-01-01',
    purchasePrice: 42000,
    usefulLifeYears: 1,
    currentValue: 7000,
    depreciationPerYear: 42000,
    notes: 'Annual subscription - 10 seats',
  },
  {
    id: 'AST-011',
    name: 'Figma Organization',
    category: 'software',
    purchaseDate: '2024-01-01',
    purchasePrice: 7200,
    usefulLifeYears: 1,
    currentValue: 1200,
    depreciationPerYear: 7200,
    notes: 'Annual subscription - 10 editors',
  },
  {
    id: 'AST-012',
    name: 'Toyota Hiace Van',
    category: 'vehicle',
    purchaseDate: '2022-03-01',
    purchasePrice: 95000,
    usefulLifeYears: 7,
    currentValue: 58571,
    depreciationPerYear: 13571,
    serialNumber: 'UAE-SHJ-12345',
    notes: 'Delivery and installation vehicle',
  },
];

export const getAssetById = (id: string): Asset | undefined => {
  return mockAssets.find((a) => a.id === id);
};

export const getAssetsByCategory = (category: AssetCategory): Asset[] => {
  return mockAssets.filter((a) => a.category === category);
};

export const getAssetsByAssignee = (employeeId: string): Asset[] => {
  return mockAssets.filter((a) => a.assignedTo === employeeId);
};

export const getTotalAssetValue = (): number => {
  return mockAssets.reduce((sum, a) => sum + a.currentValue, 0);
};

export const assetCategoryLabels: Record<AssetCategory, string> = {
  equipment: 'Equipment',
  software: 'Software',
  furniture: 'Furniture',
  vehicle: 'Vehicle',
  other: 'Other',
};
