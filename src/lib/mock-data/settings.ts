import { CompanySettings, Holiday, OverheadCost } from '@/types';

export const mockCompanySettings: CompanySettings = {
  name: 'LOR Computer Designing L.L.C. SP.',
  address: 'Floor 11, Office 1102, Block C, Al Marzouqi Towers, Buhairah Cornich - Sharjah',
  trn: '104453521700003',
  workingHoursPerDay: 8,
  workingDaysPerWeek: 5,
  defaultVatRate: 5,
  defaultProfitMargin: 30,
  currency: 'AED',
};

export const mockCompanyInfo = {
  legalName: 'LOR Computer Designing L.L.C. SP.',
  tradeName: 'LOR',
  tagline: 'Leaders of Resolution',
  services: ['Creative', 'Animation', 'Branding', 'Web design'],
  phone: '06 534 1776',
  mobile: '050 584 6059',
  email: 'Info@lor.ae',
  website: 'www.lor.ae',
  bankName: 'Dubai Islamic Bank',
  accountNo: '036520084502901',
  iban: 'AE140240036520084502901',
  swift: 'DUIBAEAD',
};

// Document number formats
export const documentFormats = {
  invoice: { prefix: 'IN', digits: 5 },      // IN01011
  quotation: { prefix: 'Q', digits: 5 },     // Q01063
  offer: { prefix: 'Q', digits: 5 },         // Same as quotation
  employee: { prefix: 'EMP-', digits: 3 },   // EMP-001
  customer: { prefix: 'CUS-', digits: 3 },   // CUS-001
  project: { prefix: 'PRJ-', digits: 3 },    // PRJ-001
  service: { prefix: 'SRV-', digits: 3 },    // SRV-001
  package: { prefix: 'PKG-', digits: 3 },    // PKG-001
};

export const defaultTerms = `• 100% Full Payment At Item Delivery
• Total payment due in 30 days
• Cheque made payable to LOR Computer Designing L.L.C. SP.`;

// Alias for simpler imports
export const mockHolidays: Holiday[] = [
  { id: 'HOL-001', name: 'New Year\'s Day', date: '2025-01-01', year: 2025 },
  { id: 'HOL-002', name: 'Eid Al Fitr (estimated)', date: '2025-03-30', year: 2025 },
  { id: 'HOL-003', name: 'Eid Al Fitr Day 2', date: '2025-03-31', year: 2025 },
  { id: 'HOL-004', name: 'Eid Al Fitr Day 3', date: '2025-04-01', year: 2025 },
  { id: 'HOL-005', name: 'Arafat Day', date: '2025-06-05', year: 2025 },
  { id: 'HOL-006', name: 'Eid Al Adha', date: '2025-06-06', year: 2025 },
  { id: 'HOL-007', name: 'Eid Al Adha Day 2', date: '2025-06-07', year: 2025 },
  { id: 'HOL-008', name: 'Eid Al Adha Day 3', date: '2025-06-08', year: 2025 },
  { id: 'HOL-009', name: 'Islamic New Year', date: '2025-06-26', year: 2025 },
  { id: 'HOL-010', name: 'Prophet\'s Birthday', date: '2025-09-04', year: 2025 },
  { id: 'HOL-011', name: 'Commemoration Day', date: '2025-12-01', year: 2025 },
  { id: 'HOL-012', name: 'National Day', date: '2025-12-02', year: 2025 },
  { id: 'HOL-013', name: 'National Day Day 2', date: '2025-12-03', year: 2025 },
];

export const mockOverheadCosts: OverheadCost[] = [
  { id: 'OH-001', name: 'Office Rent', amount: 25000, frequency: 'monthly' },
  { id: 'OH-002', name: 'Utilities (SEWA)', amount: 3500, frequency: 'monthly' },
  { id: 'OH-003', name: 'Internet & Phone', amount: 1500, frequency: 'monthly' },
  { id: 'OH-004', name: 'Adobe Creative Cloud (Team)', amount: 8500, frequency: 'monthly' },
  { id: 'OH-005', name: 'Office Supplies', amount: 1000, frequency: 'monthly' },
  { id: 'OH-006', name: 'Insurance', amount: 15000, frequency: 'yearly' },
  { id: 'OH-007', name: 'Accounting & Legal', amount: 2000, frequency: 'monthly' },
  { id: 'OH-008', name: 'Marketing', amount: 5000, frequency: 'monthly' },
];

// Calculate total monthly overhead
export const getTotalMonthlyOverhead = (): number => {
  return mockOverheadCosts.reduce((total, cost) => {
    if (cost.frequency === 'monthly') {
      return total + cost.amount;
    }
    return total + cost.amount / 12;
  }, 0);
};

// Calculate working days per year
export const getWorkingDaysPerYear = (
  vacationDays: number,
  year: number = 2025
): number => {
  const holidays = mockHolidays.filter((h) => h.year === year);
  const workingDaysPerWeek = mockCompanySettings.workingDaysPerWeek;
  const totalWorkingDays = workingDaysPerWeek * 52;
  return totalWorkingDays - vacationDays - holidays.length;
};
