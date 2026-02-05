'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useNotificationStore } from '@/store/notifications';
import { NotificationItem } from './NotificationItem';
import { PingDialog } from './PingDialog';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const [pingDialogOpen, setPingDialogOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);

    // Navigate to related entity if applicable
    if (notification.relatedType && notification.relatedId) {
      switch (notification.relatedType) {
        case 'task':
          router.push(`/tasks?task=${notification.relatedId}`);
          break;
        case 'offer':
          router.push(`/offers/${notification.relatedId}`);
          break;
        case 'employee':
          router.push(`/employees/${notification.relatedId}`);
          break;
      }
      setOpen(false);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-96 p-0" sideOffset={8}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <h4 className="text-sm font-semibold">Notifications</h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setPingDialogOpen(true);
                  setOpen(false);
                }}
              >
                <Send className="mr-1 h-3 w-3" />
                Ping
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => markAllAsRead()}
                >
                  <CheckCheck className="mr-1 h-3 w-3" />
                  Read All
                </Button>
              )}
            </div>
          </div>
          <Separator />

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <PingDialog open={pingDialogOpen} onOpenChange={setPingDialogOpen} />
    </>
  );
}
