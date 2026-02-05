'use client';

import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/store/notifications';
import { toast } from 'sonner';
import type { Notification } from '@/types';

// Generate a short notification chime via Web Audio API
function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gain.gain.value = 0.3;
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch {
    // Silently fail if AudioContext is not available
  }
}

export function useNotificationSound() {
  const setOnNewNotification = useNotificationStore((s) => s.setOnNewNotification);
  const callbackRef = useRef<(notification: Notification) => void>(undefined);

  useEffect(() => {
    callbackRef.current = (notification: Notification) => {
      // Play sound
      playNotificationSound();

      // Show toast
      toast(notification.title, {
        description: notification.message || undefined,
        duration: 5000,
      });
    };

    setOnNewNotification(callbackRef.current);

    return () => {
      setOnNewNotification(null);
    };
  }, [setOnNewNotification]);
}
