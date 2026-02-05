'use client';

import { Sidebar, Header } from '@/components/layout';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { useUIStore } from '@/store/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main
          className={`pt-16 transition-all duration-300 ${
            sidebarCollapsed ? 'pl-16' : 'pl-64'
          }`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
