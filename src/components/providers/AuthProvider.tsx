'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notifications';
import { useNotificationSound } from '@/hooks/useNotificationSound';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, initialized, loading, user } = useAuthStore();
  const { fetchNotifications, subscribeToRealtime, unsubscribe } = useNotificationStore();
  const router = useRouter();

  // Initialize notification sound
  useNotificationSound();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Set up notifications when user is available
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(user.id);
      subscribeToRealtime(user.id);

      return () => {
        unsubscribe();
      };
    }
  }, [user?.id, fetchNotifications, subscribeToRealtime, unsubscribe]);

  // Show loading spinner while initializing
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
