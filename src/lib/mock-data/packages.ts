import { Package, DeliverablePeriod } from '@/types';

export const mockPackages: Package[] = [
  {
    id: 'PKG-001',
    name: 'Social Media Management - SEDD',
    customerId: 'CUS-002',
    customerName: 'Sharjah Economic Development Department (SEDD)',
    monthlyFee: 15000,
    startDate: '2024-01-01',
    active: true,
    deliverables: [
      {
        id: 'DEL-001',
        serviceId: 'SRV-001',
        serviceName: 'Social Media Post Design',
        quantity: 25,
        period: 'monthly',
        completedThisPeriod: 18,
      },
      {
        id: 'DEL-002',
        serviceId: 'SRV-003',
        serviceName: 'Story/Reel Design',
        quantity: 10,
        period: 'monthly',
        completedThisPeriod: 7,
      },
    ],
  },
  {
    id: 'PKG-002',
    name: 'Content Creation - Al Majaz',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    monthlyFee: 12000,
    startDate: '2024-03-01',
    active: true,
    deliverables: [
      {
        id: 'DEL-003',
        serviceId: 'SRV-001',
        serviceName: 'Social Media Post Design',
        quantity: 20,
        period: 'monthly',
        completedThisPeriod: 20,
      },
      {
        id: 'DEL-004',
        serviceId: 'SRV-011',
        serviceName: 'Social Media Video (15-30s)',
        quantity: 4,
        period: 'monthly',
        completedThisPeriod: 2,
      },
    ],
  },
  {
    id: 'PKG-003',
    name: 'Academic Marketing - AUS',
    customerId: 'CUS-006',
    customerName: 'American University of Sharjah',
    monthlyFee: 8000,
    startDate: '2023-09-01',
    active: true,
    deliverables: [
      {
        id: 'DEL-005',
        serviceId: 'SRV-001',
        serviceName: 'Social Media Post Design',
        quantity: 15,
        period: 'monthly',
        completedThisPeriod: 15,
      },
      {
        id: 'DEL-006',
        serviceId: 'SRV-015',
        serviceName: 'Flyer Design',
        quantity: 2,
        period: 'monthly',
        completedThisPeriod: 1,
      },
    ],
  },
  {
    id: 'PKG-004',
    name: 'Brand Maintenance - Bee\'ah',
    customerId: 'CUS-005',
    customerName: 'Bee\'ah',
    monthlyFee: 6000,
    startDate: '2024-06-01',
    endDate: '2024-05-31',
    active: false,
    deliverables: [
      {
        id: 'DEL-007',
        serviceId: 'SRV-001',
        serviceName: 'Social Media Post Design',
        quantity: 10,
        period: 'monthly',
        completedThisPeriod: 0,
      },
    ],
  },
];

export const getPackageById = (id: string): Package | undefined => {
  return mockPackages.find((p) => p.id === id);
};

export const getPackagesByCustomer = (customerId: string): Package[] => {
  return mockPackages.filter((p) => p.customerId === customerId);
};

export const getActivePackages = (): Package[] => {
  return mockPackages.filter((p) => p.active);
};

export const deliverablePeriodLabels: Record<DeliverablePeriod, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};
