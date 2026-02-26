'use client';
import { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type GenericDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export const GenericDialog = ({
  open,
  onOpenChange,
  title,
  description = '',
  children,
  footer,
  className = '',
  titleClassName = '',
}: Readonly<GenericDialogProps>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-w-0 overflow-hidden py-2">{children}</div>
        {footer && (
          <DialogFooter className="min-w-0 gap-2 overflow-hidden">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
