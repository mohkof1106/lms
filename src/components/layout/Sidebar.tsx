'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  Package,
  FolderKanban,
  CheckSquare,
  Calculator,
  FileText,
  Receipt,
  Wallet,
  PieChart,
  Box,
  FileEdit,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useUIStore } from '@/store/ui';
import { useAuthStore } from '@/store/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', href: '/employees', icon: Users },
  { label: 'Customers', href: '/customers', icon: Building2 },
  { label: 'Services', href: '/services', icon: Layers },
  { label: 'Estimator', href: '/estimator', icon: Calculator },
  { label: 'Offers', href: '/offers', icon: FileText },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Expenses', href: '/expenses', icon: Wallet },
  { label: 'Finance', href: '/finance', icon: PieChart },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Packages', href: '/packages', icon: Package },
  { label: 'Assets', href: '/assets', icon: Box },
  { label: 'Editor', href: '/editor', icon: FileEdit },
];

interface SettingsSubItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const settingsSubItems: SettingsSubItem[] = [
  { label: 'Company', href: '/settings', icon: Settings },
  { label: 'Users', href: '/settings/users', icon: Shield, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed: collapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const [settingsExpanded, setSettingsExpanded] = useState(
    pathname.startsWith('/settings')
  );

  const isSettingsActive = pathname.startsWith('/settings');
  const isAdmin = user?.systemRole === 'admin';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center pl-2">
          <img src="/logo-icon.svg" alt="LOR" className={cn(
            "w-auto transition-all",
            collapsed ? "h-9" : "h-11"
          )} />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', collapsed && 'hidden')}
          onClick={toggleSidebar}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Settings group */}
        <div className="mt-1">
          <button
            onClick={() => {
              if (collapsed) {
                // Expand sidebar first, then show settings
                toggleSidebar();
                setSettingsExpanded(true);
              } else {
                setSettingsExpanded(!settingsExpanded);
              }
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isSettingsActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Settings</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    settingsExpanded ? 'rotate-0' : '-rotate-90'
                  )}
                />
              </>
            )}
          </button>

          {/* Settings sub-items */}
          {!collapsed && settingsExpanded && (
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-3">
              {settingsSubItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      </nav>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}
