import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const generatedId = React.useId();
    const id = props.id ?? generatedId;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <>
        <input
          type={type}
          id={id}
          className={cn(
            'flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-base shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
            'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-red-500 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
      </>
    );
  }
);
Input.displayName = 'Input';

export { Input };
