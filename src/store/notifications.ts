import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendPing: (senderId: string, senderName: string, recipientId: string, message?: string) => Promise<void>;
  startPolling: (userId: string) => void;
  stopPolling: () => void;

  // Callback for new notification (sound + toast)
  _onNewNotification: ((notification: Notification) => void) | null;
  setOnNewNotification: (cb: ((notification: Notification) => void) | null) => void;
  _pollingInterval: ReturnType<typeof setInterval> | null;
  _userId: string | null;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  _onNewNotification: null,
  _pollingInterval: null,
  _userId: null,

  setOnNewNotification: (cb) => set({ _onNewNotification: cb }),

  fetchNotifications: async (userId: string) => {
    set({ loading: true });
    const { data } = await supabase
      .from('notifications')
      .select('*, sender:sender_id(full_name)')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      const notifications: Notification[] = data.map((n: any) => ({
        id: n.id,
        recipientId: n.recipient_id,
        senderId: n.sender_id,
        senderName: n.sender?.full_name || null,
        type: n.type,
        title: n.title,
        message: n.message,
        relatedType: n.related_type,
        relatedId: n.related_id,
        isRead: n.is_read,
        createdAt: n.created_at,
      }));

      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
        loading: false,
      });
    } else {
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      };
    });
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  sendPing: async (senderId: string, senderName: string, recipientId: string, message?: string) => {
    const { error } = await supabase.from('notifications').insert({
      recipient_id: recipientId,
      sender_id: senderId,
      type: 'ping',
      title: `${senderName} pinged you`,
      message: message || null,
    });

    if (error) throw error;
  },

  startPolling: (userId: string) => {
    // Guard: clear existing interval
    const existing = get()._pollingInterval;
    if (existing) {
      clearInterval(existing);
    }

    set({ _userId: userId });

    // Poll every 30 seconds for new notifications
    const interval = setInterval(async () => {
      const prevIds = new Set(get().notifications.map((n) => n.id));

      const { data } = await supabase
        .from('notifications')
        .select('*, sender:sender_id(full_name)')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!data) return;

      const notifications: Notification[] = data.map((n: any) => ({
        id: n.id,
        recipientId: n.recipient_id,
        senderId: n.sender_id,
        senderName: n.sender?.full_name || null,
        type: n.type,
        title: n.title,
        message: n.message,
        relatedType: n.related_type,
        relatedId: n.related_id,
        isRead: n.is_read,
        createdAt: n.created_at,
      }));

      // Detect truly new notifications (not seen before)
      const newOnes = notifications.filter((n) => !prevIds.has(n.id));

      set({
        notifications,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      });

      // Trigger sound + toast for each new notification
      const cb = get()._onNewNotification;
      if (cb) {
        newOnes.forEach((n) => cb(n));
      }
    }, 30000);

    set({ _pollingInterval: interval });
  },

  stopPolling: () => {
    const { _pollingInterval } = get();
    if (_pollingInterval) {
      clearInterval(_pollingInterval);
      set({ _pollingInterval: null, _userId: null });
    }
  },
}));
