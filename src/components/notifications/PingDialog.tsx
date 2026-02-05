'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface PingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PingableUser {
  id: string;
  fullName: string;
  employeeName: string | null;
}

export function PingDialog({ open, onOpenChange }: PingDialogProps) {
  const currentUser = useAuthStore((s) => s.user);
  const sendPing = useNotificationStore((s) => s.sendPing);
  const [users, setUsers] = useState<PingableUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Fetch users that can be pinged (all active users except current)
  useEffect(() => {
    if (!open || !currentUser) return;

    async function fetchUsers() {
      const { data } = await supabase
        .from('user_profiles')
        .select('id, full_name, employee_id, employees(full_name)')
        .eq('is_active', true)
        .neq('id', currentUser!.id)
        .order('full_name');

      if (data) {
        setUsers(
          data.map((u: any) => ({
            id: u.id,
            fullName: u.full_name,
            employeeName: u.employees?.full_name || null,
          }))
        );
      }
    }
    fetchUsers();
  }, [open, currentUser]);

  const handleSend = async () => {
    if (!selectedUserId || !currentUser) return;

    try {
      setSending(true);
      await sendPing(currentUser.id, currentUser.fullName, selectedUserId, message || undefined);
      toast.success('Ping sent!');
      setSelectedUserId('');
      setMessage('');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send ping');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ping Someone</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Person</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose who to ping" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Message (optional)</Label>
              <span className="text-xs text-muted-foreground">{message.length}/100</span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 100))}
              placeholder="Quick message..."
              rows={2}
              maxLength={100}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!selectedUserId || sending}>
              {sending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Ping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
