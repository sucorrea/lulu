'use client';

import { ReactNode } from 'react';

import { Drawer } from 'vaul';

import { cn } from '@/lib/utils';

type GenericBottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export const GenericBottomSheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className = '',
}: Readonly<GenericBottomSheetProps>) => {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} autoFocus>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Drawer.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-border bg-background',
            className
          )}
        >
          <Drawer.Handle className="mx-auto mt-4 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
          <div className="flex flex-col gap-2 overflow-y-auto p-4 pb-8">
            <Drawer.Title className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </Drawer.Title>
            {description && (
              <Drawer.Description className="text-sm text-muted-foreground">
                {description}
              </Drawer.Description>
            )}
            <div className="py-2">{children}</div>
            {footer && (
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {footer}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
