// User Roles
export type UserRole = 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm';

// Employee Types
export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  jobTitle: string;
  department: string;
  baseSalary: number;
  insurance: number;
  ticketValue: number;
  visaCost: number;
  vacationDays: number;
  startDate: string;
  endDate?: string;
  active: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents?: {
    type: string;
    name: string;
    url: string;
    uploadDate: string;
  }[];
}

export interface EmployeeCostBreakdown {
  monthlyCost: number;
  fullCost: number;
  yearlyCost: number;
  dailyCost: number;
  hourlyCost: number;
  workingDaysPerYear: number;
}

// Customer Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
  isPrimary: boolean;
}

export interface Customer {
  id: string;
  name: string;
  contacts: Contact[];
  location: string;
  website?: string;
  industry?: string;
  notes?: string;
  createdAt: string;
  activeProjects: number;
  activePackages: number;
}

// Service Types
export type ServiceCategory = 'social' | 'print' | 'branding' | 'video' | 'web' | 'packaging' | 'signage' | 'motion';

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedHours: number;
  category: ServiceCategory;
  active: boolean;
}

// Package Types
export type DeliverablePeriod = 'daily' | 'weekly' | 'monthly';

export interface PackageDeliverable {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  period: DeliverablePeriod;
  completedThisPeriod: number;
}

export interface Package {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  monthlyFee: number;
  startDate: string;
  endDate?: string;
  active: boolean;
  deliverables: PackageDeliverable[];
}

// Project Types
export type ProjectType = 'brand_identity' | 'print' | 'digital' | 'packaging' | 'signage' | 'motion' | 'retainer';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  type: ProjectType;
  status: ProjectStatus;
  startDate: string;
  deadline?: string;
  completedDate?: string;
  budget?: number;
  description?: string;
  assignedEmployees: string[];
}

// Task Types
export type TaskStatus = 'brief' | 'concept' | 'design' | 'revisions' | 'approval' | 'delivered';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: string[];
  assigneeNames: string[];
  dueDate?: string;
  revisionCount: number;
  subtasks: Subtask[];
  comments: TaskComment[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Estimator Types
export interface EstimateEmployee {
  employeeId: string;
  employeeName: string;
  hours: number;
  hourlyCost: number;
  totalCost: number;
}

export interface Estimate {
  id: string;
  title: string;
  description?: string;
  serviceIds?: string[];
  employees: EstimateEmployee[];
  totalCost: number;
  overheadPercent: number;
  overheadAmount: number;
  profitMarginPercent: number;
  suggestedPrice: number;
  createdAt: string;
  expiresAt: string;
}

// Offer Types
export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface OfferLineItem {
  id: string;
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Offer {
  id: string;
  offerNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  lineItems: OfferLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms?: string;
  status: OfferStatus;
  notes?: string;
}

// Invoice Types
export type InvoiceStatus = 'unpaid' | 'partial' | 'paid';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'cheque' | 'card';
  reference?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  offerId?: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  lineItems: OfferLineItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: InvoiceStatus;
  payments: Payment[];
  paidAmount: number;
  balance: number;
}

// Finance Types
export type CostCategory = 'salary' | 'overhead' | 'software' | 'equipment' | 'marketing' | 'rent' | 'utilities' | 'other';

export interface Cost {
  id: string;
  category: CostCategory;
  description: string;
  expectedAmount: number;
  actualAmount?: number;
  date: string;
  recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
}

export interface Revenue {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  projectId?: string;
  amount: number;
  date: string;
}

export interface MonthlyPnL {
  month: string;
  year: number;
  revenue: number;
  costs: number;
  grossProfit: number;
  profitMargin: number;
}

// Asset Types
export type AssetCategory = 'equipment' | 'software' | 'furniture' | 'vehicle' | 'other';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  usefulLifeYears: number;
  currentValue: number;
  depreciationPerYear: number;
  assignedTo?: string;
  serialNumber?: string;
  notes?: string;
}

// Settings Types
export interface CompanySettings {
  name: string;
  address: string;
  trn: string;
  logoUrl?: string;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  defaultVatRate: number;
  defaultProfitMargin: number;
  currency: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  year: number;
}

export interface OverheadCost {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}
