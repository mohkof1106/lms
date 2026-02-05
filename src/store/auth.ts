import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        set({ user: null, loading: false, initialized: true });
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        set({
          user: {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            systemRole: profile.system_role,
            employeeId: profile.employee_id,
            isActive: profile.is_active,
            createdAt: profile.created_at ?? '',
            updatedAt: profile.updated_at ?? '',
          },
          loading: false,
          initialized: true,
        });
      } else {
        set({ user: null, loading: false, initialized: true });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          set({ user: null });
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Re-fetch profile on sign in
          await get().refreshProfile();
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, loading: false, initialized: true });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    window.location.href = '/login';
  },

  refreshProfile: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      set({
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          avatarUrl: profile.avatar_url,
          systemRole: profile.system_role,
          employeeId: profile.employee_id,
          isActive: profile.is_active,
          createdAt: profile.created_at ?? '',
          updatedAt: profile.updated_at ?? '',
        },
      });
    }
  },
}));
