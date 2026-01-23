// Currency formatting for AED
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' AED';
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

// Phone formatting (keep as-is for UAE numbers)
export const formatPhone = (phone: string): string => {
  return phone;
};

// Role display names
export const roleLabels: Record<string, string> = {
  admin: 'Admin',
  sr_manager: 'Sr. Manager',
  manager: 'Manager',
  designer: 'Designer',
  hr: 'HR',
  pm: 'Project Manager',
};

// Status badge variants
export type StatusVariant = 'default' | 'success' | 'warning' | 'destructive';

export const getStatusVariant = (status: string): StatusVariant => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'paid':
    case 'accepted':
      return 'success';
    case 'pending':
    case 'in_progress':
    case 'partial':
      return 'warning';
    case 'inactive':
    case 'cancelled':
    case 'rejected':
    case 'overdue':
      return 'destructive';
    default:
      return 'default';
  }
};
