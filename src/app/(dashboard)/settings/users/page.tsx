'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout';
import { UserTable, CreateUserDialog } from '@/components/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { Plus, Search, Loader2 } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Guard: admin only
  useEffect(() => {
    if (currentUser && currentUser.systemRole !== 'admin') {
      router.push('/settings');
    }
  }, [currentUser, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    // Fetch user profiles with linked employee names
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*, employees(full_name)')
      .order('created_at', { ascending: false });

    if (!error && profiles) {
      const mapped = profiles.map((p: any) => ({
        ...p,
        employee_name: p.employees?.full_name || null,
      }));
      setUsers(mapped);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter by search
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.employee_name?.toLowerCase().includes(q)
    );
  });

  if (currentUser?.systemRole !== 'admin') {
    return null;
  }

  return (
    <PageWrapper
      title="Users"
      description={`${users.length} user${users.length !== 1 ? 's' : ''}`}
      actions={
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      }
    >
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <UserTable users={filteredUsers} onRefresh={fetchUsers} />
      )}

      {/* Create Dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={fetchUsers}
      />
    </PageWrapper>
  );
}
