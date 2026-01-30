import { Employee, EmployeeCostBreakdown } from '@/types';
import { mockCompanySettings, getTotalMonthlyOverhead, getWorkingDaysPerYear } from './settings';
import { getAssetsByAssignee } from './assets';

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    fullName: 'Omar Al Rashid',
    email: 'omar@lor.ae',
    phone: '+971 50 123 4567',
    role: 'admin',
    jobTitle: 'Creative Director & Owner',
    department: 'Management',
    baseSalary: 35000,
    compensation: 0,
    insurance: 8000,
    ticketValue: 5000,
    visaCost: 5500,
    vacationDays: 30,
    startDate: '2018-01-15',
    active: true,
  },
  {
    id: 'EMP-002',
    fullName: 'Sarah Ahmed',
    email: 'sarah@lor.ae',
    phone: '+971 50 234 5678',
    role: 'sr_manager',
    jobTitle: 'Senior Account Manager',
    department: 'Client Services',
    baseSalary: 18000,
    compensation: 0,
    insurance: 6000,
    ticketValue: 4000,
    visaCost: 4500,
    vacationDays: 30,
    startDate: '2019-06-01',
    active: true,
  },
  {
    id: 'EMP-003',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.h@lor.ae',
    phone: '+971 50 345 6789',
    role: 'designer',
    jobTitle: 'Senior Graphic Designer',
    department: 'Creative',
    baseSalary: 12000,
    compensation: 0,
    insurance: 5000,
    ticketValue: 3500,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2020-03-15',
    active: true,
  },
  {
    id: 'EMP-004',
    fullName: 'Fatima Al Zahra',
    email: 'fatima@lor.ae',
    phone: '+971 50 456 7890',
    role: 'designer',
    jobTitle: 'Motion Graphics Designer',
    department: 'Creative',
    baseSalary: 10000,
    compensation: 0,
    insurance: 5000,
    ticketValue: 3500,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2021-01-10',
    active: true,
  },
  {
    id: 'EMP-005',
    fullName: 'Mohammed Khalid',
    email: 'mohammed@lor.ae',
    phone: '+971 50 567 8901',
    role: 'designer',
    jobTitle: 'UI/UX Designer',
    department: 'Creative',
    baseSalary: 11000,
    compensation: 0,
    insurance: 5000,
    ticketValue: 3500,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2021-06-01',
    active: true,
  },
  {
    id: 'EMP-006',
    fullName: 'Layla Ibrahim',
    email: 'layla@lor.ae',
    phone: '+971 50 678 9012',
    role: 'designer',
    jobTitle: 'Graphic Designer',
    department: 'Creative',
    baseSalary: 8000,
    compensation: 0,
    insurance: 4500,
    ticketValue: 3000,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2022-02-15',
    active: true,
  },
  {
    id: 'EMP-007',
    fullName: 'Khalid Mansoor',
    email: 'khalid@lor.ae',
    phone: '+971 50 789 0123',
    role: 'designer',
    jobTitle: 'Junior Designer',
    department: 'Creative',
    baseSalary: 6000,
    compensation: 0,
    insurance: 4000,
    ticketValue: 2500,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2023-09-01',
    active: true,
  },
  {
    id: 'EMP-008',
    fullName: 'Aisha Noor',
    email: 'aisha@lor.ae',
    phone: '+971 50 890 1234',
    role: 'pm',
    jobTitle: 'Project Manager',
    department: 'Operations',
    baseSalary: 12000,
    compensation: 0,
    insurance: 5000,
    ticketValue: 3500,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2021-08-15',
    active: true,
  },
  {
    id: 'EMP-009',
    fullName: 'Yusuf Ali',
    email: 'yusuf@lor.ae',
    phone: '+971 50 901 2345',
    role: 'manager',
    jobTitle: 'Brand Strategist',
    department: 'Strategy',
    baseSalary: 14000,
    compensation: 0,
    insurance: 5500,
    ticketValue: 4000,
    visaCost: 4500,
    vacationDays: 30,
    startDate: '2020-11-01',
    active: true,
  },
  {
    id: 'EMP-010',
    fullName: 'Rania Mahmoud',
    email: 'rania@lor.ae',
    phone: '+971 50 012 3456',
    role: 'hr',
    jobTitle: 'HR & Admin Officer',
    department: 'Administration',
    baseSalary: 9000,
    compensation: 0,
    insurance: 4500,
    ticketValue: 3000,
    visaCost: 4000,
    vacationDays: 30,
    startDate: '2022-05-01',
    active: true,
  },
];

// Calculate employee cost breakdown
export const calculateEmployeeCost = (employee: Employee): EmployeeCostBreakdown => {
  const settings = mockCompanySettings;
  const totalMonthlyOverhead = getTotalMonthlyOverhead();
  const activeEmployeeCount = mockEmployees.filter((e) => e.active).length;
  const overheadSharePerEmployee = totalMonthlyOverhead / activeEmployeeCount;

  // Asset depreciation for assigned assets
  const assignedAssets = getAssetsByAssignee(employee.id);
  const assetDepreciationYearly = assignedAssets.reduce((sum, asset) => sum + asset.depreciationPerYear, 0);
  const assetDepreciationMonthly = assetDepreciationYearly / 12;

  // Monthly Cost = Base Salary + (Insurance / 12) + (Ticket Value / 12) + (Visa Cost / 24) + (13th Salary / 12) + Asset Depreciation
  const monthlyCost =
    employee.baseSalary +
    employee.insurance / 12 +
    employee.ticketValue / 12 +
    employee.visaCost / 24 +
    employee.baseSalary / 12 + // 13th salary
    assetDepreciationMonthly;

  // Full Cost = Monthly Cost + Overhead Share
  const fullCost = monthlyCost + overheadSharePerEmployee;

  // Yearly Cost
  const yearlyCost = fullCost * 12;

  // Working days per year
  const workingDaysPerYear = getWorkingDaysPerYear(employee.vacationDays);

  // Daily Cost
  const dailyCost = yearlyCost / workingDaysPerYear;

  // Hourly Cost
  const hourlyCost = dailyCost / settings.workingHoursPerDay;

  return {
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    fullCost: Math.round(fullCost * 100) / 100,
    yearlyCost: Math.round(yearlyCost * 100) / 100,
    dailyCost: Math.round(dailyCost * 100) / 100,
    hourlyCost: Math.round(hourlyCost * 100) / 100,
    workingDaysPerYear,
    assetDepreciationYearly: Math.round(assetDepreciationYearly * 100) / 100,
    assetDepreciationMonthly: Math.round(assetDepreciationMonthly * 100) / 100,
  };
};

// Get employee by ID
export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find((e) => e.id === id);
};

// Get employees by role
export const getEmployeesByRole = (role: string): Employee[] => {
  return mockEmployees.filter((e) => e.role === role && e.active);
};

// Get active employees
export const getActiveEmployees = (): Employee[] => {
  return mockEmployees.filter((e) => e.active);
};
