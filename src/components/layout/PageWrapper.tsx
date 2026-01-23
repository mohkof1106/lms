'use client';

import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageWrapper({ children, title, description, actions }: PageWrapperProps) {
  return (
    <div className="flex flex-col gap-6">
      {(title || actions) && (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 mt-4 sm:mt-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
