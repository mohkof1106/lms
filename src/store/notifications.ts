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
  subscribeToRealtime: (userId: string) => void;
  unsubscribe: () => void;

  // Callback for new notification (sound + toast)
  _onNewNotification: ((notification: Notification) => void) | null;
  setOnNewNotification: (cb: ((notification: Notification) => void) | null) => void;
  _channel: any;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  _onNewNotification: null,
  _channel: null,

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

  subscribeToRealtime: (userId: string) => {
    // Guard: remove existing channel before creating a new one
    const existing = get()._channel;
    if (existing) {
      supabase.removeChannel(existing);
    }

    try {
      const channel = supabase
        .channel('user-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${userId}`,
          },
          async (payload) => {
            const n = payload.new as any;

            // Fetch sender name
            let senderName: string | null = null;
            if (n.sender_id) {
              const { data: sender } = await supabase
                .from('user_profiles')
                .select('full_name')
                .eq('id', n.sender_id)
                .single();
              senderName = sender?.full_name || null;
            }

            const notification: Notification = {
              id: n.id,
              recipientId: n.recipient_id,
              senderId: n.sender_id,
              senderName: senderName || undefined,
              type: n.type,
              title: n.title,
              message: n.message,
              relatedType: n.related_type,
              relatedId: n.related_id,
              isRead: n.is_read,
              createdAt: n.created_at,
            };

            set((state) => ({
              notifications: [notification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            }));

            // Trigger callback (sound + toast)
            const cb = get()._onNewNotification;
            if (cb) cb(notification);
          }
        )
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('Realtime notifications: connected');
          } else if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime subscription error:', err?.message || err || 'unknown');
          } else if (status === 'CLOSED') {
            console.log('Realtime notifications: closed');
          }
        });

      set({ _channel: channel });
    } catch (err) {
      console.warn('Failed to setup Realtime subscription:', err);
    }
  },

  unsubscribe: () => {
    const { _channel } = get();
    if (_channel) {
      supabase.removeChannel(_channel);
      set({ _channel: null });
    }
  },
}));
