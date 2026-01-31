import { ExpenseCategory, ExpenseStatus, ExpensePaymentMethod } from '@/types';

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  rent: 'Rent',
  utilities: 'Utilities',
  software: 'Software',
  equipment: 'Equipment',
  marketing: 'Marketing',
  office_supplies: 'Office Supplies',
  professional_services: 'Professional Services',
  travel: 'Travel',
  team_activities: 'Team Activities',
  taxes_fees: 'Taxes & Fees',
  insurance: 'Insurance',
  maintenance: 'Maintenance',
  other: 'Other',
};

export const expenseCategoryColors: Record<ExpenseCategory, string> = {
  rent: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  utilities: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  software: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  equipment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  office_supplies: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  professional_services: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  travel: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  team_activities: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  taxes_fees: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  insurance: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export const expenseStatusLabels: Record<ExpenseStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  voided: 'Voided',
};

export const expenseStatusColors: Record<ExpenseStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  voided: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export const expensePaymentMethodLabels: Record<ExpensePaymentMethod, string> = {
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  credit_card: 'Credit Card',
  cheque: 'Cheque',
};

export const expenseCategories: ExpenseCategory[] = [
  'rent',
  'utilities',
  'software',
  'equipment',
  'marketing',
  'office_supplies',
  'professional_services',
  'travel',
  'team_activities',
  'taxes_fees',
  'insurance',
  'maintenance',
  'other',
];

export const expenseStatuses: ExpenseStatus[] = ['pending', 'paid', 'voided'];

export const expensePaymentMethods: ExpensePaymentMethod[] = [
  'bank_transfer',
  'cash',
  'credit_card',
  'cheque',
];
