// User Roles (job roles on employees)
export type UserRole = 'admin' | 'sr_manager' | 'manager' | 'designer' | 'hr' | 'pm';

// System Roles (access control for the app)
export type SystemRole = 'admin' | 'manager' | 'member' | 'viewer';

// User Profile (linked to Supabase Auth)
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  systemRole: SystemRole;
  employeeId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export type NotificationType = 'ping' | 'task_assigned' | 'comment_added' | 'status_change' | 'offer_accepted' | 'offer_rejected' | 'system';

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string | null;
  senderName?: string;
  type: NotificationType;
  title: string;
  message: string | null;
  relatedType: string | null;
  relatedId: string | null;
  isRead: boolean;
  createdAt: string;
}

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
  compensation: number;
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
  assetDepreciationYearly: number;
  assetDepreciationMonthly: number;
  overheadShare: number;
  benefitsCost: number; // insurance/12 + ticket/12 + visa/24 + 13th month
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
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
  trn?: string; // Tax Registration Number
  createdAt: string;
  activeProjects: number;
  activePackages: number;
}

// Service Types
export interface ServiceCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ServiceSubtask {
  id: string;
  serviceId: string;
  title: string;
  percentage: number;  // % of service time (must sum to 100)
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  categoryId: string;
  category?: ServiceCategory;  // populated via join
  active: boolean;
  subtasks?: ServiceSubtask[];
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
export type OfferTaskStatus = 'not_started' | 'in_progress' | 'completed';

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
  discountPercent?: number;
  discountAmount?: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  terms?: string;
  status: OfferStatus;
  notes?: string;
  // Internal cost fields (from estimator)
  laborCost?: number;
  overheadPercent?: number;
  overheadAmount?: number;
  profitAmount?: number;
  // Task workflow fields
  lpoNumber?: string;
  tasksInitiated?: boolean;
  taskStatus?: OfferTaskStatus;
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

// Expense Types
export type ExpenseCategory =
  | 'rent'
  | 'utilities'
  | 'software'
  | 'equipment'
  | 'marketing'
  | 'office_supplies'
  | 'professional_services'
  | 'travel'
  | 'team_activities'
  | 'taxes_fees'
  | 'insurance'
  | 'maintenance'
  | 'other';

export type ExpenseStatus = 'pending' | 'paid' | 'voided';

export type ExpensePaymentMethod = 'bank_transfer' | 'cash' | 'credit_card' | 'cheque';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  status: ExpenseStatus;
  expenseDate: string;
  paymentDate?: string;
  dueDate?: string;
  paymentMethod?: ExpensePaymentMethod;
  paymentReference?: string;
  vendorName?: string;
  isAssetPurchase: boolean;
  assetId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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

// Task Board Types (Supabase-backed)
export interface TaskBoardColumn {
  id: string;
  name: string;
  color: string;
  sortOrder: number;
  isSystem: boolean;
}

export type DbTaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DbTaskSubtaskStatus = 'pending' | 'in_progress' | 'completed';

export interface DbTaskSubtaskAssignee {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeJobTitle?: string;
}

export interface DbTaskSubtask {
  id: string;
  taskId: string;
  serviceSubtaskId?: string;
  title: string;
  percentage: number;
  hoursEstimated: number;
  hoursActual: number;
  targetDate?: string;
  completedAt?: string;
  completed: boolean;
  status: DbTaskSubtaskStatus;
  sortOrder: number;
  assignees: DbTaskSubtaskAssignee[];
}

export interface DbTask {
  id: string;
  offerId?: string;
  offerLineItemId?: string;
  serviceId?: string;
  columnId: string;
  title: string;
  description?: string;
  priority: DbTaskPriority;
  dueDate?: string;
  targetCompletionDate?: string;
  hoursEstimated: number;
  hoursActual: number;
  revisionCount: number;
  subtasks: DbTaskSubtask[];
  createdAt: string;
  updatedAt: string;
  // Populated via joins
  offerNumber?: string;
  customerName?: string;
  serviceName?: string;
  columnName?: string;
  columnColor?: string;
}

export interface DbTaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

// Task initiation types
export interface LineItemCompletionDate {
  lineItemId: string;
  description: string;
  serviceId?: string;
  quantity: number;
  targetDate: string;
}
