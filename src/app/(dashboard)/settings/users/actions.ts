'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Service role client for admin operations (server-only)
function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Server Supabase client to verify caller identity
async function getCallerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
}

// Verify caller is admin
async function verifyAdmin() {
  const supabase = await getCallerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const adminClient = createServiceRoleClient();
  const { data: profile } = await adminClient
    .from('user_profiles')
    .select('system_role')
    .eq('id', user.id)
    .single();

  if (profile?.system_role !== 'admin') throw new Error('Unauthorized: Admin only');
  return user;
}

export async function createUserAction(data: {
  email: string;
  password: string;
  fullName: string;
  systemRole: string;
  employeeId?: string;
}) {
  await verifyAdmin();
  const adminClient = createServiceRoleClient();

  // Create auth user
  const { data: newUser, error } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.fullName,
      system_role: data.systemRole,
    },
  });

  if (error) throw new Error(error.message);

  // The trigger auto-creates user_profiles, but we need to update employee_id if provided
  if (data.employeeId && newUser.user) {
    const { error: updateError } = await adminClient
      .from('user_profiles')
      .update({
        employee_id: data.employeeId,
        full_name: data.fullName,
        system_role: data.systemRole,
      })
      .eq('id', newUser.user.id);

    if (updateError) {
      console.error('Failed to link employee:', updateError);
    }
  }

  return { userId: newUser.user?.id };
}

export async function updateUserAction(
  userId: string,
  data: {
    systemRole?: string;
    employeeId?: string | null;
    isActive?: boolean;
    fullName?: string;
  }
) {
  await verifyAdmin();
  const adminClient = createServiceRoleClient();

  const updateData: Record<string, any> = {};
  if (data.systemRole !== undefined) updateData.system_role = data.systemRole;
  if (data.employeeId !== undefined) updateData.employee_id = data.employeeId;
  if (data.isActive !== undefined) updateData.is_active = data.isActive;
  if (data.fullName !== undefined) updateData.full_name = data.fullName;

  const { error } = await adminClient
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  await verifyAdmin();
  const adminClient = createServiceRoleClient();

  // Delete auth user (cascades to user_profiles)
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);

  return { success: true };
}

export async function resetPasswordAction(userId: string, newPassword: string) {
  await verifyAdmin();
  const adminClient = createServiceRoleClient();

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}
