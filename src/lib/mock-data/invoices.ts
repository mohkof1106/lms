import { Invoice, InvoiceStatus, Payment } from '@/types';

export const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'LOR-INV-2024-001',
    offerId: 'OFF-001',
    customerId: 'CUS-001',
    customerName: 'TAHSEEL Information Technology',
    date: '2024-09-25',
    dueDate: '2024-10-25',
    lineItems: [
      {
        id: 'LI-001',
        serviceId: 'SRV-005',
        description: 'Logo Design - Complete logo design with 3 concepts, revisions, and final files',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
      {
        id: 'LI-002',
        serviceId: 'SRV-006',
        description: 'Brand Identity Package - Full brand identity: logo, colors, typography, brand guidelines',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
      {
        id: 'LI-003',
        serviceId: 'SRV-008',
        description: 'Stationery Design - Business cards, letterhead, envelope, email signature',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
    ],
    subtotal: 22500,
    vatRate: 5,
    vatAmount: 1125,
    total: 23625,
    status: 'paid',
    payments: [
      {
        id: 'PAY-001',
        date: '2024-09-26',
        amount: 11812.5,
        method: 'bank_transfer',
        reference: 'TRF-20240926-001',
      },
      {
        id: 'PAY-002',
        date: '2024-10-20',
        amount: 11812.5,
        method: 'bank_transfer',
        reference: 'TRF-20241020-001',
      },
    ],
    paidAmount: 23625,
    balance: 0,
  },
  {
    id: 'INV-002',
    invoiceNumber: 'LOR-INV-2024-002',
    offerId: 'OFF-002',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    date: '2024-11-01',
    dueDate: '2024-12-01',
    lineItems: [
      {
        id: 'LI-004',
        serviceId: 'SRV-004',
        description: 'Social Media Campaign - New Year celebration campaign',
        quantity: 1,
        unitPrice: 3500,
        total: 3500,
      },
      {
        id: 'LI-005',
        serviceId: 'SRV-011',
        description: 'Social Media Video (15-30s) - Countdown video',
        quantity: 2,
        unitPrice: 3000,
        total: 6000,
      },
      {
        id: 'LI-006',
        description: 'Event photography coverage (additional)',
        quantity: 1,
        unitPrice: 5000,
        total: 5000,
      },
    ],
    subtotal: 14500,
    vatRate: 5,
    vatAmount: 725,
    total: 15225,
    status: 'unpaid',
    payments: [],
    paidAmount: 0,
    balance: 15225,
  },
  {
    id: 'INV-003',
    invoiceNumber: 'LOR-INV-2024-003',
    offerId: 'OFF-003',
    customerId: 'CUS-008',
    customerName: 'Al Zarooni Group',
    date: '2024-11-05',
    dueDate: '2024-12-05',
    lineItems: [
      {
        id: 'LI-007',
        serviceId: 'SRV-005',
        description: 'Logo Design - Development project branding',
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
      {
        id: 'LI-008',
        serviceId: 'SRV-006',
        description: 'Brand Identity Package - Complete visual identity',
        quantity: 1,
        unitPrice: 20000,
        total: 20000,
      },
      {
        id: 'LI-009',
        serviceId: 'SRV-013',
        description: 'Brochure Design (Tri-fold) - Sales brochure',
        quantity: 2,
        unitPrice: 2000,
        total: 4000,
      },
      {
        id: 'LI-010',
        serviceId: 'SRV-014',
        description: 'Company Profile (20 pages) - Project profile',
        quantity: 1,
        unitPrice: 12000,
        total: 12000,
      },
      {
        id: 'LI-011',
        serviceId: 'SRV-023',
        description: 'Signage Design - Sales center signage',
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
    ],
    subtotal: 52000,
    vatRate: 5,
    vatAmount: 2600,
    total: 54600,
    status: 'partial',
    payments: [
      {
        id: 'PAY-003',
        date: '2024-11-08',
        amount: 16380,
        method: 'bank_transfer',
        reference: 'TRF-20241108-001',
      },
    ],
    paidAmount: 16380,
    balance: 38220,
  },
  {
    id: 'INV-004',
    invoiceNumber: 'LOR-INV-2024-004',
    customerId: 'CUS-002',
    customerName: 'Sharjah Economic Development Department (SEDD)',
    date: '2024-11-01',
    dueDate: '2024-11-30',
    lineItems: [
      {
        id: 'LI-019',
        description: 'Social Media Management - November 2024',
        quantity: 1,
        unitPrice: 15000,
        total: 15000,
      },
    ],
    subtotal: 15000,
    vatRate: 5,
    vatAmount: 750,
    total: 15750,
    status: 'unpaid',
    payments: [],
    paidAmount: 0,
    balance: 15750,
  },
  {
    id: 'INV-005',
    invoiceNumber: 'LOR-INV-2024-005',
    customerId: 'CUS-003',
    customerName: 'Al Majaz Waterfront',
    date: '2024-11-01',
    dueDate: '2024-11-30',
    lineItems: [
      {
        id: 'LI-020',
        description: 'Content Creation Package - November 2024',
        quantity: 1,
        unitPrice: 12000,
        total: 12000,
      },
    ],
    subtotal: 12000,
    vatRate: 5,
    vatAmount: 600,
    total: 12600,
    status: 'paid',
    payments: [
      {
        id: 'PAY-004',
        date: '2024-11-10',
        amount: 12600,
        method: 'bank_transfer',
        reference: 'TRF-20241110-001',
      },
    ],
    paidAmount: 12600,
    balance: 0,
  },
  {
    id: 'INV-006',
    invoiceNumber: 'LOR-INV-2024-006',
    customerId: 'CUS-006',
    customerName: 'American University of Sharjah',
    date: '2024-11-01',
    dueDate: '2024-11-30',
    lineItems: [
      {
        id: 'LI-021',
        description: 'Academic Marketing Package - November 2024',
        quantity: 1,
        unitPrice: 8000,
        total: 8000,
      },
    ],
    subtotal: 8000,
    vatRate: 5,
    vatAmount: 400,
    total: 8400,
    status: 'paid',
    payments: [
      {
        id: 'PAY-005',
        date: '2024-11-05',
        amount: 8400,
        method: 'cheque',
        reference: 'CHQ-2024-1105',
      },
    ],
    paidAmount: 8400,
    balance: 0,
  },
];

export const getInvoiceById = (id: string): Invoice | undefined => {
  return mockInvoices.find((i) => i.id === id);
};

export const getInvoicesByCustomer = (customerId: string): Invoice[] => {
  return mockInvoices.filter((i) => i.customerId === customerId);
};

export const getInvoicesByStatus = (status: InvoiceStatus): Invoice[] => {
  return mockInvoices.filter((i) => i.status === status);
};

export const getOverdueInvoices = (): Invoice[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockInvoices.filter((i) => i.status !== 'paid' && i.dueDate < today);
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  unpaid: 'Unpaid',
  partial: 'Partially Paid',
  paid: 'Paid',
};

export const paymentMethodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  cheque: 'Cheque',
  card: 'Card',
};
