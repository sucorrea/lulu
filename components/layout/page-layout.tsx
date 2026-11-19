import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className }: PageLayoutProps) => (
  <section className="bg-background py-6 md:py-8">
    <div className={cn('container space-y-6', className)}>{children}</div>
  </section>
);

export default PageLayout;
