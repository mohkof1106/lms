'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { updateUserAction, resetPasswordAction } from '@/app/(dashboard)/settings/users/actions';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { systemRoleLabels } from '@/lib/utils/format';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onUpdated: () => void;
}

export function EditUserDialog({ open, onOpenChange, user, onUpdated }: EditUserDialogProps) {
  const [systemRole, setSystemRole] = useState(user?.system_role || 'member');
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [employeeId, setEmployeeId] = useState<string>(user?.employee_id || 'none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);

  // Reset password
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setSystemRole(user.system_role);
      setIsActive(user.is_active);
      setFullName(user.full_name);
      setEmployeeId(user.employee_id || 'none');
    }
  }, [user]);

  // Fetch available employees
  useEffect(() => {
    if (!open) return;
    async function fetchAvailableEmployees() {
      const { data: employees } = await supabase
        .from('employees')
        .select('id, full_name, email')
        .eq('active', true)
        .order('full_name');

      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('employee_id')
        .not('employee_id', 'is', null);

      const linkedIds = new Set(profiles?.map((p) => p.employee_id) || []);
      // Include current user's linked employee + unlinked employees
      const available = (employees || []).filter(
        (e) => !linkedIds.has(e.id) || e.id === user?.employee_id
      );
      setAvailableEmployees(available);
    }
    fetchAvailableEmployees();
  }, [open, user?.employee_id]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await updateUserAction(user.id, {
        systemRole,
        employeeId: employeeId === 'none' ? null : employeeId,
        isActive,
        fullName,
      });
      toast.success('User updated successfully');
      onOpenChange(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      setResettingPassword(true);
      await resetPasswordAction(user.id, newPassword);
      toast.success('Password reset successfully');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled className="opacity-60" />
          </div>

          <div className="space-y-2">
            <Label>System Role</Label>
            <Select value={systemRole} onValueChange={setSystemRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(systemRoleLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="No employee linked" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No employee linked</SelectItem>
                {availableEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>

          <Separator />

          {/* Reset Password Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Reset Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8 chars)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="secondary"
                onClick={handleResetPassword}
                disabled={resettingPassword || newPassword.length < 8}
              >
                {resettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
